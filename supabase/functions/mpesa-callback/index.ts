
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

interface MPESACallbackData {
  Body: {
    stkCallback: {
      MerchantRequestID: string;
      CheckoutRequestID: string;
      ResultCode: number;
      ResultDesc: string;
      CallbackMetadata?: {
        Item: Array<{
          Name: string;
          Value: string | number;
        }>;
      };
    };
  };
}

serve(async (req) => {
  try {
    const callbackData: MPESACallbackData = await req.json()
    console.log('MPESA Callback received:', JSON.stringify(callbackData, null, 2))

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '', // Use service role for callbacks
    )

    const { stkCallback } = callbackData.Body
    const isSuccessful = stkCallback.ResultCode === 0

    // Find the payment request
    const { data: paymentRequest, error: findError } = await supabaseClient
      .from('payment_requests')
      .select('*')
      .eq('checkout_request_id', stkCallback.CheckoutRequestID)
      .single()

    if (findError || !paymentRequest) {
      console.error('Payment request not found:', findError)
      return new Response('Payment request not found', { status: 404 })
    }

    if (isSuccessful && stkCallback.CallbackMetadata) {
      // Extract payment details from callback metadata
      const metadata = stkCallback.CallbackMetadata.Item
      const amount = metadata.find(item => item.Name === 'Amount')?.Value
      const receiptNumber = metadata.find(item => item.Name === 'MpesaReceiptNumber')?.Value
      const transactionDate = metadata.find(item => item.Name === 'TransactionDate')?.Value
      const phoneNumber = metadata.find(item => item.Name === 'PhoneNumber')?.Value

      // Create successful payment record
      const { error: paymentError } = await supabaseClient
        .from('mpesa_payments')
        .insert({
          user_id: paymentRequest.user_id,
          transaction_id: receiptNumber as string,
          phone_number: phoneNumber as string,
          amount: amount as number,
          payment_type: paymentRequest.payment_type,
          reference_id: paymentRequest.reference_id,
          checkout_request_id: stkCallback.CheckoutRequestID,
          merchant_request_id: stkCallback.MerchantRequestID,
          mpesa_receipt_number: receiptNumber as string,
          status: 'completed',
        })

      if (paymentError) {
        console.error('Error creating payment record:', paymentError)
      }

      // Update payment request status
      await supabaseClient
        .from('payment_requests')
        .update({ status: 'completed' })
        .eq('id', paymentRequest.id)

      // Create notification for successful payment
      await supabaseClient
        .from('notifications')
        .insert({
          user_id: paymentRequest.user_id,
          title: 'Payment Successful',
          message: `Your payment of KSh ${amount} has been received successfully.`,
          type: 'payment',
        })

    } else {
      // Payment failed
      await supabaseClient
        .from('payment_requests')
        .update({ 
          status: 'failed',
          result_code: stkCallback.ResultCode.toString(),
          result_desc: stkCallback.ResultDesc,
        })
        .eq('id', paymentRequest.id)

      // Create notification for failed payment
      await supabaseClient
        .from('notifications')
        .insert({
          user_id: paymentRequest.user_id,
          title: 'Payment Failed',
          message: `Your payment failed: ${stkCallback.ResultDesc}`,
          type: 'payment',
        })
    }

    return new Response('OK', { status: 200 })

  } catch (error) {
    console.error('Error in mpesa-callback function:', error)
    return new Response('Internal Server Error', { status: 500 })
  }
})

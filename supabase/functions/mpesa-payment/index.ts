
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface MPESATokenResponse {
  access_token: string;
  expires_in: string;
}

interface STKPushResponse {
  MerchantRequestID: string;
  CheckoutRequestID: string;
  ResponseCode: string;
  ResponseDescription: string;
  CustomerMessage: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { amount, phoneNumber, paymentRequestId } = await req.json()
    console.log('Received payment request:', { amount, phoneNumber, paymentRequestId })

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    )

    // Get MPESA configuration
    const { data: config, error: configError } = await supabaseClient
      .from('mpesa_configurations')
      .select('*')
      .eq('is_active', true)
      .single()

    if (configError || !config) {
      console.error('MPESA config error:', configError)
      return new Response(
        JSON.stringify({ success: false, message: 'MPESA configuration not found. Please contact support.' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    console.log('Using MPESA config:', { 
      business_short_code: config.business_short_code,
      callback_url: config.callback_url 
    })

    // Get OAuth token
    const tokenUrl = 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials'
    const credentials = btoa(`${config.consumer_key}:${config.consumer_secret}`)
    
    console.log('Requesting OAuth token...')
    const tokenResponse = await fetch(tokenUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${credentials}`,
      },
    })

    if (!tokenResponse.ok) {
      console.error('Token request failed:', await tokenResponse.text())
      throw new Error('Failed to get MPESA token')
    }

    const tokenData: MPESATokenResponse = await tokenResponse.json()
    console.log('OAuth token received successfully')

    // Initiate STK Push
    const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14)
    const password = btoa(config.business_short_code + config.passkey + timestamp)

    const stkPushUrl = 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest'
    const stkPushPayload = {
      BusinessShortCode: config.business_short_code,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: amount,
      PartyA: phoneNumber,
      PartyB: config.business_short_code,
      PhoneNumber: phoneNumber,
      CallBackURL: config.callback_url,
      AccountReference: `KIC-${paymentRequestId}`,
      TransactionDesc: 'KIC Payment',
    }

    console.log('Initiating STK Push...', {
      url: stkPushUrl,
      BusinessShortCode: stkPushPayload.BusinessShortCode,
      Amount: stkPushPayload.Amount,
      PhoneNumber: stkPushPayload.PhoneNumber
    })

    const stkResponse = await fetch(stkPushUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(stkPushPayload),
    })

    if (!stkResponse.ok) {
      const errorText = await stkResponse.text()
      console.error('STK Push request failed:', errorText)
      throw new Error(`STK Push request failed: ${errorText}`)
    }

    const stkData: STKPushResponse = await stkResponse.json()
    console.log('STK Push response:', stkData)

    // Update payment request with MPESA details
    const { error: updateError } = await supabaseClient
      .from('payment_requests')
      .update({
        checkout_request_id: stkData.CheckoutRequestID,
        merchant_request_id: stkData.MerchantRequestID,
        status: stkData.ResponseCode === '0' ? 'pending' : 'failed',
        updated_at: new Date().toISOString(),
      })
      .eq('id', paymentRequestId)

    if (updateError) {
      console.error('Error updating payment request:', updateError)
    }

    const success = stkData.ResponseCode === '0'
    console.log('Payment request processed:', { success, responseCode: stkData.ResponseCode })

    return new Response(
      JSON.stringify({
        success,
        message: success ? 'Payment request sent to your phone. Please enter your M-PESA PIN to complete the transaction.' : stkData.CustomerMessage,
        checkoutRequestId: stkData.CheckoutRequestID,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in mpesa-payment function:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: 'Payment processing failed. Please try again or contact support.',
        details: error.message 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})

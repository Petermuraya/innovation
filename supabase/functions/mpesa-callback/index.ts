import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Constants
const MPESA_SUCCESS_CODE = 0;
const HTTP_METHODS = {
  POST: "POST",
} as const;

// Types
interface CallbackMetadataItem {
  Name: string;
  Value: string | number;
}

interface STKCallback {
  MerchantRequestID: string;
  CheckoutRequestID: string;
  ResultCode: number;
  ResultDesc: string;
  CallbackMetadata?: {
    Item: CallbackMetadataItem[];
  };
}

interface MPESACallbackData {
  Body: {
    stkCallback: STKCallback;
  };
}

interface PaymentRequest {
  id: string;
  user_id: string;
  checkout_request_id: string;
  payment_type: string;
  reference_id: string;
  status: string;
}

interface PaymentRecord {
  user_id: string;
  transaction_id: string;
  phone_number: string;
  amount: number;
  payment_type: string;
  reference_id: string;
  checkout_request_id: string;
  merchant_request_id: string;
  mpesa_receipt_number: string;
  status: 'completed' | 'failed';
}

// Utility Functions
const validateEnvironment = () => {
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Supabase credentials not configured');
  }

  return { supabaseUrl, serviceRoleKey };
};

const getSupabaseClient = () => {
  const { supabaseUrl, serviceRoleKey } = validateEnvironment();
  return createClient(supabaseUrl, serviceRoleKey);
};

const extractMetadataValue = (
  metadata: CallbackMetadataItem[],
  name: string
): string | number | undefined => {
  return metadata.find(item => item.Name === name)?.Value;
};

const validateMetadata = (
  metadata: CallbackMetadataItem[],
  requiredFields: string[]
): Record<string, string | number> => {
  const result: Record<string, string | number> = {};
  
  for (const field of requiredFields) {
    const value = extractMetadataValue(metadata, field);
    if (value === undefined) {
      throw new Error(`Missing required field in metadata: ${field}`);
    }
    result[field] = value;
  }

  return result;
};

// Database Operations
const createPaymentRecord = async (
  supabaseClient: ReturnType<typeof createClient>,
  paymentData: PaymentRecord
) => {
  const { error } = await supabaseClient
    .from('mpesa_payments')
    .insert(paymentData);

  if (error) {
    throw new Error(`Payment record creation failed: ${error.message}`);
  }
};

const updatePaymentRequestStatus = async (
  supabaseClient: ReturnType<typeof createClient>,
  paymentRequestId: string,
  status: string,
  additionalFields: Record<string, unknown> = {}
) => {
  const { error } = await supabaseClient
    .from('payment_requests')
    .update({ 
      status,
      ...additionalFields
    })
    .eq('id', paymentRequestId);

  if (error) {
    throw new Error(`Payment request update failed: ${error.message}`);
  }
};

const createNotification = async (
  supabaseClient: ReturnType<typeof createClient>,
  notificationData: {
    user_id: string;
    title: string;
    message: string;
    type: string;
  }
) => {
  const { error } = await supabaseClient
    .from('notifications')
    .insert(notificationData);

  if (error) {
    console.error('Notification creation failed:', error);
  }
};

// Payment Handlers
const handleSuccessfulPayment = async (
  supabaseClient: ReturnType<typeof createClient>,
  callback: STKCallback,
  paymentRequest: PaymentRequest
) => {
  if (!callback.CallbackMetadata) {
    throw new Error('Missing callback metadata for successful payment');
  }

  const metadata = validateMetadata(callback.CallbackMetadata.Item, [
    'Amount',
    'MpesaReceiptNumber',
    'PhoneNumber'
  ]);

  const paymentRecord: PaymentRecord = {
    user_id: paymentRequest.user_id,
    transaction_id: String(metadata.MpesaReceiptNumber),
    phone_number: String(metadata.PhoneNumber),
    amount: Number(metadata.Amount),
    payment_type: paymentRequest.payment_type,
    reference_id: paymentRequest.reference_id,
    checkout_request_id: callback.CheckoutRequestID,
    merchant_request_id: callback.MerchantRequestID,
    mpesa_receipt_number: String(metadata.MpesaReceiptNumber),
    status: 'completed',
  };

  await createPaymentRecord(supabaseClient, paymentRecord);
  await updatePaymentRequestStatus(supabaseClient, paymentRequest.id, 'completed');
  
  await createNotification(supabaseClient, {
    user_id: paymentRequest.user_id,
    title: 'Payment Successful',
    message: `Your payment of KSh ${metadata.Amount} has been received successfully.`,
    type: 'payment',
  });
};

const handleFailedPayment = async (
  supabaseClient: ReturnType<typeof createClient>,
  callback: STKCallback,
  paymentRequest: PaymentRequest
) => {
  await updatePaymentRequestStatus(
    supabaseClient,
    paymentRequest.id,
    'failed',
    {
      result_code: callback.ResultCode.toString(),
      result_desc: callback.ResultDesc,
    }
  );

  await createNotification(supabaseClient, {
    user_id: paymentRequest.user_id,
    title: 'Payment Failed',
    message: `Your payment failed: ${callback.ResultDesc}`,
    type: 'payment',
  });
};

const findPaymentRequest = async (
  supabaseClient: ReturnType<typeof createClient>,
  checkoutRequestId: string
): Promise<PaymentRequest> => {
  const { data: paymentRequest, error } = await supabaseClient
    .from('payment_requests')
    .select('*')
    .eq('checkout_request_id', checkoutRequestId)
    .maybeSingle();

  if (error) {
    throw new Error(`Database error: ${error.message}`);
  }

  if (!paymentRequest) {
    throw new Error('Payment request not found');
  }

  return paymentRequest;
};

// Main Handler
const handleMPESACallback = async (req: Request) => {
  // Validate request method
  if (req.method !== HTTP_METHODS.POST) {
    return new Response('Method Not Allowed', { status: 405 });
  }

  // Parse and validate request body
  let callbackData: MPESACallbackData;
  try {
    callbackData = await req.json();
    if (!callbackData?.Body?.stkCallback) {
      return new Response('Invalid callback data', { status: 400 });
    }
  } catch (error) {
    return new Response('Invalid JSON payload', { status: 400 });
  }

  console.log('MPESA Callback received:', JSON.stringify(callbackData, null, 2));

  try {
    const supabaseClient = getSupabaseClient();
    const { stkCallback } = callbackData.Body;
    const paymentRequest = await findPaymentRequest(supabaseClient, stkCallback.CheckoutRequestID);

    if (stkCallback.ResultCode === MPESA_SUCCESS_CODE) {
      await handleSuccessfulPayment(supabaseClient, stkCallback, paymentRequest);
    } else {
      await handleFailedPayment(supabaseClient, stkCallback, paymentRequest);
    }

    return new Response('OK', { status: 200 });
  } catch (error) {
    console.error('Error processing MPESA callback:', error);
    
    const statusCode = error instanceof Error && error.message.includes('not found') 
      ? 404 
      : 500;
    
    return new Response(
      error instanceof Error ? error.message : 'Internal Server Error',
      { status: statusCode }
    );
  }
};

// Server
serve(handleMPESACallback);
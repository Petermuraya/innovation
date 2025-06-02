import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Constants
const MPESA_SUCCESS_CODE = '0';
const MPESA_SANDBOX_URL = 'https://sandbox.safaricom.co.ke';
const PRODUCTION_URL = 'https://api.safaricom.co.ke';
const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  OPTIONS: 'OPTIONS',
} as const;

// Types
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

interface PaymentRequest {
  id: string;
  user_id: string;
  amount: number;
  status: string;
}

interface MPESAConfig {
  id: string;
  business_short_code: string;
  consumer_key: string;
  consumer_secret: string;
  passkey: string;
  callback_url: string;
  is_active: boolean;
  is_sandbox: boolean;
}

// Security Headers
const securityHeaders = {
  'Access-Control-Allow-Origin': Deno.env.get('ALLOWED_ORIGIN') || '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Security-Policy': "default-src 'self'",
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
};

// Utility Functions
const validateEnvironment = () => {
  const requiredEnvVars = [
    'SUPABASE_URL',
    'SUPABASE_SERVICE_ROLE_KEY',
    'MPESA_ENVIRONMENT'
  ];

  for (const envVar of requiredEnvVars) {
    if (!Deno.env.get(envVar)) {
      throw new Error(`Missing required environment variable: ${envVar}`);
    }
  }

  return {
    supabaseUrl: Deno.env.get('SUPABASE_URL')!,
    serviceRoleKey: Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    isSandbox: Deno.env.get('MPESA_ENVIRONMENT') === 'sandbox',
  };
};

const getMPESAAPIBaseUrl = (isSandbox: boolean) => {
  return isSandbox ? MPESA_SANDBOX_URL : PRODUCTION_URL;
};

const getSupabaseClient = () => {
  const { supabaseUrl, serviceRoleKey } = validateEnvironment();
  return createClient(supabaseUrl, serviceRoleKey);
};

const validateInput = (input: unknown): { amount: number; phoneNumber: string; paymentRequestId: string } => {
  if (!input || typeof input !== 'object') {
    throw new Error('Invalid request body');
  }

  const { amount, phoneNumber, paymentRequestId } = input as Record<string, unknown>;

  if (typeof amount !== 'number' || amount <= 0) {
    throw new Error('Invalid amount');
  }

  if (typeof phoneNumber !== 'string' || !/^254\d{9}$/.test(phoneNumber)) {
    throw new Error('Invalid phone number format. Must start with 254 followed by 9 digits');
  }

  if (typeof paymentRequestId !== 'string' || paymentRequestId.length < 10) {
    throw new Error('Invalid payment request ID');
  }

  return { amount, phoneNumber, paymentRequestId };
};

// MPESA Operations
const getMPESAToken = async (config: MPESAConfig): Promise<string> => {
  const tokenUrl = `${getMPESAAPIBaseUrl(config.is_sandbox)}/oauth/v1/generate?grant_type=client_credentials`;
  
  const encoder = new TextEncoder();
  const data = encoder.encode(`${config.consumer_key}:${config.consumer_secret}`);
  const credentials = btoa(String.fromCharCode(...data));

  const response = await fetch(tokenUrl, {
    method: HTTP_METHODS.GET,
    headers: {
      'Authorization': `Basic ${credentials}`,
    },
  });

  if (!response.ok) {
    throw new Error(`MPESA token request failed with status: ${response.status}`);
  }

  const tokenData: MPESATokenResponse = await response.json();
  return tokenData.access_token;
};

const initiateSTKPush = async (
  config: MPESAConfig,
  token: string,
  amount: number,
  phoneNumber: string,
  paymentRequestId: string
): Promise<STKPushResponse> => {
  const stkPushUrl = `${getMPESAAPIBaseUrl(config.is_sandbox)}/mpesa/stkpush/v1/processrequest`;
  const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14);
  
  const encoder = new TextEncoder();
  const passwordData = encoder.encode(`${config.business_short_code}${config.passkey}${timestamp}`);
  const password = btoa(String.fromCharCode(...passwordData));

  const payload = {
    BusinessShortCode: config.business_short_code,
    Password: password,
    Timestamp: timestamp,
    TransactionType: 'CustomerPayBillOnline',
    Amount: amount,
    PartyA: phoneNumber,
    PartyB: config.business_short_code,
    PhoneNumber: phoneNumber,
    CallBackURL: config.callback_url,
    AccountReference: `PAY-${paymentRequestId}`,
    TransactionDesc: 'Payment for services',
  };

  const response = await fetch(stkPushUrl, {
    method: HTTP_METHODS.POST,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`STK Push failed: ${errorText}`);
  }

  return await response.json();
};

// Database Operations
const getMPESAConfig = async (supabaseClient: ReturnType<typeof createClient>): Promise<MPESAConfig> => {
  const { data: config, error } = await supabaseClient
    .from('mpesa_configurations')
    .select('*')
    .eq('is_active', true)
    .single();

  if (error || !config) {
    throw new Error(error?.message || 'Active MPESA configuration not found');
  }

  return config;
};

const updatePaymentRequest = async (
  supabaseClient: ReturnType<typeof createClient>,
  paymentRequestId: string,
  updateData: Partial<PaymentRequest> & {
    checkout_request_id?: string;
    merchant_request_id?: string;
  }
) => {
  const { error } = await supabaseClient
    .from('payment_requests')
    .update({
      ...updateData,
      updated_at: new Date().toISOString(),
    })
    .eq('id', paymentRequestId);

  if (error) {
    throw new Error(`Failed to update payment request: ${error.message}`);
  }
};

// Main Handler
const handlePaymentRequest = async (req: Request) => {
  // Handle CORS preflight
  if (req.method === HTTP_METHODS.OPTIONS) {
    return new Response(null, { 
      headers: securityHeaders,
      status: 204 
    });
  }

  // Validate method
  if (req.method !== HTTP_METHODS.POST) {
    return new Response(
      JSON.stringify({ success: false, message: 'Method not allowed' }),
      { 
        headers: { ...securityHeaders, 'Content-Type': 'application/json' },
        status: 405 
      }
    );
  }

  try {
    // Validate and parse input
    const input = await req.json();
    const { amount, phoneNumber, paymentRequestId } = validateInput(input);

    // Initialize services
    const supabaseClient = getSupabaseClient();
    const config = await getMPESAConfig(supabaseClient);

    // Get MPESA token
    const token = await getMPESAToken(config);

    // Initiate payment
    const stkResponse = await initiateSTKPush(
      config,
      token,
      amount,
      phoneNumber,
      paymentRequestId
    );

    // Update payment request
    await updatePaymentRequest(supabaseClient, paymentRequestId, {
      checkout_request_id: stkResponse.CheckoutRequestID,
      merchant_request_id: stkResponse.MerchantRequestID,
      status: stkResponse.ResponseCode === MPESA_SUCCESS_CODE ? 'pending' : 'failed',
    });

    // Return response
    const success = stkResponse.ResponseCode === MPESA_SUCCESS_CODE;
    return new Response(
      JSON.stringify({
        success,
        message: success 
          ? 'Payment request sent to your phone. Please enter your M-PESA PIN to complete.' 
          : stkResponse.CustomerMessage,
        checkoutRequestId: stkResponse.CheckoutRequestID,
      }),
      { 
        headers: { ...securityHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Payment processing error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: 'Payment processing failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      { 
        headers: { ...securityHeaders, 'Content-Type': 'application/json' },
        status: error instanceof Error && error.message.includes('not found') ? 404 : 500 
      }
    );
  }
};

// Start server
serve(handlePaymentRequest, {
  onListen: ({ hostname, port }) => {
    console.log(`Server running at http://${hostname}:${port}`);
  },
});
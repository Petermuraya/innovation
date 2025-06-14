
// Error handling utilities
export class ChatbotError extends Error {
  constructor(message: string, public userMessage: string, public status = 500) {
    super(message);
    this.name = 'ChatbotError';
  }
}

export const createErrorResponse = (err: any, corsHeaders: Record<string, string>) => {
  console.error('❌ Error in chatbot handler:', err);

  const status = err instanceof ChatbotError ? err.status : 500;
  const userMessage = err instanceof ChatbotError ? err.userMessage : 
    'I apologize, but I encountered an unexpected error. Our team has been notified and we\'re working to resolve this. Please try again in a few moments.';

  return new Response(JSON.stringify({
    error: userMessage,
    details: status === 500 ? 'Internal server error' : err.message,
    timestamp: new Date().toISOString()
  }), {
    status,
    headers: { 
      ...corsHeaders, 
      'Content-Type': 'application/json',
      'X-Chatbot-Error': 'true',
      'X-Chatbot-Version': '2.0'
    },
  });
};

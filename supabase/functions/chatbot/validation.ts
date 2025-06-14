
import { ChatbotError } from './errors.ts';

export function validateRequest(req: Request) {
  if (req.method !== 'POST') {
    throw new ChatbotError('Invalid method', 'Only POST requests are allowed', 405);
  }

  const contentType = req.headers.get('content-type');
  if (!contentType?.includes('application/json')) {
    throw new ChatbotError('Invalid content type', 'Request must be JSON', 400);
  }
}

export function validateRequestBody(body: any) {
  const { message } = body;
  
  if (!message || typeof message !== 'string') {
    throw new ChatbotError('Invalid message', 'Message is required and must be a string', 400);
  }

  return body;
}

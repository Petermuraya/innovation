
import { GROQ_API_URL, GROQ_MODEL } from './config.ts';
import { ChatbotError } from './errors.ts';

export async function callGroqAPI(systemPrompt: string, userMessage: string, conversationHistory?: string) {
  const groqApiKey = Deno.env.get('GROQ_API_KEY') ?? '';
  
  if (!groqApiKey) {
    console.error('❌ Missing GROQ_API_KEY in environment variables');
    throw new ChatbotError(
      'Server configuration error - missing API key',
      'Our AI assistant is temporarily unavailable. Please try again in a moment.',
      503
    );
  }

  console.log('🤖 Sending enhanced request to Groq API with improved model...');
  
  // Build conversation context for better intelligence
  const messages = [
    { role: 'system', content: systemPrompt }
  ];

  // Add conversation history for better context understanding
  if (conversationHistory) {
    const historyLines = conversationHistory.split('\n').filter(line => line.trim());
    for (const line of historyLines) {
      if (line.startsWith('User: ')) {
        messages.push({ role: 'user', content: line.substring(6) });
      } else if (line.startsWith('Assistant: ')) {
        messages.push({ role: 'assistant', content: line.substring(11) });
      }
    }
  }

  // Add current user message
  messages.push({ role: 'user', content: userMessage });

  const aiResponse = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${groqApiKey}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages: messages,
      temperature: 0.8, // Increased for more creative and engaging responses
      max_tokens: 2048, // Increased for more comprehensive responses
      top_p: 0.9,
      frequency_penalty: 0.3, // Increased to reduce repetition
      presence_penalty: 0.4, // Increased for more diverse responses
      stream: false
    }),
  });

  if (!aiResponse.ok) {
    const errorText = await aiResponse.text();
    console.error('❌ Groq API error:', errorText);
    throw new ChatbotError(
      `Groq API error: ${aiResponse.status}`,
      'Our AI assistant is temporarily unavailable. Please try again in a moment.',
      503
    );
  }

  const responseData = await aiResponse.json();
  const botReply = responseData.choices?.[0]?.message?.content;

  if (!botReply) {
    console.error('❌ Invalid response structure from Groq API:', responseData);
    throw new ChatbotError(
      'Invalid AI response structure',
      'I apologize, but I encountered an issue processing your request. Please try rephrasing your question.',
      500
    );
  }

  console.log('✅ Successfully generated enhanced AI response');
  return { botReply, usage: responseData.usage };
}

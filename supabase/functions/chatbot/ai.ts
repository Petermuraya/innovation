
import { GROQ_API_URL, GROQ_MODEL } from './config.ts';
import { ChatbotError } from './errors.ts';

export async function callGroqAPI(systemPrompt: string, userMessage: string) {
  const groqApiKey = Deno.env.get('GROQ_API_KEY') ?? '';
  
  if (!groqApiKey) {
    console.error('❌ Missing GROQ_API_KEY in environment variables');
    throw new ChatbotError(
      'Server configuration error - missing API key',
      'Our AI assistant is temporarily unavailable. Please try again in a moment.',
      503
    );
  }

  console.log('🤖 Sending request to Groq API...');
  
  const aiResponse = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${groqApiKey}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage }
      ],
      temperature: 0.7,
      max_tokens: 1024,
      top_p: 0.9,
      frequency_penalty: 0.2,
      presence_penalty: 0.2,
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

  console.log('✅ Successfully generated AI response');
  return { botReply, usage: responseData.usage };
}

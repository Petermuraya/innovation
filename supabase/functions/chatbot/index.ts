
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, userId, sessionId } = await req.json();
    console.log('Received chatbot request:', { message, userId, sessionId });

    // Get user context if authenticated
    let userContext = '';
    if (userId) {
      const { data: member } = await supabase
        .from('members')
        .select('name, registration_status, course')
        .eq('user_id', userId)
        .single();
      
      if (member) {
        userContext = `User is ${member.name}, studying ${member.course || 'N/A'}, registration status: ${member.registration_status}. `;
      }
    }

    // Build system prompt with context about the club
    const systemPrompt = `You are an intelligent assistant for the Karatina University Innovation Club website. Your role is to help users with:

1. ANSWERING QUESTIONS about the club, events, projects, and membership
2. WEBSITE NAVIGATION - Help users find pages and features
3. REGISTRATION ASSISTANCE - Guide users through the signup process
4. MEMBER STATUS - Help check registration status and next steps

CLUB INFORMATION:
- Karatina University Innovation Club is a tech and entrepreneurship community
- We organize workshops, hackathons, career fairs, and tech talks
- Students can join to learn programming, work on projects, and network
- Registration requires approval from administrators
- We have events like Web Development Bootcamp, AI Hackathon, Tech Career Fair
- Projects include web development, mobile apps, AI solutions

WEBSITE STRUCTURE:
- Home: Main page with overview
- About: Club information and mission
- Projects: Project showcase and submissions
- Events: Upcoming and past events
- Blogs: Latest news and updates
- Careers: Job opportunities and career board
- Leaderboard: Member rankings and achievements
- Dashboard: Member area (requires login and approval)
- Login/Register: Authentication pages

CURRENT USER CONTEXT: ${userContext}

Be helpful, friendly, and concise. If users ask about specific features, guide them to the right pages. For registration issues, explain the approval process. Always stay in character as the club's assistant.`;

    // Call Groq API
    const groqApiKey = Deno.env.get('GROQ_API_KEY');
    if (!groqApiKey) {
      throw new Error('GROQ_API_KEY not found');
    }

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'mixtral-8x7b-32768',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.status}`);
    }

    const data = await response.json();
    const botResponse = data.choices[0].message.content;

    // Store conversation in database
    await supabase.from('chatbot_conversations').insert({
      session_id: sessionId,
      user_id: userId,
      message: message,
      response: botResponse,
      is_user_message: true
    });

    await supabase.from('chatbot_conversations').insert({
      session_id: sessionId,
      user_id: userId,
      message: botResponse,
      response: '',
      is_user_message: false
    });

    console.log('Chatbot response generated successfully');

    return new Response(JSON.stringify({ response: botResponse }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in chatbot function:', error);
    return new Response(JSON.stringify({ 
      error: 'Sorry, I encountered an error. Please try again later.',
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

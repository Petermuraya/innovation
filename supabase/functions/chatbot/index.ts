import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
};

// Supabase client with enhanced configuration
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    },
    global: {
      headers: { 'X-Client-Info': 'kuic-chatbot/1.0' }
    }
  }
);

// Groq API configuration
const groqApiKey = Deno.env.get('GROQ_API_KEY') ?? '';
const groqApiUrl = 'https://api.groq.com/openai/v1/chat/completions';
const groqModel = 'llama3-70b-8192'; // Upgraded to more powerful model

if (!groqApiKey) {
  console.error('❌ Missing GROQ_API_KEY in environment variables');
  throw new Error('Server configuration error - missing API key');
}

// Knowledge cutoff date for the AI
const KNOWLEDGE_CUTOFF = '2024-06-01';

// Club information database (can be moved to Supabase if frequently updated)
const CLUB_INFO = {
  upcomingEvents: [
    { name: "Web Development Bootcamp", date: "2024-07-15", registrationDeadline: "2024-07-10" },
    { name: "AI Hackathon", date: "2024-08-20", registrationDeadline: "2024-08-10" },
    { name: "Tech Career Fair", date: "2024-09-05", registrationDeadline: "2024-08-25" }
  ],
  popularProjects: [
    "KUIC Student Portal Redesign",
    "Campus Navigation App",
    "AI-powered Library Assistant",
    "E-waste Recycling Platform"
  ],
  faqs: {
    registration: "Registration typically takes 2-3 business days for approval.",
    membership: "All active Karatina University students are eligible to join.",
    events: "Most events are free for members, some workshops may have small fees."
  }
};

// Enhanced system prompt template with more context
const generateSystemPrompt = (userContext: string, conversationHistory: string) => `
# ROLE: Karatina University Innovation Club Assistant
## KNOWLEDGE CUTOFF: ${KNOWLEDGE_CUTOFF}
## TONE: Friendly, professional, enthusiastic about tech and innovation

## CORE RESPONSIBILITIES:
1. INFORMATION PROVIDER:
   - Club activities, events, projects
   - Membership benefits and requirements
   - University innovation ecosystem

2. NAVIGATION GUIDE:
   - Website structure and features
   - Important pages and resources
   - Event registration processes

3. MEMBER SUPPORT:
   - Registration status checks
   - Project submission guidance
   - Event participation queries

## CLUB DETAILS:
- Name: Karatina University Innovation Club (KUIC)
- Type: Student-run tech & entrepreneurship community
- Membership: Open to all KU students (requires approval)
- Activities: Workshops, hackathons, tech talks, project collaborations
- Benefits: Skill development, networking, competition participation

## WEBSITE STRUCTURE:
1. Main Sections:
   - /home - Overview and announcements
   - /about - Club mission and leadership
   - /projects - Current and past projects
   - /events - Calendar and registration
   - /resources - Learning materials
   - /leaderboard - Member achievements

2. Member Areas (require login):
   - /dashboard - Personal workspace
   - /profile - Account management
   - /my-projects - Project submissions

## CURRENT USER CONTEXT:
${userContext}

## CONVERSATION HISTORY:
${conversationHistory || "No prior conversation in this session"}

## RESPONSE GUIDELINES:
- Be concise but thorough (3-5 sentences typically)
- Use bullet points for complex information
- Offer relevant links when appropriate
- For technical questions, provide both conceptual explanations and practical steps
- Always maintain positive, encouraging tone
- If unsure, ask clarifying questions
- Never make up information - say "I don't know" if uncertain`;

// Cache for frequently accessed data
const cache = {
  memberData: new Map<string, any>(),
  lastUpdated: 0
};

// Helper function to get member data with caching
async function getMemberData(userId: string) {
  const now = Date.now();
  
  // Cache expires after 5 minutes
  if (cache.memberData.has(userId) && (now - cache.lastUpdated) < 300000) {
    return cache.memberData.get(userId);
  }

  const { data: member, error } = await supabase
    .from('members')
    .select(`
      name,
      email,
      registration_status,
      course,
      year_of_study,
      skills,
      projects:member_projects(project_id, role),
      events:event_registrations(event_id, status)
    `)
    .eq('user_id', userId)
    .single();

  if (!error && member) {
    cache.memberData.set(userId, member);
    cache.lastUpdated = now;
  }

  return member || null;
}

// Helper to get conversation history
async function getConversationHistory(sessionId: string, limit = 5) {
  const { data, error } = await supabase
    .from('chatbot_conversations')
    .select('message, response, created_at')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.warn('⚠️ Error fetching conversation history:', error);
    return null;
  }

  return data.reverse().map(msg => 
    `${msg.is_user_message ? 'User' : 'Assistant'}: ${msg.message || msg.response}`
  ).join('\n');
}

// Enhanced error handling
class ChatbotError extends Error {
  constructor(message: string, public userMessage: string, public status = 500) {
    super(message);
    this.name = 'ChatbotError';
  }
}

// Main serve handler
serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Validate request
    if (req.method !== 'POST') {
      throw new ChatbotError('Invalid method', 'Only POST requests are allowed', 405);
    }

    const contentType = req.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      throw new ChatbotError('Invalid content type', 'Request must be JSON', 400);
    }

    const { message, userId, sessionId } = await req.json();
    if (!message || typeof message !== 'string') {
      throw new ChatbotError('Invalid message', 'Message is required and must be a string', 400);
    }

    console.log('👉 Received chatbot request:', { message, userId, sessionId });

    // Build comprehensive user context
    let userContext = 'New user - no prior information available.';
    let memberData = null;

    if (userId) {
      try {
        memberData = await getMemberData(userId);
        if (memberData) {
          userContext = `Member: ${memberData.name} (${memberData.email})
          - Course: ${memberData.course || 'Not specified'}
          - Year: ${memberData.year_of_study || 'Not specified'}
          - Status: ${memberData.registration_status || 'Not specified'}
          - Skills: ${memberData.skills?.join(', ') || 'None listed'}
          - Projects: ${memberData.projects?.length || 0} registered
          - Events: ${memberData.events?.length || 0} attended`;
        }
      } catch (err) {
        console.warn('⚠️ Error building user context:', err);
      }
    }

    // Get conversation history for context
    const conversationHistory = sessionId ? await getConversationHistory(sessionId) : null;

    // Construct AI request with enhanced parameters
    const systemPrompt = generateSystemPrompt(userContext, conversationHistory);

    const aiResponse = await fetch(groqApiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        model: groqModel,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
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
        'Our AI service is temporarily unavailable. Please try again shortly.',
        503
      );
    }

    const responseData = await aiResponse.json();
    const botReply = responseData.choices?.[0]?.message?.content;

    if (!botReply) {
      console.error('❌ Invalid response structure from AI service:', responseData);
      throw new ChatbotError(
        'Invalid AI response structure',
        'Received an unexpected response from our AI service. Our team has been notified.',
        500
      );
    }

    // Enhanced conversation logging
    if (userId && sessionId) {
      try {
        const messagesToSave = [
          {
            session_id: sessionId,
            user_id: userId,
            message: message,
            response: botReply,
            is_user_message: true,
            metadata: {
              model: groqModel,
              tokens: responseData.usage?.total_tokens,
              context: userContext
            }
          },
          {
            session_id: sessionId,
            user_id: userId,
            message: botReply,
            response: '',
            is_user_message: false,
            metadata: {
              model: groqModel,
              tokens: responseData.usage?.total_tokens
            }
          }
        ];

        const { error: dbError } = await supabase
          .from('chatbot_conversations')
          .insert(messagesToSave);

        if (dbError) {
          console.error('⚠️ Error saving conversation to DB:', dbError);
        } else {
          console.log('✅ Conversation saved with metadata');
        }
      } catch (dbError) {
        console.error('⚠️ Database save operation failed:', dbError);
      }
    }

    // Enhanced response with metadata
    const responsePayload = {
      response: botReply,
      metadata: {
        model: groqModel,
        tokens: responseData.usage?.total_tokens,
        timestamp: new Date().toISOString(),
        context: userId ? 'authenticated' : 'anonymous'
      }
    };

    return new Response(JSON.stringify(responsePayload), {
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'application/json',
        'X-Chatbot-Version': '1.1'
      },
    });

  } catch (err) {
    console.error('❌ Error in chatbot handler:', err);

    const status = err instanceof ChatbotError ? err.status : 500;
    const userMessage = err instanceof ChatbotError ? err.userMessage : 
      'An unexpected error occurred. Our team has been notified. Please try again later.';

    return new Response(JSON.stringify({
      error: userMessage,
      details: status === 500 ? 'Internal server error' : err.message
    }), {
      status,
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'application/json',
        'X-Chatbot-Error': 'true'
      },
    });
  }
});
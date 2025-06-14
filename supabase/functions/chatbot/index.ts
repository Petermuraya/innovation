
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
      headers: { 'X-Client-Info': 'kuic-chatbot/2.0' }
    }
  }
);

// Groq API configuration - now using secure environment variable
const groqApiKey = Deno.env.get('GROQ_API_KEY') ?? '';
const groqApiUrl = 'https://api.groq.com/openai/v1/chat/completions';
const groqModel = 'llama3-70b-8192';

if (!groqApiKey) {
  console.error('❌ Missing GROQ_API_KEY in environment variables');
  throw new Error('Server configuration error - missing API key');
}

// Knowledge cutoff date for the AI
const KNOWLEDGE_CUTOFF = '2024-06-01';

// Enhanced club information database
const CLUB_INFO = {
  upcomingEvents: [
    { name: "Web Development Bootcamp", date: "2024-07-15", registrationDeadline: "2024-07-10" },
    { name: "AI Hackathon", date: "2024-08-20", registrationDeadline: "2024-08-10" },
    { name: "Tech Career Fair", date: "2024-09-05", registrationDeadline: "2024-08-25" },
    { name: "Innovation Showcase", date: "2024-09-20", registrationDeadline: "2024-09-15" }
  ],
  popularProjects: [
    "KUIC Student Portal Redesign",
    "Campus Navigation App",
    "AI-powered Library Assistant",
    "E-waste Recycling Platform",
    "Smart Attendance System"
  ],
  faqs: {
    registration: "Registration typically takes 2-3 business days for approval.",
    membership: "All active Karatina University students are eligible to join.",
    events: "Most events are free for members, some workshops may have small fees.",
    projects: "Members can submit projects through the dashboard for review and showcase.",
    blog: "Members can write and publish blog posts after admin verification."
  },
  websiteFeatures: {
    dashboard: "Personal workspace with projects, events, certificates, and profile management",
    blogging: "Write and publish blog posts with image/video attachments",
    projects: "Submit and showcase your projects with tech stack details",
    events: "Browse and register for upcoming events and workshops",
    careers: "Access job opportunities and career resources",
    leaderboard: "View member rankings based on participation and achievements",
    elections: "Participate in club elections and vote for leadership positions",
    certificates: "View and download your achievement certificates",
    communities: "Join specialized communities within the club",
    payments: "Manage membership payments and event fees"
  }
};

// Enhanced system prompt with comprehensive context
const generateSystemPrompt = (userContext: string, conversationHistory: string) => `
# ROLE: Karatina University Innovation Club (KUIC) AI Assistant
## KNOWLEDGE CUTOFF: ${KNOWLEDGE_CUTOFF}
## TONE: Friendly, professional, enthusiastic about tech and innovation

## CORE RESPONSIBILITIES:
1. **INFORMATION PROVIDER**: Club activities, events, projects, membership benefits
2. **NAVIGATION GUIDE**: Website features, page structure, registration processes
3. **MEMBER SUPPORT**: Registration status, project guidance, event participation
4. **TECH MENTOR**: Programming advice, project ideas, career guidance

## CLUB DETAILS:
- **Name**: Karatina University Innovation Club (KUIC)
- **Mission**: Fostering innovation, technology skills, and entrepreneurship
- **Membership**: Open to all KU students (requires approval process)
- **Activities**: Workshops, hackathons, tech talks, project collaborations, competitions

## WEBSITE NAVIGATION GUIDE:
### Public Pages:
- **/** (Home): Club overview, featured projects, upcoming events
- **/about**: Club mission, leadership team, history
- **/projects**: Browse all approved projects with filtering
- **/events**: Event calendar and registration
- **/blogs**: Read published blog posts from members
- **/careers**: Job opportunities and career resources
- **/leaderboard**: Member achievements and rankings
- **/elections**: Club elections and voting (when active)

### Member Dashboard (/dashboard):
- **Overview**: Personal stats, notifications, quick actions
- **Profile**: Edit personal information, skills, and bio
- **Projects**: Submit new projects, view submissions status
- **Events**: Registered events, attendance history
- **Blogging**: Write and manage blog posts
- **Communities**: Join specialized tech communities
- **Elections**: Apply for positions, vote in elections
- **Careers**: Personalized job recommendations
- **Payments**: Membership and event payment history
- **Certificates**: Download achievement certificates

### Authentication:
- **/login**: Sign in to access member features
- **/register**: Create new member account

## CURRENT USER CONTEXT:
${userContext}

## CONVERSATION HISTORY:
${conversationHistory || "No prior conversation in this session"}

## RESPONSE GUIDELINES:
1. **Personalization**: Use user's name and context when available
2. **Conciseness**: Aim for 3-5 sentences typically, use bullet points for lists
3. **Actionable**: Provide specific next steps and relevant links
4. **Encouraging**: Maintain positive, motivating tone
5. **Technical Support**: Offer programming help and project guidance
6. **Navigation Help**: Guide users to relevant website sections

## SPECIAL FEATURES TO HIGHLIGHT:
- **Point System**: Earn points for activities (website visits, event attendance, project submissions)
- **Badges**: Achievement recognition system
- **Real-time**: Live notifications and updates
- **Mobile-friendly**: Responsive design for all devices
- **Community**: Specialized groups for different tech interests

## CONVERSATION STARTERS:
- Ask about specific needs (project help, event info, career advice)
- Suggest relevant website features based on user status
- Recommend upcoming events or opportunities
- Offer technical guidance for projects

Remember: If you're unsure about specific details, ask clarifying questions. Always prioritize being helpful and encouraging innovation!`;

// Enhanced member data retrieval with caching
const cache = {
  memberData: new Map<string, any>(),
  lastUpdated: 0
};

async function getMemberData(userId: string) {
  const now = Date.now();
  
  // Cache expires after 5 minutes
  if (cache.memberData.has(userId) && (now - cache.lastUpdated) < 300000) {
    return cache.memberData.get(userId);
  }

  try {
    const { data: member, error } = await supabase
      .from('members')
      .select(`
        name,
        email,
        registration_status,
        course,
        year_of_study,
        skills,
        bio,
        github_username,
        linkedin_url
      `)
      .eq('user_id', userId)
      .single();

    if (error) {
      console.warn('⚠️ Error fetching member data:', error);
      return null;
    }

    // Get additional user activity data
    const [projectsResult, eventsResult, pointsResult] = await Promise.all([
      supabase.from('project_submissions').select('id, title, status').eq('user_id', userId).limit(5),
      supabase.from('event_registrations').select('id').eq('user_id', userId),
      supabase.from('member_points').select('points').eq('user_id', userId)
    ]);

    const enrichedMember = {
      ...member,
      recentProjects: projectsResult.data || [],
      eventsAttended: eventsResult.data?.length || 0,
      totalPoints: pointsResult.data?.reduce((sum, p) => sum + p.points, 0) || 0
    };

    cache.memberData.set(userId, enrichedMember);
    cache.lastUpdated = now;
    
    return enrichedMember;
  } catch (err) {
    console.warn('⚠️ Error in getMemberData:', err);
    return null;
  }
}

// Enhanced conversation history retrieval
async function getConversationHistory(sessionId: string, limit = 5) {
  try {
    const { data, error } = await supabase
      .from('chatbot_conversations')
      .select('message, response, created_at, is_user_message')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: false })
      .limit(limit * 2); // Get both user and bot messages

    if (error) {
      console.warn('⚠️ Error fetching conversation history:', error);
      return null;
    }

    return data?.reverse().map(msg => 
      `${msg.is_user_message ? 'User' : 'Assistant'}: ${msg.is_user_message ? msg.message : msg.response}`
    ).join('\n') || null;
  } catch (err) {
    console.warn('⚠️ Error in getConversationHistory:', err);
    return null;
  }
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

    console.log('👉 Received enhanced chatbot request:', { 
      message: message.substring(0, 50) + '...', 
      userId: userId ? 'authenticated' : 'anonymous', 
      sessionId 
    });

    // Build comprehensive user context
    let userContext = 'Anonymous visitor - encourage them to sign up for full club benefits and personalized experience.';
    let memberData = null;

    if (userId) {
      try {
        memberData = await getMemberData(userId);
        if (memberData) {
          userContext = `
**Authenticated Member**: ${memberData.name} (${memberData.email})
- **Course**: ${memberData.course || 'Not specified'}
- **Year**: ${memberData.year_of_study || 'Not specified'}
- **Status**: ${memberData.registration_status || 'Pending'}
- **Skills**: ${memberData.skills?.join(', ') || 'None listed'}
- **Total Points**: ${memberData.totalPoints}
- **Events Attended**: ${memberData.eventsAttended}
- **Recent Projects**: ${memberData.recentProjects?.length || 0} projects
- **Bio**: ${memberData.bio || 'No bio provided'}
- **GitHub**: ${memberData.github_username || 'Not provided'}
- **LinkedIn**: ${memberData.linkedin_url || 'Not provided'}

**Personalization Notes**: 
- Greet by name when appropriate
- Reference their projects and achievements
- Suggest relevant opportunities based on their skills and interests
- Encourage participation in areas they haven't explored yet`;
        }
      } catch (err) {
        console.warn('⚠️ Error building user context:', err);
        userContext = 'Authenticated user - some profile data unavailable, but still provide full member support.';
      }
    }

    // Get conversation history for context
    const conversationHistory = sessionId ? await getConversationHistory(sessionId) : null;

    // Construct enhanced AI request
    const systemPrompt = generateSystemPrompt(userContext, conversationHistory);

    console.log('🤖 Sending request to Groq API...');
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

    // Enhanced conversation logging with metadata
    if (userId && sessionId) {
      try {
        const conversationEntries = [
          {
            session_id: sessionId,
            user_id: userId,
            message: message,
            response: '',
            is_user_message: true,
            created_at: new Date().toISOString()
          },
          {
            session_id: sessionId,
            user_id: userId,
            message: '',
            response: botReply,
            is_user_message: false,
            created_at: new Date().toISOString()
          }
        ];

        const { error: dbError } = await supabase
          .from('chatbot_conversations')
          .insert(conversationEntries);

        if (dbError) {
          console.error('⚠️ Error saving conversation to database:', dbError);
        } else {
          console.log('✅ Conversation saved successfully');
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
        tokens: responseData.usage?.total_tokens || 0,
        timestamp: new Date().toISOString(),
        userContext: userId ? 'authenticated' : 'anonymous',
        sessionId: sessionId,
        version: '2.0'
      }
    };

    console.log('📤 Sending enhanced response to client');
    return new Response(JSON.stringify(responsePayload), {
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'application/json',
        'X-Chatbot-Version': '2.0',
        'X-Response-Tokens': String(responseData.usage?.total_tokens || 0)
      },
    });

  } catch (err) {
    console.error('❌ Error in enhanced chatbot handler:', err);

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
  }
});

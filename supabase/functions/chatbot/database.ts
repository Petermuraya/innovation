
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Initialize Supabase client
export const supabase = createClient(
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

// Cache for member data
const cache = {
  memberData: new Map<string, any>(),
  lastUpdated: 0
};

export async function getMemberData(userId: string) {
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

export async function getConversationHistory(sessionId: string, limit = 5) {
  try {
    const { data, error } = await supabase
      .from('chatbot_conversations')
      .select('message, response, created_at, is_user_message')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: false })
      .limit(limit * 2);

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

export async function saveConversation(userId: string, sessionId: string, message: string, response: string) {
  if (!userId || !sessionId) return;

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
        response: response,
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

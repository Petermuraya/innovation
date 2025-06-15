
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
      headers: { 'X-Client-Info': 'kuic-chatbot/3.0' }
    }
  }
);

// Enhanced cache for better performance
const cache = {
  memberData: new Map<string, any>(),
  conversationHistory: new Map<string, string>(),
  lastUpdated: 0
};

export async function getMemberData(userId: string) {
  const now = Date.now();
  
  // Cache expires after 3 minutes for more up-to-date data
  if (cache.memberData.has(userId) && (now - cache.lastUpdated) < 180000) {
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
        linkedin_url,
        created_at
      `)
      .eq('user_id', userId)
      .single();

    if (error) {
      console.warn('⚠️ Error fetching member data:', error);
      return null;
    }

    // Get comprehensive user activity data for better intelligence
    const [projectsResult, eventsResult, pointsResult, communitiesResult, blogsResult] = await Promise.all([
      supabase.from('project_submissions').select('id, title, status, created_at, tech_stack').eq('user_id', userId).order('created_at', { ascending: false }).limit(10),
      supabase.from('event_registrations').select('id, event_id, created_at').eq('user_id', userId),
      supabase.from('member_points').select('points, reason, created_at').eq('user_id', userId).order('created_at', { ascending: false }),
      supabase.from('community_members').select('community_id, joined_at').eq('user_id', userId),
      supabase.from('blog_posts').select('id, title, status, created_at').eq('author_id', userId).limit(5)
    ]);

    // Calculate skill progression and engagement metrics
    const totalPoints = pointsResult.data?.reduce((sum, p) => sum + p.points, 0) || 0;
    const recentActivity = pointsResult.data?.filter(p => {
      const pointDate = new Date(p.created_at);
      const thirtyDaysAgo = new Date(now - 30 * 24 * 60 * 60 * 1000);
      return pointDate > thirtyDaysAgo;
    }) || [];

    const enrichedMember = {
      ...member,
      recentProjects: projectsResult.data || [],
      eventsAttended: eventsResult.data?.length || 0,
      totalPoints,
      recentActivity: recentActivity.length,
      communities: communitiesResult.data?.length || 0,
      blogPosts: blogsResult.data?.length || 0,
      memberSince: member.created_at,
      // Intelligence insights
      skillAreas: member.skills || [],
      projectTechStacks: projectsResult.data?.flatMap(p => p.tech_stack || []) || [],
      engagementLevel: totalPoints > 500 ? 'high' : totalPoints > 200 ? 'medium' : 'low'
    };

    cache.memberData.set(userId, enrichedMember);
    cache.lastUpdated = now;
    
    return enrichedMember;
  } catch (err) {
    console.warn('⚠️ Error in getMemberData:', err);
    return null;
  }
}

export async function getConversationHistory(sessionId: string, limit = 10) {
  try {
    // Check cache first
    if (cache.conversationHistory.has(sessionId)) {
      return cache.conversationHistory.get(sessionId);
    }

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

    const history = data?.reverse().map(msg => 
      `${msg.is_user_message ? 'User' : 'Assistant'}: ${msg.is_user_message ? msg.message : msg.response}`
    ).join('\n') || null;

    // Cache the history
    if (history) {
      cache.conversationHistory.set(sessionId, history);
    }

    return history;
  } catch (err) {
    console.warn('⚠️ Error in getConversationHistory:', err);
    return null;
  }
}

export async function saveConversation(userId: string, sessionId: string, message: string, response: string) {
  if (!sessionId) return;

  try {
    const conversationEntries = [
      {
        session_id: sessionId,
        user_id: userId || null,
        message: message,
        response: '',
        is_user_message: true,
        created_at: new Date().toISOString()
      },
      {
        session_id: sessionId,
        user_id: userId || null,
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
      console.log('✅ Enhanced conversation saved successfully');
      // Clear cache to get fresh data next time
      cache.conversationHistory.delete(sessionId);
    }
  } catch (dbError) {
    console.error('⚠️ Database save operation failed:', dbError);
  }
}

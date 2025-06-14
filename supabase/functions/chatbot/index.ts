
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

import { CORS_HEADERS } from './config.ts';
import { createErrorResponse } from './errors.ts';
import { getMemberData, getConversationHistory, saveConversation } from './database.ts';
import { generateSystemPrompt, buildUserContext } from './prompts.ts';
import { callGroqAPI } from './ai.ts';
import { validateRequest, validateRequestBody } from './validation.ts';

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: CORS_HEADERS });
  }

  try {
    // Validate request
    validateRequest(req);
    const requestBody = await req.json();
    const { message, userId, sessionId } = validateRequestBody(requestBody);

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
          userContext = buildUserContext(memberData);
        } else {
          userContext = 'Authenticated user - some profile data unavailable, but still provide full member support.';
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

    // Call AI API
    const { botReply, usage } = await callGroqAPI(systemPrompt, message);

    // Save conversation to database
    await saveConversation(userId, sessionId, message, botReply);

    // Enhanced response with metadata
    const responsePayload = {
      response: botReply,
      metadata: {
        model: 'llama3-70b-8192',
        tokens: usage?.total_tokens || 0,
        timestamp: new Date().toISOString(),
        userContext: userId ? 'authenticated' : 'anonymous',
        sessionId: sessionId,
        version: '2.0'
      }
    };

    console.log('📤 Sending enhanced response to client');
    return new Response(JSON.stringify(responsePayload), {
      headers: { 
        ...CORS_HEADERS, 
        'Content-Type': 'application/json',
        'X-Chatbot-Version': '2.0',
        'X-Response-Tokens': String(usage?.total_tokens || 0)
      },
    });

  } catch (err) {
    return createErrorResponse(err, CORS_HEADERS);
  }
});

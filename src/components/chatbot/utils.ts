
// src/components/chatbot/utils.ts
import { Message, ChatbotConfig, AuthUser } from './types';

export const createUserMessage = (content: string): Message => ({
  id: `user_${Date.now()}_${Math.random()}`,
  content,
  isUser: true,
  timestamp: new Date(),
  status: 'sending',
});

export const createBotMessage = (content: string): Message => ({
  id: `bot_${Date.now()}_${Math.random()}`,
  content,
  isUser: false,
  timestamp: new Date(),
});

export const createErrorMessage = (): Message => ({
  id: `error_${Date.now()}`,
  content: "I apologize, but I'm having trouble connecting right now. Please try again in a moment, or feel free to browse our website for information about KUIC!",
  isUser: false,
  timestamp: new Date(),
  status: 'error',
});

export const getUserName = (user: AuthUser | null): string | undefined => {
  if (!user) return undefined;
  
  // Try to get name from user metadata
  return user.user_metadata?.name || 
         user.user_metadata?.full_name;
};

export const defaultConfig: ChatbotConfig = {
  quickReplies: [
    "how do i join kuic?",
    "what events are coming up?",
    "show me cool projects", 
    "help me get started",
    "career opportunities",
    "tell me about communities"
  ],
  welcomeMessage: (userName?: string) => {
    if (userName) {
      return `hey ${userName}! 👋 great to see you here! i'm your enhanced kuic ai assistant. whether you need help navigating the site, want to learn about our latest opportunities, or need technical guidance - i'm here to help you succeed! what can i assist you with today?`;
    }
    return `welcome to kuic! 🚀 i'm your intelligent ai assistant, here to help you discover amazing opportunities, connect with fellow innovators, and advance your tech journey. ready to explore what we have to offer? what interests you most?`;
  }
};

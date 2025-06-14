
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
    "how do i join?",
    "upcoming events?",
    "view projects", 
    "dashboard access",
    "help navigate",
    "tell me more"
  ],
  welcomeMessage: (userName?: string) => {
    if (userName) {
      return `hi ${userName}! 👋 need help with kuic or navigating the site? i'm here to assist!`;
    }
    return `welcome to kuic! 🚀 i can help you navigate, join the club, or answer questions. what do you need?`;
  }
};

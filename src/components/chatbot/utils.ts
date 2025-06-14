
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
         user.user_metadata?.full_name || 
         user.raw_user_meta_data?.name || 
         user.raw_user_meta_data?.full_name;
};

export const defaultConfig: ChatbotConfig = {
  quickReplies: [
    "How do I join KUIC?",
    "What events are coming up?",
    "Tell me about projects",
    "How do I submit a project?",
    "What are the membership benefits?",
    "Help with the website"
  ],
  welcomeMessage: (userName?: string) => {
    if (userName) {
      return `Hello ${userName}! 👋 Welcome back to KUIC! I'm your AI assistant, ready to help you with anything about the club, website navigation, project guidance, or tech questions. What can I assist you with today?`;
    }
    return `Welcome to Karatina University Innovation Club! 🚀 I'm your AI assistant, here to help you learn about our club, navigate our website, and answer any tech-related questions. I can help you with membership, events, projects, and much more. What would you like to know?`;
  }
};

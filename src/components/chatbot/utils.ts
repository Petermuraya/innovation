
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
    "tell me about projects",
    "how do i submit a project?",
    "what are the membership benefits?",
    "help with the website"
  ],
  welcomeMessage: (userName?: string) => {
    if (userName) {
      return `hello ${userName}! 👋 welcome back to kuic! i'm your ai assistant, ready to help you with anything about the club, website navigation, project guidance, or tech questions. what can i assist you with today?`;
    }
    return `welcome to karatina university innovation club! 🚀 i'm your ai assistant, here to help you learn about our club, navigate our website, and answer any tech-related questions. i can help you with membership, events, projects, and much more. what would you like to know?`;
  }
};

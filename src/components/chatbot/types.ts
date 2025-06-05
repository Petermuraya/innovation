// src/components/chatbot/types.ts
export interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  status?: 'sending' | 'delivered' | 'error';
}

export interface AuthUser {
  id: string;
  email?: string;
  name?: string;
  avatar_url?: string;
}

export interface ChatbotConfig {
  quickReplies: string[];
  welcomeMessage: (userName?: string) => string;
}

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
  user_metadata?: {
    name?: string;
    full_name?: string;
    [key: string]: any;
  };
  raw_user_meta_data?: {
    name?: string;
    full_name?: string;
    [key: string]: any;
  };
}

export interface ChatbotConfig {
  quickReplies: string[];
  welcomeMessage: (userName?: string) => string;
}

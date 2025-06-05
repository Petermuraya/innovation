// src/components/chatbot/utils.ts
import { ChatbotConfig, Message } from './types';

export const scrollToBottom = (ref: React.RefObject<HTMLDivElement>) => {
  ref.current?.scrollIntoView({ behavior: 'smooth' });
};

export const createUserMessage = (content: string): Message => ({
  id: `user_${Date.now()}`,
  content,
  isUser: true,
  timestamp: new Date(),
  status: 'sending'
});

export const createBotMessage = (content: string): Message => ({
  id: `bot_${Date.now()}`,
  content,
  isUser: false,
  timestamp: new Date()
});

export const createErrorMessage = (): Message => ({
  id: `error_${Date.now()}`,
  content: "⚠️ I'm having trouble responding. Please try again.",
  isUser: false,
  timestamp: new Date()
});

export const defaultConfig: ChatbotConfig = {
  quickReplies: [
    "What events are coming up?",
    "How do I join a project?",
    "Where can I find resources?",
    "Who are the club leaders?"
  ],
  welcomeMessage: (userName?: string) => `👋 Hello${userName ? ` ${userName}` : ''}! I'm the Karatina Innovation Club assistant. 

Here's how I can help:
• Club events and activities
• Membership information
• Project collaboration
• Technical support

Try asking about:
- Upcoming hackathons
- Meeting schedules
- Available resources`
};
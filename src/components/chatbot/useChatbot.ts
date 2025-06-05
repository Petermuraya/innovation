import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Message, AuthUser, ChatbotConfig } from './types';
import { createUserMessage, createBotMessage, createErrorMessage } from './utils';

export const useChatbot = (user: AuthUser | null, config: ChatbotConfig) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random()}`);

  const initializeChat = useCallback(() => {
    const welcomeMessage: Message = {
      id: 'welcome',
      content: config.welcomeMessage(user?.name),
      isUser: false,
      timestamp: new Date(),
    };
    setMessages([welcomeMessage]);
  }, [user?.name, config]);

  const sendMessage = async (inputMessage: string) => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = createUserMessage(inputMessage);
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('chatbot', {
        body: {
          message: inputMessage,
          userId: user?.id || null,
          sessionId: sessionId,
          previousMessages: messages
            .filter(m => m.id !== 'welcome')
            .map(m => ({
              role: m.isUser ? 'user' : 'assistant',
              content: m.content
            }))
        },
      });

      if (error) throw error;

      setMessages(prev => prev.map(m => 
        m.id === userMessage.id ? { ...m, status: 'delivered' } : m
      ));

      const botMessage = createBotMessage(data.response);
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => prev.map(m => 
        m.id === userMessage.id ? { ...m, status: 'error' } : m
      ));
      setMessages(prev => [...prev, createErrorMessage()]);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    messages,
    isLoading,
    initializeChat,
    sendMessage,
    quickReplies: config.quickReplies
  };
};
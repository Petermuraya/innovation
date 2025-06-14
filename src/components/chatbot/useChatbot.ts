
// src/components/chatbot/useChatbot.ts
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Message, AuthUser, ChatbotConfig } from './types';
import { createUserMessage, createBotMessage, createErrorMessage, getUserName } from './utils';

export const useChatbot = (user: AuthUser | null, config: ChatbotConfig) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random()}`);

  const initializeChat = useCallback(() => {
    const userName = getUserName(user);
    const welcomeMessage: Message = {
      id: 'welcome',
      content: config.welcomeMessage(userName),
      isUser: false,
      timestamp: new Date(),
    };
    setMessages([welcomeMessage]);
  }, [user, config]);

  const sendMessage = async (inputMessage: string) => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = createUserMessage(inputMessage);
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      console.log('Sending message to chatbot:', { inputMessage, userId: user?.id, sessionId });
      
      const userName = getUserName(user);
      const { data, error } = await supabase.functions.invoke('chatbot', {
        body: {
          message: inputMessage,
          userId: user?.id || null,
          sessionId: sessionId,
          userContext: user ? {
            name: userName,
            email: user.email,
            authenticated: true
          } : {
            authenticated: false
          }
        },
      });

      if (error) {
        console.error('Chatbot error:', error);
        throw error;
      }

      console.log('Received chatbot response:', data);

      // Update user message status to delivered
      setMessages(prev => prev.map(m => 
        m.id === userMessage.id ? { ...m, status: 'delivered' } : m
      ));

      // Add bot response
      const botMessage = createBotMessage(data.response);
      setMessages(prev => [...prev, botMessage]);

    } catch (error) {
      console.error('Chat error:', error);
      
      // Update user message status to error
      setMessages(prev => prev.map(m => 
        m.id === userMessage.id ? { ...m, status: 'error' } : m
      ));
      
      // Add error message
      const errorMessage = createErrorMessage();
      setMessages(prev => [...prev, errorMessage]);
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

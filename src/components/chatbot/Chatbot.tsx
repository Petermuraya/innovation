
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useChatbot } from './useChatbot';
import { defaultConfig } from './utils';
import ChatbotButton from './components/ChatbotButton';
import SimplifiedChatbotContent from './components/SimplifiedChatbotContent';
import { useToast } from '@/hooks/use-toast';

const Chatbot = () => {
  const { member } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  const { messages, isLoading, initializeChat, sendMessage, quickReplies } = useChatbot(member, defaultConfig);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      initializeChat();
    }
  }, [isOpen, messages.length, initializeChat]);

  const handleToggle = () => setIsOpen(!isOpen);
  const handleClose = () => setIsOpen(false);

  const handleSendMessage = async (message: string) => {
    await sendMessage(message);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <SimplifiedChatbotContent
          messages={messages}
          isLoading={isLoading}
          onSendMessage={handleSendMessage}
          onClose={handleClose}
          quickReplies={quickReplies}
        />
      ) : (
        <ChatbotButton onClick={handleToggle} isMobile={isMobile} />
      )}
    </div>
  );
};

export default Chatbot;

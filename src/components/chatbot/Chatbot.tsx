
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useChatbot } from './useChatbot';
import { defaultConfig } from './utils';
import ChatbotButton from './components/ChatbotButton';
import SimplifiedChatbotContent from './components/SimplifiedChatbotContent';

const Chatbot = () => {
  const { member } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  
  const { messages, isLoading, initializeChat, sendMessage, quickReplies } = useChatbot(member, defaultConfig);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      initializeChat();
    }
  }, [isOpen, messages.length, initializeChat]);

  const handleToggle = () => setIsOpen(!isOpen);
  const handleClose = () => setIsOpen(false);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <SimplifiedChatbotContent
          messages={messages}
          isLoading={isLoading}
          onSendMessage={sendMessage}
          onClose={handleClose}
          quickReplies={quickReplies}
        />
      ) : (
        <ChatbotButton onClick={handleToggle} />
      )}
    </div>
  );
};

export default Chatbot;

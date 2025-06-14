
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useMediaQuery } from '@/hooks/use-media-query';
import { useChatbot } from './useChatbot';
import { defaultConfig, getUserName } from './utils';
import ChatbotButton from './components/ChatbotButton';
import SimplifiedChatbotHeader from './components/SimplifiedChatbotHeader';
import SimplifiedChatbotContent from './components/SimplifiedChatbotContent';

const Chatbot = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  const authUser = user ? {
    id: user.id,
    email: user.email,
    user_metadata: user.user_metadata,
    avatar_url: user.user_metadata?.avatar_url
  } : null;

  const {
    messages,
    isLoading,
    initializeChat,
    sendMessage,
    quickReplies
  } = useChatbot(authUser, defaultConfig);

  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [lastProcessedMessageId, setLastProcessedMessageId] = useState<string | null>(null);

  // Track the latest bot message that needs typing effect
  const latestBotMessage = messages.filter(m => !m.isUser).pop();
  const shouldShowTypingForLatest = latestBotMessage && 
    latestBotMessage.id !== lastProcessedMessageId;

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    sendMessage(inputMessage);
    setInputMessage('');
  };

  const handleQuickReply = (reply: string) => {
    setInputMessage(reply);
    if (isMobile) {
      handleSendMessage();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleChat = () => {
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);
    setIsMinimized(false);
    if (newIsOpen) {
      initializeChat();
    }
  };

  const toggleMinimize = () => {
    setIsMinimized(prev => !prev);
  };

  const handleTypingComplete = () => {
    if (latestBotMessage) {
      setLastProcessedMessageId(latestBotMessage.id);
    }
  };

  const userName = getUserName(authUser);

  if (!isOpen) {
    return (
      <ChatbotButton 
        onClick={toggleChat}
        isMobile={isMobile}
      />
    );
  }

  return (
    <Card className={cn(
      "fixed shadow-xl z-50 flex flex-col transition-all duration-300 bg-white dark:bg-gray-900",
      isMobile ? [
        "inset-0 w-full h-full max-h-none rounded-none"
      ] : [
        "bottom-6 right-6 rounded-lg",
        "w-96 h-[600px]",
        isMinimized && "h-16"
      ]
    )}>
      <SimplifiedChatbotHeader
        user={user}
        userName={userName}
        isMobile={isMobile}
        isMinimized={isMinimized}
        onClose={toggleChat}
        onToggleMinimize={toggleMinimize}
      />
      
      {!isMinimized && (
        <SimplifiedChatbotContent
          messages={messages}
          isLoading={isLoading}
          quickReplies={quickReplies}
          inputMessage={inputMessage}
          isRecording={isRecording}
          isMobile={isMobile}
          typingMessageId={shouldShowTypingForLatest ? latestBotMessage?.id : null}
          onInputChange={setInputMessage}
          onKeyPress={handleKeyPress}
          onSendMessage={handleSendMessage}
          onQuickReply={handleQuickReply}
          onTypingComplete={handleTypingComplete}
        />
      )}
    </Card>
  );
};

export default Chatbot;

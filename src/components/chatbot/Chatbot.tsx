
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useMediaQuery } from '@/hooks/use-media-query';
import { useChatbot } from './useChatbot';
import { defaultConfig, getUserName } from './utils';
import ChatbotButton from './components/ChatbotButton';
import ChatbotHeader from './components/ChatbotHeader';
import PremiumChatbotContent from './components/PremiumChatbotContent';

const Chatbot = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(max-width: 1024px)');
  
  // Convert Supabase User to our AuthUser type
  const authUser = user ? {
    id: user.id,
    email: user.email,
    user_metadata: user.user_metadata
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
  const [typingMessageId, setTypingMessageId] = useState<string | null>(null);

  // Handle typing effect for new bot messages
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && !lastMessage.isUser && lastMessage.id !== typingMessageId) {
      setTypingMessageId(lastMessage.id);
    }
  }, [messages, typingMessageId]);

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

  const toggleRecording = () => {
    setIsRecording(prev => {
      toast({
        title: prev ? "recording stopped" : "recording started",
        duration: 2000,
      });
      return !prev;
    });
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
    setTypingMessageId(null);
  };

  // Get user name safely
  const userName = getUserName(authUser);

  // Floating action button when closed
  if (!isOpen) {
    return (
      <ChatbotButton 
        onClick={toggleChat}
        isMobile={isMobile}
      />
    );
  }

  // Premium responsive chat window
  return (
    <Card className={cn(
      "fixed shadow-2xl z-50 flex flex-col transition-all duration-500 transform bg-white dark:bg-gray-900 backdrop-blur-xl border border-gray-200 dark:border-gray-700",
      // Mobile styles
      isMobile ? [
        "inset-0 w-full h-full max-h-none rounded-none border-0",
        "animate-slide-in-right"
      ] : [
        // Desktop/tablet styles
        "bottom-6 right-6 rounded-2xl border-2",
        isTablet ? "w-80 h-[500px]" : "w-96 h-[600px]",
        isMinimized && "h-16",
        "animate-scale-in",
        "ring-4 ring-kic-green-200 ring-opacity-20 hover:ring-opacity-40 transition-all duration-300"
      ]
    )}>
      <ChatbotHeader
        user={user}
        userName={userName}
        isMobile={isMobile}
        isMinimized={isMinimized}
        isRecording={isRecording}
        onClose={toggleChat}
        onToggleMinimize={toggleMinimize}
        onToggleRecording={toggleRecording}
      />
      
      {/* Premium chat content - hidden when minimized */}
      {!isMinimized && (
        <PremiumChatbotContent
          messages={messages}
          isLoading={isLoading}
          quickReplies={quickReplies}
          inputMessage={inputMessage}
          isRecording={isRecording}
          isMobile={isMobile}
          typingMessageId={typingMessageId}
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

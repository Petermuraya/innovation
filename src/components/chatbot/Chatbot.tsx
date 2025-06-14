
import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, X, Bot, Mic, Minimize2, Maximize2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useMediaQuery } from '@/hooks/use-media-query';
import { useChatbot } from './useChatbot';
import { defaultConfig, getUserName } from './utils';
import MessageBubble from './components/MessageBubble';
import LoadingIndicator from './components/LoadingIndicator';
import QuickReplies from './components/QuickReplies';
import MessageInput from './components/MessageInput';

const Chatbot = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(max-width: 1024px)');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
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

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, typingMessageId]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && !isMobile && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, isMobile]);

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
    } else {
      inputRef.current?.focus();
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
      <Button
        onClick={toggleChat}
        className={cn(
          "fixed shadow-xl transition-all duration-300 hover:scale-105 z-50",
          "bg-kic-green-600 hover:bg-kic-green-700",
          isMobile 
            ? "bottom-4 right-4 h-12 w-12 rounded-full" 
            : "bottom-6 right-6 h-14 w-14 rounded-full"
        )}
        size="icon"
        aria-label="open chat assistant"
      >
        <MessageCircle className={cn("text-white", isMobile ? "h-5 w-5" : "h-6 w-6")} />
        
        {/* Pulse animation for attention */}
        <div className="absolute inset-0 rounded-full bg-kic-green-600 animate-ping opacity-75" />
      </Button>
    );
  }

  // Responsive chat window
  return (
    <Card className={cn(
      "fixed shadow-2xl z-50 flex flex-col transition-all duration-300 transform bg-white dark:bg-gray-900",
      // Mobile styles
      isMobile ? [
        "inset-0 w-full h-full max-h-none rounded-none",
        "animate-slide-in-right"
      ] : [
        // Desktop/tablet styles
        "bottom-6 right-6 rounded-lg",
        isTablet ? "w-80 h-[500px]" : "w-96 h-[600px]",
        isMinimized && "h-14",
        "animate-scale-in"
      ]
    )}>
      {/* Header */}
      <CardHeader className={cn(
        "flex flex-row items-center justify-between space-y-0 pb-3",
        "bg-gradient-to-r from-kic-green-600 to-kic-green-700 text-white",
        isMobile ? "px-4 py-3 rounded-t-none" : "px-4 py-3 rounded-t-lg",
        "border-b border-kic-green-800"
      )}>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Bot className={cn("text-white", isMobile ? "h-5 w-5" : "h-6 w-6")} />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse" />
          </div>
          <div>
            <CardTitle className={cn("font-bold text-white", isMobile ? "text-lg" : "text-xl")}>
              kuic assistant
            </CardTitle>
            <p className="text-xs text-green-100 opacity-90">
              {user ? `hello, ${userName || 'there'}!` : "ready to help"}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          {!isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMinimize}
              className="h-8 w-8 text-white hover:bg-kic-green-800 transition-colors"
              aria-label={isMinimized ? "Expand chat" : "Minimize chat"}
            >
              {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
            </Button>
          )}
          
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleRecording}
            className={cn(
              "h-8 w-8 text-white transition-all duration-200",
              isRecording 
                ? "bg-red-500 hover:bg-red-600 animate-pulse shadow-lg" 
                : "hover:bg-kic-green-800"
            )}
            aria-label={isRecording ? "Stop recording" : "Start recording"}
          >
            <Mic className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleChat}
            className="h-8 w-8 text-white hover:bg-kic-green-800 transition-colors"
            aria-label="Close chat"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      {/* Chat content - hidden when minimized */}
      {!isMinimized && (
        <>
          <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
            {/* Messages area */}
            <ScrollArea className={cn(
              "flex-1",
              isMobile ? "px-3 py-4" : "px-4 py-4"
            )}>
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <MessageBubble 
                    key={message.id} 
                    message={message} 
                    isRecording={isRecording}
                    isMobile={isMobile}
                    showTypingEffect={
                      !message.isUser && 
                      message.id === typingMessageId && 
                      index === messages.length - 1
                    }
                    onTypingComplete={handleTypingComplete}
                  />
                ))}
                
                {isLoading && <LoadingIndicator isMobile={isMobile} />}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
            
            {/* Quick replies - show for first message */}
            {messages.length === 1 && (
              <QuickReplies 
                replies={quickReplies} 
                onSelect={handleQuickReply}
                isMobile={isMobile}
              />
            )}
            
            {/* Input area */}
            <MessageInput
              inputRef={inputRef}
              value={inputMessage}
              onChange={setInputMessage}
              onKeyPress={handleKeyPress}
              isLoading={isLoading}
              onSend={handleSendMessage}
              isMobile={isMobile}
            />
          </CardContent>
        </>
      )}
    </Card>
  );
};

export default Chatbot;

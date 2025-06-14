
// src/components/chatbot/Chatbot.tsx
import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, Send, X, Bot, User, Loader2, Mic, Paperclip, Minimize2, Maximize2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useMediaQuery } from '@/hooks/use-media-query';
import { useChatbot } from './useChatbot';
import { defaultConfig } from './utils';
import { Message } from './types';

const Chatbot = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(max-width: 1024px)');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const {
    messages,
    isLoading,
    initializeChat,
    sendMessage,
    quickReplies
  } = useChatbot(user, defaultConfig);

  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && !isMobile && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, isMobile]);

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
        title: prev ? "Recording stopped" : "Recording started",
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
        aria-label="Open chat assistant"
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
              KUIC Assistant
            </CardTitle>
            <p className="text-xs text-green-100 opacity-90">
              {user ? `Hello, ${user.name}!` : "Ready to help"}
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
                {messages.map((message) => (
                  <MessageBubble 
                    key={message.id} 
                    message={message} 
                    isRecording={isRecording}
                    isMobile={isMobile}
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

const MessageBubble = ({ 
  message, 
  isRecording, 
  isMobile 
}: { 
  message: Message; 
  isRecording: boolean;
  isMobile: boolean;
}) => (
  <div className={cn(
    "flex items-start gap-3 animate-fade-in",
    message.isUser ? "justify-end" : "justify-start"
  )}>
    {!message.isUser && (
      <div className={cn(
        "rounded-full bg-gradient-to-br from-kic-green-600 to-kic-green-700 flex items-center justify-center flex-shrink-0 shadow-md",
        isMobile ? "w-7 h-7" : "w-8 h-8"
      )}>
        <Bot className={cn("text-white", isMobile ? "w-3 h-3" : "w-4 h-4")} />
      </div>
    )}
    
    <div
      className={cn(
        "rounded-2xl p-3 relative transition-all duration-200 shadow-sm",
        isMobile ? "max-w-[85%] text-sm" : "max-w-[80%] text-sm",
        message.isUser
          ? "bg-gradient-to-br from-kic-green-600 to-kic-green-700 text-white ml-auto"
          : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100",
        message.status === 'error' && "border-2 border-red-400 bg-red-50 dark:bg-red-900/20",
        isRecording && "ring-2 ring-yellow-400 ring-opacity-50",
        "hover:shadow-md transform hover:scale-[1.02]"
      )}
    >
      <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
      
      <div className="flex items-center justify-end gap-2 mt-2">
        <p className={cn(
          "text-xs opacity-70",
          isMobile ? "text-[10px]" : "text-xs"
        )}>
          {message.timestamp.toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </p>
        {message.isUser && (
          <span className="text-xs opacity-70">
            {message.status === 'sending' && <Loader2 className="h-3 w-3 animate-spin" />}
            {message.status === 'error' && <span className="text-red-300">⚠️</span>}
            {message.status === 'delivered' && <span className="text-green-300">✓</span>}
          </span>
        )}
      </div>
    </div>
    
    {message.isUser && (
      <div className={cn(
        "rounded-full bg-gradient-to-br from-gray-400 to-gray-500 dark:from-gray-600 dark:to-gray-700 flex items-center justify-center flex-shrink-0 shadow-md",
        isMobile ? "w-7 h-7" : "w-8 h-8"
      )}>
        <User className={cn("text-white", isMobile ? "w-3 h-3" : "w-4 h-4")} />
      </div>
    )}
  </div>
);

const LoadingIndicator = ({ isMobile }: { isMobile: boolean }) => (
  <div className="flex items-start gap-3 animate-fade-in">
    <div className={cn(
      "rounded-full bg-gradient-to-br from-kic-green-600 to-kic-green-700 flex items-center justify-center flex-shrink-0",
      isMobile ? "w-7 h-7" : "w-8 h-8"
    )}>
      <Bot className={cn("text-white", isMobile ? "w-3 h-3" : "w-4 h-4")} />
    </div>
    <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl p-3 shadow-sm">
      <div className="flex space-x-2">
        {[0, 0.2, 0.4].map((delay) => (
          <div 
            key={delay}
            className="w-2 h-2 bg-kic-green-600 rounded-full animate-bounce"
            style={{ animationDelay: `${delay}s` }}
          />
        ))}
      </div>
    </div>
  </div>
);

const QuickReplies = ({ 
  replies, 
  onSelect, 
  isMobile 
}: { 
  replies: string[]; 
  onSelect: (reply: string) => void;
  isMobile: boolean;
}) => (
  <div className={cn(
    "flex flex-wrap gap-2 border-t border-gray-200 dark:border-gray-700",
    isMobile ? "px-3 py-3" : "px-4 py-3"
  )}>
    {replies.map((reply) => (
      <Button
        key={reply}
        variant="outline"
        size="sm"
        className={cn(
          "rounded-full bg-gray-50 hover:bg-kic-green-50 border-gray-200 hover:border-kic-green-300 transition-all duration-200",
          "dark:bg-gray-800 dark:hover:bg-kic-green-900/20 dark:border-gray-700 dark:hover:border-kic-green-600",
          "text-gray-700 dark:text-gray-300 hover:text-kic-green-700 dark:hover:text-kic-green-400",
          isMobile ? "text-xs h-7 px-3" : "text-xs h-8 px-4",
          "transform hover:scale-105 active:scale-95"
        )}
        onClick={() => onSelect(reply)}
      >
        {reply}
      </Button>
    ))}
  </div>
);

const MessageInput = ({ 
  inputRef,
  value,
  onChange,
  onKeyPress,
  isLoading,
  onSend,
  isMobile
}: {
  inputRef: React.RefObject<HTMLInputElement>;
  value: string;
  onChange: (value: string) => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  isLoading: boolean;
  onSend: () => void;
  isMobile: boolean;
}) => (
  <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-3">
    <div className="flex gap-2 items-end">
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex-shrink-0",
          isMobile ? "h-8 w-8" : "h-9 w-9"
        )}
        aria-label="Attach file"
      >
        <Paperclip className="h-4 w-4" />
      </Button>
      
      <div className="flex-1 relative">
        <Input
          ref={inputRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyPress={onKeyPress}
          placeholder="Ask me anything about KUIC..."
          className={cn(
            "pr-12 bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600",
            "focus:border-kic-green-500 focus:ring-kic-green-500/20",
            "rounded-full transition-all duration-200",
            isMobile ? "text-sm py-2" : "text-sm py-2"
          )}
          disabled={isLoading}
        />
        
        <Button
          onClick={onSend}
          disabled={!value.trim() || isLoading}
          size="icon"
          className={cn(
            "absolute right-1 top-1/2 -translate-y-1/2 rounded-full",
            "bg-kic-green-600 hover:bg-kic-green-700 disabled:bg-gray-300 dark:disabled:bg-gray-600",
            "transition-all duration-200 transform hover:scale-105 active:scale-95",
            isMobile ? "h-7 w-7" : "h-8 w-8"
          )}
          aria-label="Send message"
        >
          {isLoading ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            <Send className="h-3 w-3" />
          )}
        </Button>
      </div>
    </div>
  </div>
);

export default Chatbot;

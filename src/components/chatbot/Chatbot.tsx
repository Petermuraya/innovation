// src/components/chatbot/Chatbot.tsx
import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, Send, X, Bot, User, Loader2, Mic, Paperclip } from 'lucide-react';
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
  const isMobile = useMediaQuery('(max-width: 640px)');
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

  const handleSendMessage = () => {
    sendMessage(inputMessage);
    setInputMessage('');
  };

  const handleQuickReply = (reply: string) => {
    setInputMessage(reply);
    inputRef.current?.focus();
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
      });
      return !prev;
    });
  };

  const toggleChat = () => {
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);
    if (newIsOpen) {
      initializeChat();
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={toggleChat}
        className={cn(
          "fixed bottom-6 right-6 h-14 w-14 rounded-full",
          "bg-kic-green-600 hover:bg-kic-green-700 shadow-xl",
          "transition-all duration-300 hover:scale-105"
        )}
        size="icon"
        aria-label="Open chat"
      >
        <MessageCircle className="h-6 w-6 text-white" />
      </Button>
    );
  }

  return (
    <Card className={cn(
      "fixed bottom-6 right-6 w-full max-w-md h-[70vh] max-h-[600px] shadow-2xl z-50 flex flex-col",
      "transition-all duration-300 transform",
      isMobile ? "bottom-0 right-0 rounded-none w-screen h-screen max-h-none" : "rounded-lg"
    )}>
      <CardHeader className={cn(
        "flex flex-row items-center justify-between space-y-0 pb-2",
        "bg-kic-green-600 text-white",
        isMobile ? "rounded-t-none" : "rounded-t-lg"
      )}>
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5" />
          <CardTitle className="text-lg font-semibold">KIC Assistant</CardTitle>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleRecording}
            className={cn(
              "h-8 w-8 text-white hover:bg-kic-green-700",
              isRecording && "bg-red-500 hover:bg-red-600 animate-pulse"
            )}
            aria-label={isRecording ? "Stop recording" : "Start recording"}
          >
            <Mic className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleChat}
            className="h-8 w-8 text-white hover:bg-kic-green-700"
            aria-label="Close chat"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0 bg-white dark:bg-gray-900">
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <MessageBubble 
                key={message.id} 
                message={message} 
                isRecording={isRecording}
              />
            ))}
            
            {isLoading && <LoadingIndicator />}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
        
        {messages.length === 1 && (
          <QuickReplies 
            replies={quickReplies} 
            onSelect={handleQuickReply} 
          />
        )}
        
        <MessageInput
          inputRef={inputRef}
          value={inputMessage}
          onChange={setInputMessage}
          onKeyPress={handleKeyPress}
          isLoading={isLoading}
          onSend={handleSendMessage}
        />
      </CardContent>
    </Card>
  );
};

const MessageBubble = ({ message, isRecording }: { message: Message, isRecording: boolean }) => (
  <div className={cn(
    "flex items-start gap-3",
    message.isUser ? "justify-end" : "justify-start"
  )}>
    {!message.isUser && (
      <div className="w-8 h-8 rounded-full bg-kic-green-600 flex items-center justify-center flex-shrink-0">
        <Bot className="w-4 h-4 text-white" />
      </div>
    )}
    
    <div
      className={cn(
        "max-w-[85%] rounded-2xl p-3 relative",
        "transition-all duration-200",
        message.isUser
          ? "bg-kic-green-600 text-white"
          : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100",
        message.status === 'error' && "border border-red-400",
        isRecording && "border-2 border-yellow-400"
      )}
    >
      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
      <div className="flex items-center justify-end gap-1.5 mt-1">
        <p className="text-xs opacity-70">
          {message.timestamp.toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </p>
        {message.isUser && (
          <span className="text-xs opacity-70">
            {message.status === 'sending' && <Loader2 className="h-3 w-3 animate-spin" />}
            {message.status === 'error' && '⚠️'}
            {message.status === 'delivered' && '✓'}
          </span>
        )}
      </div>
    </div>
    
    {message.isUser && (
      <div className="w-8 h-8 rounded-full bg-gray-400 dark:bg-gray-600 flex items-center justify-center flex-shrink-0">
        <User className="w-4 h-4 text-white" />
      </div>
    )}
  </div>
);

const LoadingIndicator = () => (
  <div className="flex items-start gap-3">
    <div className="w-8 h-8 rounded-full bg-kic-green-600 flex items-center justify-center flex-shrink-0">
      <Bot className="w-4 h-4 text-white" />
    </div>
    <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl p-3">
      <div className="flex space-x-2">
        {[0, 0.2, 0.4].map((delay) => (
          <div 
            key={delay}
            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
            style={{ animationDelay: `${delay}s` }}
          />
        ))}
      </div>
    </div>
  </div>
);

const QuickReplies = ({ replies, onSelect }: { replies: string[], onSelect: (reply: string) => void }) => (
  <div className="px-4 pb-2 flex flex-wrap gap-2">
    {replies.map((reply) => (
      <Button
        key={reply}
        variant="outline"
        size="sm"
        className="text-xs h-8 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
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
  onSend
}: {
  inputRef: React.RefObject<HTMLInputElement>;
  value: string;
  onChange: (value: string) => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  isLoading: boolean;
  onSend: () => void;
}) => (
  <div className="border-t border-gray-200 dark:border-gray-700 p-3">
    <div className="flex gap-2 items-center">
      <Button
        variant="ghost"
        size="icon"
        className="h-9 w-9 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
        aria-label="Attach file"
      >
        <Paperclip className="h-4 w-4" />
      </Button>
      <Input
        ref={inputRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyPress={onKeyPress}
        placeholder="Ask me anything about KIC..."
        className="flex-1"
        disabled={isLoading}
      />
      <Button
        onClick={onSend}
        disabled={!value.trim() || isLoading}
        size="icon"
        className="h-9 w-9 bg-kic-green-600 hover:bg-kic-green-700"
        aria-label="Send message"
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Send className="h-4 w-4" />
        )}
      </Button>
    </div>
  </div>
);

export default Chatbot;
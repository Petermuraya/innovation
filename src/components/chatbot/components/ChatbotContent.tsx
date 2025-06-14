
import { useRef, useEffect } from 'react';
import { CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Message } from '../types';
import EnhancedMessageBubble from './EnhancedMessageBubble';
import EnhancedLoadingIndicator from './EnhancedLoadingIndicator';
import EnhancedQuickReplies from './EnhancedQuickReplies';
import EnhancedMessageInput from './EnhancedMessageInput';

interface ChatbotContentProps {
  messages: Message[];
  isLoading: boolean;
  quickReplies: string[];
  inputMessage: string;
  isRecording: boolean;
  isMobile: boolean;
  typingMessageId: string | null;
  onInputChange: (value: string) => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  onSendMessage: () => void;
  onQuickReply: (reply: string) => void;
  onTypingComplete: () => void;
}

const ChatbotContent = ({
  messages,
  isLoading,
  quickReplies,
  inputMessage,
  isRecording,
  isMobile,
  typingMessageId,
  onInputChange,
  onKeyPress,
  onSendMessage,
  onQuickReply,
  onTypingComplete
}: ChatbotContentProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, typingMessageId]);

  return (
    <CardContent className="flex-1 flex flex-col p-0 overflow-hidden bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Messages area with enhanced styling */}
      <ScrollArea className={cn(
        "flex-1 relative",
        isMobile ? "px-3 py-4" : "px-4 py-6"
      )}>
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05]">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 20px 20px, rgba(34, 197, 94, 0.3) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }} />
        </div>
        
        <div className="space-y-6 relative z-10">
          {messages.map((message, index) => (
            <EnhancedMessageBubble 
              key={message.id} 
              message={message} 
              isRecording={isRecording}
              isMobile={isMobile}
              showTypingEffect={
                !message.isUser && 
                message.id === typingMessageId && 
                index === messages.length - 1
              }
              onTypingComplete={onTypingComplete}
            />
          ))}
          
          {isLoading && <EnhancedLoadingIndicator isMobile={isMobile} />}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
      
      {/* Quick replies - show for first message with enhanced styling */}
      {messages.length === 1 && (
        <EnhancedQuickReplies 
          replies={quickReplies} 
          onSelect={onQuickReply}
          isMobile={isMobile}
        />
      )}
      
      {/* Enhanced input area */}
      <EnhancedMessageInput
        inputRef={inputRef}
        value={inputMessage}
        onChange={onInputChange}
        onKeyPress={onKeyPress}
        isLoading={isLoading}
        onSend={onSendMessage}
        isMobile={isMobile}
      />
    </CardContent>
  );
};

export default ChatbotContent;

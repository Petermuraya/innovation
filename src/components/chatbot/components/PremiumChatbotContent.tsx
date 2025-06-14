
import { useRef, useEffect } from 'react';
import { CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Message } from '../types';
import UltraEnhancedMessageBubble from './UltraEnhancedMessageBubble';
import EnhancedLoadingIndicator from './EnhancedLoadingIndicator';
import EnhancedQuickReplies from './EnhancedQuickReplies';
import EnhancedMessageInput from './EnhancedMessageInput';

interface PremiumChatbotContentProps {
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

const PremiumChatbotContent = ({
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
}: PremiumChatbotContentProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [messages, typingMessageId]);

  return (
    <CardContent className="flex-1 flex flex-col p-0 overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative">
      {/* Premium background pattern */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.08] pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            radial-gradient(circle at 25% 25%, rgba(34, 197, 94, 0.4) 2px, transparent 2px),
            radial-gradient(circle at 75% 75%, rgba(59, 130, 246, 0.3) 1px, transparent 1px),
            linear-gradient(45deg, transparent 48%, rgba(34, 197, 94, 0.1) 49%, rgba(34, 197, 94, 0.1) 51%, transparent 52%)
          `,
          backgroundSize: '60px 60px, 40px 40px, 20px 20px'
        }} />
      </div>
      
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-kic-green-50/20 via-transparent to-blue-50/20 dark:from-kic-green-900/10 dark:to-blue-900/10 pointer-events-none animate-pulse" />
      
      {/* Messages area with premium styling */}
      <ScrollArea className={cn(
        "flex-1 relative z-10",
        isMobile ? "px-3 py-6" : "px-6 py-8"
      )}>
        <div className="space-y-8 relative">
          {messages.map((message, index) => (
            <div
              key={message.id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <UltraEnhancedMessageBubble 
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
            </div>
          ))}
          
          {isLoading && (
            <div className="animate-fade-in" style={{ animationDelay: '100ms' }}>
              <EnhancedLoadingIndicator isMobile={isMobile} />
            </div>
          )}
          <div ref={messagesEndRef} className="h-4" />
        </div>
      </ScrollArea>
      
      {/* Enhanced quick replies with premium styling */}
      {messages.length === 1 && (
        <div className="relative z-10">
          <EnhancedQuickReplies 
            replies={quickReplies} 
            onSelect={onQuickReply}
            isMobile={isMobile}
          />
        </div>
      )}
      
      {/* Premium input area with glass morphism */}
      <div className="relative z-10">
        <EnhancedMessageInput
          inputRef={inputRef}
          value={inputMessage}
          onChange={onInputChange}
          onKeyPress={onKeyPress}
          isLoading={isLoading}
          onSend={onSendMessage}
          isMobile={isMobile}
        />
      </div>
    </CardContent>
  );
};

export default PremiumChatbotContent;

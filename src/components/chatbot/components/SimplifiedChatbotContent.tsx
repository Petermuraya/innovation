
import { useRef, useEffect } from 'react';
import { CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Message } from '../types';
import SimplifiedMessageBubble from './SimplifiedMessageBubble';
import SimplifiedLoadingIndicator from './SimplifiedLoadingIndicator';
import SimplifiedQuickReplies from './SimplifiedQuickReplies';
import SimplifiedMessageInput from './SimplifiedMessageInput';

interface SimplifiedChatbotContentProps {
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

const SimplifiedChatbotContent = ({
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
}: SimplifiedChatbotContentProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, typingMessageId]);

  return (
    <CardContent className="flex-1 flex flex-col p-0 overflow-hidden bg-gray-50 dark:bg-gray-900">
      <ScrollArea className={cn(
        "flex-1",
        isMobile ? "px-4 py-4" : "px-6 py-6"
      )}>
        <div className="space-y-4">
          {messages.map((message, index) => (
            <SimplifiedMessageBubble 
              key={message.id} 
              message={message} 
              isMobile={isMobile}
              showTypingEffect={
                !message.isUser && 
                message.id === typingMessageId && 
                index === messages.length - 1
              }
              onTypingComplete={onTypingComplete}
            />
          ))}
          
          {isLoading && <SimplifiedLoadingIndicator isMobile={isMobile} />}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
      
      {messages.length === 1 && (
        <SimplifiedQuickReplies 
          replies={quickReplies} 
          onSelect={onQuickReply}
          isMobile={isMobile}
        />
      )}
      
      <SimplifiedMessageInput
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

export default SimplifiedChatbotContent;

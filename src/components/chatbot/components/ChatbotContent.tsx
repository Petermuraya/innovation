
import { useRef, useEffect } from 'react';
import { CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Message } from '../types';
import MessageBubble from './MessageBubble';
import LoadingIndicator from './LoadingIndicator';
import QuickReplies from './QuickReplies';
import MessageInput from './MessageInput';

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
              onTypingComplete={onTypingComplete}
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
          onSelect={onQuickReply}
          isMobile={isMobile}
        />
      )}
      
      {/* Input area */}
      <MessageInput
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


import { cn } from '@/lib/utils';
import { Bot, User, Loader2 } from 'lucide-react';
import { Message } from '../types';
import TypingMessage from './TypingMessage';

interface MessageBubbleProps {
  message: Message;
  isRecording: boolean;
  isMobile: boolean;
  showTypingEffect?: boolean;
  onTypingComplete?: () => void;
}

const MessageBubble = ({ 
  message, 
  isRecording, 
  isMobile, 
  showTypingEffect = false,
  onTypingComplete 
}: MessageBubbleProps) => {
  // Show typing effect for bot messages when specified
  if (!message.isUser && showTypingEffect) {
    return (
      <TypingMessage
        message={message.content}
        onComplete={onTypingComplete}
        speed={25}
        isMobile={isMobile}
      />
    );
  }

  return (
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
};

export default MessageBubble;

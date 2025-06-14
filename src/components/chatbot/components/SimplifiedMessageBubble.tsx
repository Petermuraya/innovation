
import { cn } from '@/lib/utils';
import { Bot, User, Loader2, CheckCheck, AlertCircle } from 'lucide-react';
import { Message } from '../types';
import SimplifiedTypingMessage from './SimplifiedTypingMessage';

interface SimplifiedMessageBubbleProps {
  message: Message;
  isMobile: boolean;
  showTypingEffect?: boolean;
  onTypingComplete?: () => void;
}

const SimplifiedMessageBubble = ({ 
  message, 
  isMobile, 
  showTypingEffect = false,
  onTypingComplete 
}: SimplifiedMessageBubbleProps) => {
  if (!message.isUser && showTypingEffect) {
    return (
      <SimplifiedTypingMessage
        message={message.content}
        onComplete={onTypingComplete}
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
          "rounded-full bg-kic-green-600 flex items-center justify-center flex-shrink-0",
          isMobile ? "w-8 h-8" : "w-10 h-10"
        )}>
          <Bot className={cn("text-white", isMobile ? "w-4 h-4" : "w-5 h-5")} />
        </div>
      )}
      
      <div
        className={cn(
          "rounded-2xl p-4 max-w-[80%] shadow-md",
          message.isUser
            ? "bg-kic-green-600 text-white ml-auto"
            : "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700",
          message.status === 'error' && "border-red-400 bg-red-50 dark:bg-red-900/20"
        )}
      >
        <p className="whitespace-pre-wrap leading-relaxed text-sm">
          {message.content}
        </p>
        
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-opacity-20 border-gray-300 dark:border-gray-600">
          {!message.isUser && (
            <span className="text-xs opacity-70">KUIC Assistant</span>
          )}
          
          <div className="flex items-center gap-2">
            <span className="text-xs opacity-70">
              {message.timestamp.toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </span>
            {message.isUser && (
              <>
                {message.status === 'sending' && <Loader2 className="h-3 w-3 animate-spin" />}
                {message.status === 'error' && <AlertCircle className="h-3 w-3 text-red-300" />}
                {message.status === 'delivered' && <CheckCheck className="h-3 w-3 text-green-300" />}
              </>
            )}
          </div>
        </div>
      </div>
      
      {message.isUser && (
        <div className={cn(
          "rounded-full bg-gray-500 flex items-center justify-center flex-shrink-0",
          isMobile ? "w-8 h-8" : "w-10 h-10"
        )}>
          <User className={cn("text-white", isMobile ? "w-4 h-4" : "w-5 h-5")} />
        </div>
      )}
    </div>
  );
};

export default SimplifiedMessageBubble;

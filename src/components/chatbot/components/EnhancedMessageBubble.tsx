
import { cn } from '@/lib/utils';
import { Bot, User, Loader2, CheckCheck, AlertCircle } from 'lucide-react';
import { Message } from '../types';
import EnhancedTypingMessage from './EnhancedTypingMessage';

interface EnhancedMessageBubbleProps {
  message: Message;
  isRecording: boolean;
  isMobile: boolean;
  showTypingEffect?: boolean;
  onTypingComplete?: () => void;
}

const EnhancedMessageBubble = ({ 
  message, 
  isRecording, 
  isMobile, 
  showTypingEffect = false,
  onTypingComplete 
}: EnhancedMessageBubbleProps) => {
  // Show typing effect for bot messages when specified
  if (!message.isUser && showTypingEffect) {
    return (
      <EnhancedTypingMessage
        message={message.content}
        onComplete={onTypingComplete}
        speed={20}
        isMobile={isMobile}
      />
    );
  }

  return (
    <div className={cn(
      "flex items-start gap-3 animate-fade-in group",
      message.isUser ? "justify-end" : "justify-start"
    )}>
      {!message.isUser && (
        <div className={cn(
          "rounded-full bg-gradient-to-br from-kic-green-600 to-kic-green-700 flex items-center justify-center flex-shrink-0 shadow-lg",
          isMobile ? "w-8 h-8" : "w-9 h-9",
          "ring-2 ring-kic-green-300 ring-opacity-30 group-hover:ring-opacity-50 transition-all duration-200"
        )}>
          <Bot className={cn("text-white", isMobile ? "w-4 h-4" : "w-5 h-5")} />
        </div>
      )}
      
      <div
        className={cn(
          "rounded-2xl p-4 relative transition-all duration-300 shadow-lg backdrop-blur-sm",
          isMobile ? "max-w-[85%] text-sm" : "max-w-[80%] text-sm",
          message.isUser
            ? "bg-gradient-to-br from-kic-green-600 to-kic-green-700 text-white ml-auto shadow-kic-green-200"
            : "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-100 dark:border-gray-700",
          message.status === 'error' && "border-2 border-red-400 bg-red-50 dark:bg-red-900/20",
          isRecording && "ring-2 ring-yellow-400 ring-opacity-50 animate-pulse",
          "hover:shadow-xl transform hover:scale-[1.02] group-hover:translate-y-[-2px]"
        )}
      >
        <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
        
        <div className="flex items-center justify-between mt-3 pt-2 border-t border-opacity-20 border-gray-300 dark:border-gray-600">
          <div className="flex items-center gap-2">
            {!message.isUser && (
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span className="text-xs opacity-70">kuic assistant</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2">
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
                {message.status === 'error' && <AlertCircle className="h-3 w-3 text-red-300" />}
                {message.status === 'delivered' && <CheckCheck className="h-3 w-3 text-green-300" />}
              </span>
            )}
          </div>
        </div>
        
        {/* Message decoration */}
        {message.isUser ? (
          <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-gradient-to-br from-kic-green-600 to-kic-green-700 transform rotate-45" />
        ) : (
          <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-white dark:bg-gray-800 border-l border-b border-gray-100 dark:border-gray-700 transform rotate-45" />
        )}
      </div>
      
      {message.isUser && (
        <div className={cn(
          "rounded-full bg-gradient-to-br from-gray-400 to-gray-600 dark:from-gray-500 dark:to-gray-700 flex items-center justify-center flex-shrink-0 shadow-lg",
          isMobile ? "w-8 h-8" : "w-9 h-9",
          "ring-2 ring-gray-300 ring-opacity-30 group-hover:ring-opacity-50 transition-all duration-200"
        )}>
          <User className={cn("text-white", isMobile ? "w-4 h-4" : "w-5 h-5")} />
        </div>
      )}
    </div>
  );
};

export default EnhancedMessageBubble;

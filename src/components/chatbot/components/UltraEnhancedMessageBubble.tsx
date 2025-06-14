
import { cn } from '@/lib/utils';
import { Bot, User, Loader2, CheckCheck, AlertCircle, Sparkles, Crown } from 'lucide-react';
import { Message } from '../types';
import AdvancedTypingMessage from './AdvancedTypingMessage';

interface UltraEnhancedMessageBubbleProps {
  message: Message;
  isRecording: boolean;
  isMobile: boolean;
  showTypingEffect?: boolean;
  onTypingComplete?: () => void;
}

const UltraEnhancedMessageBubble = ({ 
  message, 
  isRecording, 
  isMobile, 
  showTypingEffect = false,
  onTypingComplete 
}: UltraEnhancedMessageBubbleProps) => {
  // Show advanced typing effect for bot messages when specified
  if (!message.isUser && showTypingEffect) {
    return (
      <AdvancedTypingMessage
        message={message.content}
        onComplete={onTypingComplete}
        speed={12}
        isMobile={isMobile}
      />
    );
  }

  return (
    <div className={cn(
      "flex items-start gap-3 animate-fade-in group relative",
      message.isUser ? "justify-end" : "justify-start"
    )}>
      {!message.isUser && (
        <div className={cn(
          "rounded-full bg-gradient-to-br from-kic-green-600 via-kic-green-700 to-kic-green-800 flex items-center justify-center flex-shrink-0 shadow-xl relative overflow-hidden",
          isMobile ? "w-9 h-9" : "w-10 h-10",
          "ring-4 ring-kic-green-300 ring-opacity-30 group-hover:ring-opacity-60 transition-all duration-300 transform group-hover:scale-105"
        )}>
          <Bot className={cn("text-white z-10", isMobile ? "w-4 h-4" : "w-5 h-5")} />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 group-hover:opacity-30 transition-opacity duration-300" />
          <Crown className="absolute -top-1 -right-1 w-3 h-3 text-yellow-400 animate-bounce" />
          <div className="absolute inset-0 rounded-full bg-kic-green-400 animate-pulse opacity-20" />
        </div>
      )}
      
      <div
        className={cn(
          "rounded-2xl p-4 relative transition-all duration-500 shadow-2xl backdrop-blur-sm overflow-hidden",
          isMobile ? "max-w-[85%] text-sm" : "max-w-[80%] text-sm",
          message.isUser
            ? "bg-gradient-to-br from-kic-green-600 via-kic-green-700 to-kic-green-800 text-white ml-auto shadow-kic-green-200 ring-2 ring-kic-green-300 ring-opacity-20"
            : "bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-800 dark:via-gray-750 dark:to-gray-800 text-gray-900 dark:text-gray-100 border border-gray-100 dark:border-gray-700 ring-2 ring-gray-200 ring-opacity-30 dark:ring-gray-700",
          message.status === 'error' && "border-2 border-red-400 bg-red-50 dark:bg-red-900/20 ring-red-400",
          isRecording && "ring-4 ring-yellow-400 ring-opacity-60 animate-pulse",
          "hover:shadow-3xl transform hover:scale-[1.02] group-hover:translate-y-[-3px] hover:rotate-1"
        )}
      >
        {/* Dynamic background effects */}
        {message.isUser ? (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-kic-green-50 via-transparent to-blue-50 dark:from-kic-green-900/10 dark:to-blue-900/10 opacity-30 group-hover:opacity-50 transition-opacity duration-300" />
        )}
        
        {/* Floating particles effect */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white/20 rounded-full animate-float-slow opacity-0 group-hover:opacity-100"
              style={{
                left: `${20 + i * 30}%`,
                top: `${20 + i * 20}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${3 + i}s`
              }}
            />
          ))}
        </div>
        
        <div className="relative z-10">
          <p className="whitespace-pre-wrap leading-relaxed font-medium tracking-wide">
            {message.content}
          </p>
        </div>
        
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-opacity-20 border-gray-300 dark:border-gray-600 relative z-10">
          <div className="flex items-center gap-2">
            {!message.isUser && (
              <div className="flex items-center gap-2">
                <div className="relative">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-lg" />
                  <div className="absolute inset-0 w-2 h-2 bg-green-400 rounded-full animate-ping opacity-50" />
                </div>
                <span className="text-xs opacity-80 font-medium">kuic assistant</span>
                <Sparkles className="w-3 h-3 text-yellow-400 animate-bounce" />
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <p className={cn(
              "text-xs opacity-80 font-medium",
              isMobile ? "text-[10px]" : "text-xs"
            )}>
              {message.timestamp.toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </p>
            {message.isUser && (
              <span className="text-xs opacity-80">
                {message.status === 'sending' && <Loader2 className="h-3 w-3 animate-spin" />}
                {message.status === 'error' && <AlertCircle className="h-3 w-3 text-red-300 animate-pulse" />}
                {message.status === 'delivered' && <CheckCheck className="h-3 w-3 text-green-300 animate-bounce" />}
              </span>
            )}
          </div>
        </div>
        
        {/* Enhanced message decoration with gradients */}
        {message.isUser ? (
          <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-gradient-to-br from-kic-green-600 via-kic-green-700 to-kic-green-800 transform rotate-45 shadow-lg" />
        ) : (
          <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-800 dark:to-gray-800 border-l border-b border-gray-100 dark:border-gray-700 transform rotate-45 shadow-lg" />
        )}
        
        {/* Glow effect on hover */}
        <div className={cn(
          "absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none",
          message.isUser 
            ? "bg-gradient-to-r from-kic-green-400 to-kic-green-600" 
            : "bg-gradient-to-r from-kic-green-400 to-blue-400"
        )} />
      </div>
      
      {message.isUser && (
        <div className={cn(
          "rounded-full bg-gradient-to-br from-gray-500 via-gray-600 to-gray-700 dark:from-gray-400 dark:via-gray-500 dark:to-gray-600 flex items-center justify-center flex-shrink-0 shadow-xl relative overflow-hidden",
          isMobile ? "w-9 h-9" : "w-10 h-10",
          "ring-4 ring-gray-300 ring-opacity-30 group-hover:ring-opacity-60 transition-all duration-300 transform group-hover:scale-105"
        )}>
          <User className={cn("text-white z-10", isMobile ? "w-4 h-4" : "w-5 h-5")} />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 group-hover:opacity-30 transition-opacity duration-300" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-400 rounded-full border-2 border-white animate-pulse" />
        </div>
      )}
    </div>
  );
};

export default UltraEnhancedMessageBubble;

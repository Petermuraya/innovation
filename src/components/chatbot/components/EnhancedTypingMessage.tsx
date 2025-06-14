
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Bot } from 'lucide-react';

interface EnhancedTypingMessageProps {
  message: string;
  onComplete?: () => void;
  speed?: number;
  isMobile: boolean;
}

const EnhancedTypingMessage = ({ message, onComplete, speed = 25, isMobile }: EnhancedTypingMessageProps) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    if (currentIndex < message.length) {
      const timer = setTimeout(() => {
        setDisplayedText(prev => prev + message[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);

      return () => clearTimeout(timer);
    } else if (!isComplete) {
      setIsComplete(true);
      // Hide cursor after completion
      setTimeout(() => setShowCursor(false), 500);
      onComplete?.();
    }
  }, [currentIndex, message, speed, onComplete, isComplete]);

  // Cursor blinking effect
  useEffect(() => {
    if (!isComplete) {
      const cursorTimer = setInterval(() => {
        setShowCursor(prev => !prev);
      }, 500);
      return () => clearInterval(cursorTimer);
    }
  }, [isComplete]);

  return (
    <div className="flex items-start gap-3 animate-fade-in">
      <div className={cn(
        "rounded-full bg-gradient-to-br from-kic-green-600 to-kic-green-700 flex items-center justify-center flex-shrink-0 shadow-lg",
        isMobile ? "w-8 h-8" : "w-9 h-9",
        "ring-2 ring-kic-green-300 ring-opacity-30"
      )}>
        <Bot className={cn("text-white", isMobile ? "w-4 h-4" : "w-5 h-5")} />
        {!isComplete && (
          <div className="absolute inset-0 rounded-full bg-kic-green-400 animate-pulse opacity-20" />
        )}
      </div>
      
      <div className={cn(
        "bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg relative border border-gray-100 dark:border-gray-700",
        isMobile ? "max-w-[85%] text-sm" : "max-w-[80%] text-sm",
        "backdrop-blur-sm"
      )}>
        <div className="relative">
          <p className="whitespace-pre-wrap leading-relaxed text-gray-900 dark:text-gray-100">
            {displayedText}
            {showCursor && (
              <span className="inline-block w-0.5 h-5 bg-kic-green-600 ml-1 animate-pulse" />
            )}
          </p>
        </div>
        
        {isComplete && (
          <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs text-gray-500 dark:text-gray-400">kuic assistant</span>
            </div>
            <p className={cn(
              "text-xs text-gray-500 dark:text-gray-400",
              isMobile ? "text-[10px]" : "text-xs"
            )}>
              {new Date().toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </p>
          </div>
        )}
        
        {/* Message decoration */}
        <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-white dark:bg-gray-800 border-l border-b border-gray-100 dark:border-gray-700 transform rotate-45" />
      </div>
    </div>
  );
};

export default EnhancedTypingMessage;

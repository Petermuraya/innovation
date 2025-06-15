
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Bot, Sparkles } from 'lucide-react';

interface SimplifiedTypingMessageProps {
  message: string;
  onComplete?: () => void;
  speed?: number;
  isMobile: boolean;
}

const SimplifiedTypingMessage = ({ message, onComplete, speed = 25, isMobile }: SimplifiedTypingMessageProps) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    if (currentIndex < message.length && !isComplete) {
      const timer = setTimeout(() => {
        setDisplayedText(prev => prev + message[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);

      return () => clearTimeout(timer);
    } else if (currentIndex >= message.length && !isComplete) {
      setIsComplete(true);
      setShowCursor(false); // Remove cursor immediately when complete
      onComplete?.();
    }
  }, [currentIndex, message, speed, onComplete, isComplete]);

  // Only blink cursor while typing
  useEffect(() => {
    if (!isComplete && showCursor) {
      const cursorTimer = setInterval(() => {
        setShowCursor(prev => !prev);
      }, 500);
      return () => clearInterval(cursorTimer);
    }
  }, [isComplete, showCursor]);

  return (
    <div className="flex items-start gap-3 animate-fade-in">
      <div className={cn(
        "rounded-full bg-gradient-to-br from-green-600 to-green-700 flex items-center justify-center flex-shrink-0 shadow-lg relative",
        isMobile ? "w-8 h-8" : "w-9 h-9",
        "ring-2 ring-green-300 ring-opacity-30"
      )}>
        <Bot className={cn("text-white", isMobile ? "w-4 h-4" : "w-5 h-5")} />
        <Sparkles className="absolute -top-1 -right-1 w-3 h-3 text-yellow-300 animate-bounce" />
        {!isComplete && (
          <div className="absolute inset-0 rounded-full bg-green-400 animate-pulse opacity-20" />
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
            {!isComplete && showCursor && (
              <span className="inline-block w-0.5 h-5 bg-gradient-to-b from-green-600 to-green-700 ml-1 animate-pulse" />
            )}
          </p>
        </div>
        
        {isComplete && (
          <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-gradient-to-r from-green-500 to-yellow-500 rounded-full animate-pulse" />
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

export default SimplifiedTypingMessage;


import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Bot } from 'lucide-react';

interface CleanTypingMessageProps {
  message: string;
  onComplete?: () => void;
  isMobile: boolean;
}

const CleanTypingMessage = ({ message, onComplete, isMobile }: CleanTypingMessageProps) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    if (currentIndex < message.length && !isComplete) {
      const timer = setTimeout(() => {
        setDisplayedText(message.slice(0, currentIndex + 1));
        setCurrentIndex(prev => prev + 1);
      }, 50);

      return () => clearTimeout(timer);
    } else if (currentIndex >= message.length && !isComplete) {
      setIsComplete(true);
      setShowCursor(false); // Remove cursor immediately when complete
      if (onComplete) {
        onComplete();
      }
    }
  }, [currentIndex, message, onComplete, isComplete]);

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
        "rounded-full bg-kic-green-600 flex items-center justify-center flex-shrink-0",
        isMobile ? "w-8 h-8" : "w-10 h-10"
      )}>
        <Bot className={cn("text-white", isMobile ? "w-4 h-4" : "w-5 h-5")} />
      </div>
      
      <div className={cn(
        "bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-md max-w-[80%] border border-gray-200 dark:border-gray-700"
      )}>
        <p className="whitespace-pre-wrap leading-relaxed text-sm text-gray-900 dark:text-gray-100">
          {displayedText}
          {!isComplete && showCursor && (
            <span className="inline-block w-0.5 h-4 bg-kic-green-600 ml-1 animate-pulse" />
          )}
        </p>
        
        {isComplete && (
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
            <span className="text-xs text-gray-500 dark:text-gray-400">KUIC Assistant</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {new Date().toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default CleanTypingMessage;

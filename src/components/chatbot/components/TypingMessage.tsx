
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Bot } from 'lucide-react';

interface TypingMessageProps {
  message: string;
  onComplete?: () => void;
  speed?: number;
  isMobile: boolean;
}

const TypingMessage = ({ message, onComplete, speed = 30, isMobile }: TypingMessageProps) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (currentIndex < message.length) {
      const timer = setTimeout(() => {
        setDisplayedText(prev => prev + message[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);

      return () => clearTimeout(timer);
    } else if (!isComplete) {
      setIsComplete(true);
      onComplete?.();
    }
  }, [currentIndex, message, speed, onComplete, isComplete]);

  return (
    <div className="flex items-start gap-3 animate-fade-in">
      <div className={cn(
        "rounded-full bg-gradient-to-br from-kic-green-600 to-kic-green-700 flex items-center justify-center flex-shrink-0",
        isMobile ? "w-7 h-7" : "w-8 h-8"
      )}>
        <Bot className={cn("text-white", isMobile ? "w-3 h-3" : "w-4 h-4")} />
      </div>
      
      <div className={cn(
        "bg-gray-100 dark:bg-gray-800 rounded-2xl p-3 shadow-sm relative",
        isMobile ? "max-w-[85%] text-sm" : "max-w-[80%] text-sm"
      )}>
        <p className="whitespace-pre-wrap leading-relaxed text-gray-900 dark:text-gray-100">
          {displayedText}
          {!isComplete && (
            <span className="inline-block w-0.5 h-4 bg-kic-green-600 ml-1 animate-pulse" />
          )}
        </p>
        
        {isComplete && (
          <div className="flex items-center justify-end mt-2">
            <p className={cn(
              "text-xs opacity-70 text-gray-600 dark:text-gray-400",
              isMobile ? "text-[10px]" : "text-xs"
            )}>
              {new Date().toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TypingMessage;

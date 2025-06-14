
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Bot, Sparkles } from 'lucide-react';

interface EnhancedTypingEffectProps {
  message: string;
  onComplete?: () => void;
  isMobile: boolean;
}

const EnhancedTypingEffect = ({ message, onComplete, isMobile }: EnhancedTypingEffectProps) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    if (currentIndex < message.length && !isComplete) {
      const timer = setTimeout(() => {
        setDisplayedText(message.slice(0, currentIndex + 1));
        setCurrentIndex(prev => prev + 1);
      }, 30);

      return () => clearTimeout(timer);
    } else if (currentIndex >= message.length && !isComplete) {
      setIsComplete(true);
      setShowCursor(false); // Remove cursor immediately when complete
      if (onComplete) {
        setTimeout(onComplete, 100);
      }
    }
  }, [currentIndex, message, onComplete, isComplete]);

  // Only blink cursor while typing, not after completion
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
        "rounded-full bg-gradient-to-br from-kic-green-500 to-kic-green-700 flex items-center justify-center flex-shrink-0 shadow-lg",
        isMobile ? "w-9 h-9" : "w-11 h-11",
        "ring-2 ring-kic-green-300 ring-opacity-50"
      )}>
        <Bot className={cn("text-white", isMobile ? "w-4 h-4" : "w-5 h-5")} />
        <Sparkles className="absolute top-0 right-0 w-3 h-3 text-yellow-300 animate-bounce" />
      </div>
      
      <div className={cn(
        "bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-4 shadow-xl max-w-[85%] border border-kic-green-200 dark:border-gray-600",
        "backdrop-blur-sm transform hover:scale-[1.02] transition-all duration-300"
      )}>
        <div className="relative">
          <p className="whitespace-pre-wrap leading-relaxed text-sm text-gray-900 dark:text-gray-100">
            {displayedText}
            {!isComplete && showCursor && (
              <span className="inline-block w-0.5 h-5 bg-gradient-to-b from-kic-green-500 to-kic-green-700 ml-1 animate-pulse shadow-sm" />
            )}
          </p>
          
          {!isComplete && (
            <div className="absolute -bottom-1 -right-1">
              <div className="flex space-x-1">
                {[0, 0.2, 0.4].map((delay, index) => (
                  <div 
                    key={index}
                    className="w-1.5 h-1.5 bg-kic-green-500 rounded-full animate-bounce opacity-60"
                    style={{ animationDelay: `${delay}s` }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
        
        {isComplete && (
          <div className="flex items-center justify-between mt-3 pt-2 border-t border-kic-green-100 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs text-kic-green-600 dark:text-kic-green-400 font-medium">kuic assistant</span>
            </div>
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

export default EnhancedTypingEffect;

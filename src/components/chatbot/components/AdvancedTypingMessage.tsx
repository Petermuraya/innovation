
import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Bot, Sparkles, Zap } from 'lucide-react';

interface AdvancedTypingMessageProps {
  message: string;
  onComplete?: () => void;
  speed?: number;
  isMobile: boolean;
}

const AdvancedTypingMessage = ({ message, onComplete, speed = 15, isMobile }: AdvancedTypingMessageProps) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [showCursor, setShowCursor] = useState(true);
  const [isThinking, setIsThinking] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  // Pre-typing thinking phase
  useEffect(() => {
    const thinkingTimer = setTimeout(() => {
      setIsThinking(false);
    }, 1200);

    return () => clearTimeout(thinkingTimer);
  }, []);

  // Advanced typing effect with natural pauses
  useEffect(() => {
    if (isThinking || currentIndex >= message.length) return;

    const currentChar = message[currentIndex];
    let delay = speed;

    // Natural typing delays
    if (currentChar === '.' || currentChar === '!' || currentChar === '?') {
      delay = speed * 8; // Longer pause after sentences
    } else if (currentChar === ',' || currentChar === ';') {
      delay = speed * 4; // Medium pause after commas
    } else if (currentChar === ' ') {
      delay = speed * 1.5; // Slight pause after words
    } else if (Math.random() < 0.1) {
      delay = speed * 2; // Random natural hesitations
    }

    const timer = setTimeout(() => {
      setDisplayedText(prev => prev + currentChar);
      setCurrentIndex(prev => prev + 1);
    }, delay);

    return () => clearTimeout(timer);
  }, [currentIndex, message, speed, isThinking]);

  // Completion handler
  useEffect(() => {
    if (!isThinking && currentIndex >= message.length && !isComplete) {
      setIsComplete(true);
      setTimeout(() => setShowCursor(false), 800);
      setTimeout(() => onComplete?.(), 500);
    }
  }, [currentIndex, message.length, onComplete, isComplete, isThinking]);

  // Cursor blinking effect
  useEffect(() => {
    if (isComplete) return;
    
    const cursorTimer = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 530);
    return () => clearInterval(cursorTimer);
  }, [isComplete]);

  if (isThinking) {
    return (
      <div className="flex items-start gap-3 animate-fade-in">
        <div className={cn(
          "rounded-full bg-gradient-to-br from-kic-green-600 via-kic-green-700 to-kic-green-800 flex items-center justify-center flex-shrink-0 shadow-xl relative overflow-hidden",
          isMobile ? "w-9 h-9" : "w-10 h-10",
          "ring-4 ring-kic-green-300 ring-opacity-20 animate-pulse"
        )}>
          <Bot className={cn("text-white z-10", isMobile ? "w-4 h-4" : "w-5 h-5")} />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-pulse" />
          <Sparkles className="absolute -top-1 -right-1 w-3 h-3 text-yellow-300 animate-bounce" />
          <div className="absolute inset-0 rounded-full bg-kic-green-400 animate-ping opacity-20" />
        </div>
        
        <div className="bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-800 dark:via-gray-750 dark:to-gray-800 rounded-2xl p-4 shadow-2xl border border-gray-100 dark:border-gray-700 backdrop-blur-sm relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-kic-green-50 via-transparent to-kic-green-50 dark:from-kic-green-900/10 dark:to-kic-green-900/10 animate-pulse" />
          
          <div className="flex items-center gap-3 relative z-10">
            <div className="flex space-x-1">
              {[0, 0.15, 0.3].map((delay, index) => (
                <div 
                  key={index}
                  className="w-2.5 h-2.5 bg-gradient-to-r from-kic-green-500 to-kic-green-600 rounded-full animate-bounce shadow-lg"
                  style={{ animationDelay: `${delay}s`, animationDuration: '0.8s' }}
                />
              ))}
            </div>
            <span className="text-xs text-gray-600 dark:text-gray-400 animate-pulse font-medium">
              kuic assistant is crafting response...
            </span>
            <Zap className="w-3 h-3 text-kic-green-600 animate-pulse" />
          </div>
          
          <div className="mt-3 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
            <div className="h-full bg-gradient-to-r from-kic-green-400 via-kic-green-500 to-kic-green-600 rounded-full animate-pulse shadow-lg" 
                 style={{ width: '75%' }} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3 animate-fade-in group">
      <div className={cn(
        "rounded-full bg-gradient-to-br from-kic-green-600 via-kic-green-700 to-kic-green-800 flex items-center justify-center flex-shrink-0 shadow-xl relative overflow-hidden",
        isMobile ? "w-9 h-9" : "w-10 h-10",
        "ring-4 ring-kic-green-300 ring-opacity-30 group-hover:ring-opacity-50 transition-all duration-300"
      )}>
        <Bot className={cn("text-white z-10", isMobile ? "w-4 h-4" : "w-5 h-5")} />
        {!isComplete && (
          <>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 animate-pulse" />
            <div className="absolute inset-0 rounded-full bg-kic-green-400 animate-ping opacity-20" />
          </>
        )}
        {isComplete && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-bounce" />
        )}
      </div>
      
      <div className={cn(
        "bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-800 dark:via-gray-750 dark:to-gray-800 rounded-2xl p-4 shadow-2xl relative border border-gray-100 dark:border-gray-700",
        isMobile ? "max-w-[85%] text-sm" : "max-w-[80%] text-sm",
        "backdrop-blur-sm overflow-hidden group-hover:shadow-3xl transition-all duration-300"
      )}>
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-kic-green-50 via-transparent to-blue-50 dark:from-kic-green-900/10 dark:to-blue-900/10 opacity-30" />
        
        {/* Shimmer effect during typing */}
        {!isComplete && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
        )}
        
        <div className="relative z-10">
          <p className="whitespace-pre-wrap leading-relaxed text-gray-900 dark:text-gray-100 font-medium">
            {displayedText}
            {showCursor && !isComplete && (
              <span className="inline-block w-0.5 h-5 bg-gradient-to-b from-kic-green-600 to-kic-green-700 ml-1 animate-pulse shadow-lg" />
            )}
          </p>
        </div>
        
        {isComplete && (
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-200 dark:border-gray-700 relative z-10">
            <div className="flex items-center gap-2">
              <div className="relative">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-lg" />
                <div className="absolute inset-0 w-2 h-2 bg-green-400 rounded-full animate-ping opacity-50" />
              </div>
              <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">kuic assistant</span>
              <Sparkles className="w-3 h-3 text-yellow-500 animate-bounce" />
            </div>
            <p className={cn(
              "text-xs text-gray-500 dark:text-gray-400 font-medium",
              isMobile ? "text-[10px]" : "text-xs"
            )}>
              {new Date().toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </p>
          </div>
        )}
        
        {/* Message tail with gradient */}
        <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-800 dark:to-gray-800 border-l border-b border-gray-100 dark:border-gray-700 transform rotate-45 shadow-lg" />
      </div>
    </div>
  );
};

export default AdvancedTypingMessage;

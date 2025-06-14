
import { cn } from '@/lib/utils';
import { Bot, Sparkles } from 'lucide-react';

interface EnhancedLoadingIndicatorProps {
  isMobile: boolean;
}

const EnhancedLoadingIndicator = ({ isMobile }: EnhancedLoadingIndicatorProps) => (
  <div className="flex items-start gap-3 animate-fade-in">
    <div className={cn(
      "rounded-full bg-gradient-to-br from-kic-green-600 to-kic-green-700 flex items-center justify-center flex-shrink-0 shadow-lg relative overflow-hidden",
      isMobile ? "w-8 h-8" : "w-9 h-9",
      "ring-2 ring-kic-green-300 ring-opacity-30"
    )}>
      <Bot className={cn("text-white z-10", isMobile ? "w-4 h-4" : "w-5 h-5")} />
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 animate-pulse" />
      <Sparkles className="absolute top-1 right-1 w-2 h-2 text-yellow-300 animate-bounce" />
    </div>
    
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg border border-gray-100 dark:border-gray-700 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <div className="flex space-x-1">
          {[0, 0.2, 0.4].map((delay, index) => (
            <div 
              key={index}
              className="w-2 h-2 bg-kic-green-600 rounded-full animate-bounce"
              style={{ animationDelay: `${delay}s` }}
            />
          ))}
        </div>
        <span className="text-xs text-gray-500 dark:text-gray-400 animate-pulse">
          kuic assistant is thinking...
        </span>
      </div>
      
      {/* Thinking progress bar */}
      <div className="mt-3 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1 overflow-hidden">
        <div className="h-full bg-gradient-to-r from-kic-green-400 to-kic-green-600 rounded-full animate-pulse" 
             style={{ width: '60%' }} />
      </div>
    </div>
  </div>
);

export default EnhancedLoadingIndicator;

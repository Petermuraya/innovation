
import { cn } from '@/lib/utils';
import { Bot } from 'lucide-react';

interface SimplifiedLoadingIndicatorProps {
  isMobile: boolean;
}

const SimplifiedLoadingIndicator = ({ isMobile }: SimplifiedLoadingIndicatorProps) => (
  <div className="flex items-start gap-3 animate-fade-in">
    <div className={cn(
      "rounded-full bg-kic-green-600 flex items-center justify-center flex-shrink-0",
      isMobile ? "w-8 h-8" : "w-10 h-10"
    )}>
      <Bot className={cn("text-white", isMobile ? "w-4 h-4" : "w-5 h-5")} />
    </div>
    
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-md border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-2">
        <div className="flex space-x-1">
          {[0, 0.2, 0.4].map((delay, index) => (
            <div 
              key={index}
              className="w-2 h-2 bg-kic-green-600 rounded-full animate-bounce"
              style={{ animationDelay: `${delay}s` }}
            />
          ))}
        </div>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          Typing...
        </span>
      </div>
    </div>
  </div>
);

export default SimplifiedLoadingIndicator;

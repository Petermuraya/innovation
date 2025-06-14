
import { cn } from '@/lib/utils';
import { Bot } from 'lucide-react';

interface LoadingIndicatorProps {
  isMobile: boolean;
}

const LoadingIndicator = ({ isMobile }: LoadingIndicatorProps) => (
  <div className="flex items-start gap-3 animate-fade-in">
    <div className={cn(
      "rounded-full bg-gradient-to-br from-kic-green-600 to-kic-green-700 flex items-center justify-center flex-shrink-0",
      isMobile ? "w-7 h-7" : "w-8 h-8"
    )}>
      <Bot className={cn("text-white", isMobile ? "w-3 h-3" : "w-4 h-4")} />
    </div>
    <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl p-3 shadow-sm">
      <div className="flex space-x-2">
        {[0, 0.2, 0.4].map((delay) => (
          <div 
            key={delay}
            className="w-2 h-2 bg-kic-green-600 rounded-full animate-bounce"
            style={{ animationDelay: `${delay}s` }}
          />
        ))}
      </div>
    </div>
  </div>
);

export default LoadingIndicator;

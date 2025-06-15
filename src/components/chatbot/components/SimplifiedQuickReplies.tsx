
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Zap, ArrowRight } from 'lucide-react';

interface SimplifiedQuickRepliesProps {
  replies: string[];
  onSelect: (reply: string) => void;
  isMobile: boolean;
}

const SimplifiedQuickReplies = ({ replies, onSelect, isMobile }: SimplifiedQuickRepliesProps) => (
  <div className={cn(
    "border-t border-gray-200 dark:border-gray-700 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900",
    isMobile ? "px-3 py-4" : "px-4 py-4"
  )}>
    <div className="flex items-center gap-2 mb-3">
      <Zap className="w-4 h-4 text-green-600" />
      <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
        quick suggestions
      </span>
    </div>
    
    <div className="flex flex-wrap gap-2">
      {replies.map((reply, index) => (
        <Button
          key={reply}
          variant="outline"
          size="sm"
          className={cn(
            "rounded-full bg-white hover:bg-gradient-to-r hover:from-green-50 hover:to-yellow-50 border-gray-200 hover:border-green-300 transition-all duration-300",
            "dark:bg-gray-800 dark:hover:bg-gradient-to-r dark:hover:from-green-900/20 dark:hover:to-yellow-900/20 dark:border-gray-700 dark:hover:border-green-600",
            "text-gray-700 dark:text-gray-300 hover:text-green-700 dark:hover:text-green-400",
            "group relative overflow-hidden shadow-sm hover:shadow-md",
            isMobile ? "text-xs h-8 px-3" : "text-xs h-9 px-4",
            "transform hover:scale-105 active:scale-95"
          )}
          onClick={() => onSelect(reply)}
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <span className="relative z-10 flex items-center gap-1">
            {reply}
            <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          </span>
          
          {/* Enhanced hover effect background */}
          <div className="absolute inset-0 bg-gradient-to-r from-green-400 via-yellow-400 to-green-600 opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
        </Button>
      ))}
    </div>
    
    <div className="mt-3 text-center">
      <span className="text-xs text-gray-400 dark:text-gray-500">
        or type your own question below
      </span>
    </div>
  </div>
);

export default SimplifiedQuickReplies;

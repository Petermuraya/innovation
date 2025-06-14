
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface QuickRepliesProps {
  replies: string[];
  onSelect: (reply: string) => void;
  isMobile: boolean;
}

const QuickReplies = ({ replies, onSelect, isMobile }: QuickRepliesProps) => (
  <div className={cn(
    "flex flex-wrap gap-2 border-t border-gray-200 dark:border-gray-700",
    isMobile ? "px-3 py-3" : "px-4 py-3"
  )}>
    {replies.map((reply) => (
      <Button
        key={reply}
        variant="outline"
        size="sm"
        className={cn(
          "rounded-full bg-gray-50 hover:bg-kic-green-50 border-gray-200 hover:border-kic-green-300 transition-all duration-200",
          "dark:bg-gray-800 dark:hover:bg-kic-green-900/20 dark:border-gray-700 dark:hover:border-kic-green-600",
          "text-gray-700 dark:text-gray-300 hover:text-kic-green-700 dark:hover:text-kic-green-400",
          isMobile ? "text-xs h-7 px-3" : "text-xs h-8 px-4",
          "transform hover:scale-105 active:scale-95"
        )}
        onClick={() => onSelect(reply)}
      >
        {reply}
      </Button>
    ))}
  </div>
);

export default QuickReplies;

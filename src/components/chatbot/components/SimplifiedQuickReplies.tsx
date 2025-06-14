
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SimplifiedQuickRepliesProps {
  replies: string[];
  onSelect: (reply: string) => void;
  isMobile: boolean;
}

const SimplifiedQuickReplies = ({ replies, onSelect, isMobile }: SimplifiedQuickRepliesProps) => (
  <div className={cn(
    "border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800",
    isMobile ? "px-4 py-3" : "px-6 py-4"
  )}>
    <div className="mb-2">
      <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
        Quick suggestions:
      </span>
    </div>
    
    <div className="flex flex-wrap gap-2">
      {replies.map((reply) => (
        <Button
          key={reply}
          variant="outline"
          size="sm"
          className="rounded-full text-xs h-8 px-3 hover:bg-kic-green-50 hover:border-kic-green-300"
          onClick={() => onSelect(reply)}
        >
          {reply}
        </Button>
      ))}
    </div>
  </div>
);

export default SimplifiedQuickReplies;

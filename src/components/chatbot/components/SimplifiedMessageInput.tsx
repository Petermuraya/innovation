
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Send, Loader2 } from 'lucide-react';

interface SimplifiedMessageInputProps {
  value: string;
  onChange: (value: string) => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  isLoading: boolean;
  onSend: () => void;
  isMobile: boolean;
}

const SimplifiedMessageInput = ({ 
  value,
  onChange,
  onKeyPress,
  isLoading,
  onSend,
  isMobile
}: SimplifiedMessageInputProps) => (
  <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
    <div className="flex gap-2 items-center">
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyPress={onKeyPress}
        placeholder="Ask me anything about KUIC..."
        className={cn(
          "flex-1 border-gray-300 dark:border-gray-600",
          isMobile ? "text-sm h-10" : "text-sm h-11"
        )}
        disabled={isLoading}
      />
      
      <Button
        onClick={onSend}
        disabled={!value.trim() || isLoading}
        size="icon"
        className={cn(
          "bg-kic-green-600 hover:bg-kic-green-700 text-white",
          isMobile ? "h-10 w-10" : "h-11 w-11"
        )}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Send className="h-4 w-4" />
        )}
      </Button>
    </div>
  </div>
);

export default SimplifiedMessageInput;

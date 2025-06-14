
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Paperclip, Send, Loader2 } from 'lucide-react';

interface MessageInputProps {
  inputRef: React.RefObject<HTMLInputElement>;
  value: string;
  onChange: (value: string) => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  isLoading: boolean;
  onSend: () => void;
  isMobile: boolean;
}

const MessageInput = ({ 
  inputRef,
  value,
  onChange,
  onKeyPress,
  isLoading,
  onSend,
  isMobile
}: MessageInputProps) => (
  <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-3">
    <div className="flex gap-2 items-end">
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex-shrink-0",
          isMobile ? "h-8 w-8" : "h-9 w-9"
        )}
        aria-label="Attach file"
      >
        <Paperclip className="h-4 w-4" />
      </Button>
      
      <div className="flex-1 relative">
        <Input
          ref={inputRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyPress={onKeyPress}
          placeholder="Ask me anything about KUIC..."
          className={cn(
            "pr-12 bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600",
            "focus:border-kic-green-500 focus:ring-kic-green-500/20",
            "rounded-full transition-all duration-200",
            isMobile ? "text-sm py-2" : "text-sm py-2"
          )}
          disabled={isLoading}
        />
        
        <Button
          onClick={onSend}
          disabled={!value.trim() || isLoading}
          size="icon"
          className={cn(
            "absolute right-1 top-1/2 -translate-y-1/2 rounded-full",
            "bg-kic-green-600 hover:bg-kic-green-700 disabled:bg-gray-300 dark:disabled:bg-gray-600",
            "transition-all duration-200 transform hover:scale-105 active:scale-95",
            isMobile ? "h-7 w-7" : "h-8 w-8"
          )}
          aria-label="Send message"
        >
          {isLoading ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            <Send className="h-3 w-3" />
          )}
        </Button>
      </div>
    </div>
  </div>
);

export default MessageInput;

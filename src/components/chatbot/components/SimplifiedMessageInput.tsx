
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Paperclip, Send, Loader2, Mic, Smile } from 'lucide-react';

interface SimplifiedMessageInputProps {
  inputRef: React.RefObject<HTMLInputElement>;
  value: string;
  onChange: (value: string) => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  isLoading: boolean;
  onSend: () => void;
  isMobile: boolean;
}

const SimplifiedMessageInput = ({ 
  inputRef,
  value,
  onChange,
  onKeyPress,
  isLoading,
  onSend,
  isMobile
}: SimplifiedMessageInputProps) => (
  <div className="border-t border-gray-200 dark:border-gray-700 bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 p-4">
    <div className="flex gap-3 items-end">
      {/* Attachment button */}
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "text-gray-500 hover:bg-green-50 hover:text-green-600 dark:hover:bg-green-900/20 dark:hover:text-green-400 transition-all duration-200 flex-shrink-0",
          isMobile ? "h-9 w-9" : "h-10 w-10",
          "group relative overflow-hidden"
        )}
        aria-label="Attach file"
      >
        <Paperclip className="h-4 w-4 group-hover:rotate-12 transition-transform duration-200" />
        <div className="absolute inset-0 bg-green-500 opacity-0 group-hover:opacity-10 transition-opacity duration-200" />
      </Button>
      
      {/* Emoji button */}
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "text-gray-500 hover:bg-yellow-50 hover:text-yellow-600 dark:hover:bg-yellow-900/20 dark:hover:text-yellow-400 transition-all duration-200 flex-shrink-0",
          isMobile ? "h-9 w-9" : "h-10 w-10",
          "group relative overflow-hidden"
        )}
        aria-label="Add emoji"
      >
        <Smile className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
      </Button>
      
      {/* Input field */}
      <div className="flex-1 relative">
        <Input
          ref={inputRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyPress={onKeyPress}
          placeholder="ask me anything about kuic..."
          className={cn(
            "pr-12 bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 shadow-sm",
            "focus:border-green-500 focus:ring-green-500/20 focus:shadow-md",
            "rounded-full transition-all duration-200 placeholder:text-gray-400",
            isMobile ? "text-sm py-3 h-11" : "text-sm py-3 h-12"
          )}
          disabled={isLoading}
        />
        
        {/* Character counter */}
        {value.length > 0 && (
          <div className="absolute -bottom-5 right-2 text-xs text-gray-400">
            {value.length}/500
          </div>
        )}
      </div>
      
      {/* Voice input button */}
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "text-gray-500 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/20 dark:hover:text-blue-400 transition-all duration-200 flex-shrink-0",
          isMobile ? "h-9 w-9" : "h-10 w-10",
          "group relative overflow-hidden"
        )}
        aria-label="Voice input"
      >
        <Mic className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
      </Button>
      
      {/* Enhanced send button */}
      <Button
        onClick={onSend}
        disabled={!value.trim() || isLoading}
        size="icon"
        className={cn(
          "rounded-full shadow-lg transition-all duration-300 transform flex-shrink-0",
          "bg-gradient-to-r from-green-600 via-green-700 to-green-800 hover:from-green-700 hover:via-green-800 hover:to-green-900",
          "disabled:from-gray-300 disabled:to-gray-400 dark:disabled:from-gray-600 dark:disabled:to-gray-700",
          "hover:scale-110 active:scale-95 disabled:scale-100",
          "hover:shadow-green-300 hover:shadow-xl",
          isMobile ? "h-9 w-9" : "h-10 w-10",
          "group relative overflow-hidden"
        )}
        aria-label="Send message"
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Send className="h-4 w-4 group-hover:translate-x-0.5 transition-transform duration-200" />
        )}
        
        {/* Enhanced ripple effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-yellow-300/20 opacity-0 group-active:opacity-100 transition-opacity duration-150 rounded-full" />
      </Button>
    </div>
    
    {/* Enhanced status indicator */}
    <div className="flex items-center justify-center mt-2">
      <div className="flex items-center gap-2 text-xs text-gray-400">
        <div className="w-2 h-2 bg-gradient-to-r from-green-500 to-yellow-500 rounded-full animate-pulse" />
        <span>kuic assistant is online</span>
      </div>
    </div>
  </div>
);

export default SimplifiedMessageInput;

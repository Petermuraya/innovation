
import { Button } from '@/components/ui/button';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { Bot, X, Mic, Minimize2, Maximize2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatbotHeaderProps {
  user: any;
  userName?: string;
  isMobile: boolean;
  isMinimized: boolean;
  isRecording: boolean;
  onClose: () => void;
  onToggleMinimize: () => void;
  onToggleRecording: () => void;
}

const ChatbotHeader = ({
  user,
  userName,
  isMobile,
  isMinimized,
  isRecording,
  onClose,
  onToggleMinimize,
  onToggleRecording
}: ChatbotHeaderProps) => {
  return (
    <CardHeader className={cn(
      "flex flex-row items-center justify-between space-y-0 pb-3",
      "bg-gradient-to-r from-kic-green-600 to-kic-green-700 text-white",
      isMobile ? "px-4 py-3 rounded-t-none" : "px-4 py-3 rounded-t-lg",
      "border-b border-kic-green-800"
    )}>
      <div className="flex items-center gap-3">
        <div className="relative">
          <Bot className={cn("text-white", isMobile ? "h-5 w-5" : "h-6 w-6")} />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse" />
        </div>
        <div>
          <CardTitle className={cn("font-bold text-white", isMobile ? "text-lg" : "text-xl")}>
            kuic assistant
          </CardTitle>
          <p className="text-xs text-green-100 opacity-90">
            {user ? `hello, ${userName || 'there'}!` : "ready to help"}
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-1">
        {!isMobile && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleMinimize}
            className="h-8 w-8 text-white hover:bg-kic-green-800 transition-colors"
            aria-label={isMinimized ? "Expand chat" : "Minimize chat"}
          >
            {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
          </Button>
        )}
        
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleRecording}
          className={cn(
            "h-8 w-8 text-white transition-all duration-200",
            isRecording 
              ? "bg-red-500 hover:bg-red-600 animate-pulse shadow-lg" 
              : "hover:bg-kic-green-800"
          )}
          aria-label={isRecording ? "Stop recording" : "Start recording"}
        >
          <Mic className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="h-8 w-8 text-white hover:bg-kic-green-800 transition-colors"
          aria-label="Close chat"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </CardHeader>
  );
};

export default ChatbotHeader;

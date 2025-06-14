
import { Button } from '@/components/ui/button';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { Bot, X, Mic, Minimize2, Maximize2, Settings, Sparkles } from 'lucide-react';
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
      "flex flex-row items-center justify-between space-y-0 pb-3 relative overflow-hidden",
      "bg-gradient-to-r from-kic-green-600 via-kic-green-700 to-kic-green-800 text-white",
      isMobile ? "px-4 py-4 rounded-t-none" : "px-5 py-4 rounded-t-lg",
      "border-b border-kic-green-800 shadow-lg"
    )}>
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse" />
      <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
      
      <div className="flex items-center gap-4 relative z-10">
        <div className="relative">
          <div className={cn(
            "rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center",
            isMobile ? "w-10 h-10" : "w-12 h-12",
            "shadow-lg border border-white/20"
          )}>
            <Bot className={cn("text-white", isMobile ? "h-5 w-5" : "h-6 w-6")} />
            <Sparkles className="absolute -top-1 -right-1 w-3 h-3 text-yellow-300 animate-bounce" />
          </div>
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse border-2 border-white" />
        </div>
        
        <div>
          <CardTitle className={cn(
            "font-bold text-white flex items-center gap-2",
            isMobile ? "text-lg" : "text-xl"
          )}>
            kuic assistant
            <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse" />
          </CardTitle>
          <p className="text-sm text-green-100 opacity-90 flex items-center gap-1">
            {user ? (
              <>
                <span>hello, {userName || 'there'}!</span>
                <Sparkles className="w-3 h-3" />
              </>
            ) : (
              "ready to help you innovate"
            )}
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-1 relative z-10">
        {!isMobile && (
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-white hover:bg-white/10 transition-all duration-200 rounded-full backdrop-blur-sm border border-white/0 hover:border-white/20"
            aria-label="Settings"
          >
            <Settings className="h-4 w-4" />
          </Button>
        )}
        
        {!isMobile && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleMinimize}
            className="h-9 w-9 text-white hover:bg-white/10 transition-all duration-200 rounded-full backdrop-blur-sm border border-white/0 hover:border-white/20"
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
            "h-9 w-9 text-white transition-all duration-300 rounded-full backdrop-blur-sm border",
            isRecording 
              ? "bg-red-500 hover:bg-red-600 border-red-400 animate-pulse shadow-lg shadow-red-500/30" 
              : "hover:bg-white/10 border-white/0 hover:border-white/20"
          )}
          aria-label={isRecording ? "Stop recording" : "Start recording"}
        >
          <Mic className={cn("h-4 w-4", isRecording && "animate-pulse")} />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="h-9 w-9 text-white hover:bg-red-500/20 hover:text-red-100 transition-all duration-200 rounded-full backdrop-blur-sm border border-white/0 hover:border-red-300/50"
          aria-label="Close chat"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </CardHeader>
  );
};

export default ChatbotHeader;

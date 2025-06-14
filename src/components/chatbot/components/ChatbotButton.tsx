
import { Button } from '@/components/ui/button';
import { MessageCircle, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatbotButtonProps {
  onClick: () => void;
  isMobile: boolean;
}

const ChatbotButton = ({ onClick, isMobile }: ChatbotButtonProps) => {
  return (
    <div className="relative">
      <Button
        onClick={onClick}
        className={cn(
          "fixed shadow-2xl transition-all duration-500 hover:scale-110 z-50 group relative overflow-hidden",
          "bg-gradient-to-r from-kic-green-600 to-kic-green-700 hover:from-kic-green-700 hover:to-kic-green-800",
          "border-2 border-white/20 backdrop-blur-sm",
          isMobile 
            ? "bottom-4 right-4 h-14 w-14 rounded-full" 
            : "bottom-6 right-6 h-16 w-16 rounded-full"
        )}
        size="icon"
        aria-label="open chat assistant"
      >
        {/* Background gradient animation */}
        <div className="absolute inset-0 bg-gradient-to-r from-kic-green-400 to-kic-green-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full" />
        
        {/* Main icon */}
        <MessageCircle className={cn(
          "text-white relative z-10 group-hover:scale-110 transition-transform duration-300", 
          isMobile ? "h-6 w-6" : "h-7 w-7"
        )} />
        
        {/* Sparkle effect */}
        <Sparkles className="absolute top-2 right-2 w-3 h-3 text-yellow-300 animate-bounce opacity-80" />
        
        {/* Pulse rings */}
        <div className="absolute inset-0 rounded-full bg-kic-green-600 animate-ping opacity-20" />
        <div className="absolute inset-0 rounded-full bg-kic-green-500 animate-pulse opacity-30" />
        
        {/* Notification dot */}
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white flex items-center justify-center animate-bounce">
          <div className="w-2 h-2 bg-white rounded-full" />
        </div>
      </Button>
      
      {/* Tooltip */}
      <div className={cn(
        "absolute bottom-full right-0 mb-2 px-3 py-1 bg-black/80 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap backdrop-blur-sm",
        isMobile ? "hidden" : "block"
      )}>
        chat with kuic assistant
        <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black/80" />
      </div>
    </div>
  );
};

export default ChatbotButton;

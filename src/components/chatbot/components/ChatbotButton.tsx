
import { Button } from '@/components/ui/button';
import { MessageCircle, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatbotButtonProps {
  onClick: () => void;
  isMobile: boolean;
}

const ChatbotButton = ({ onClick, isMobile }: ChatbotButtonProps) => {
  return (
    <Button
      onClick={onClick}
      className={cn(
        "fixed shadow-lg transition-all duration-300 hover:scale-105 z-50 group",
        "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white",
        "shadow-xl hover:shadow-green-500/40",
        isMobile 
          ? "bottom-4 right-4 h-14 w-14 rounded-full" 
          : "bottom-6 right-6 h-16 w-16 rounded-full"
      )}
      size="icon"
      aria-label="Open chat assistant"
    >
      <MessageCircle className={cn(
        "text-white", 
        isMobile ? "h-6 w-6" : "h-7 w-7"
      )} />
      
      <Sparkles className="absolute top-2 right-2 w-3 h-3 text-yellow-300 animate-bounce" />
      
      {/* Enhanced notification dot */}
      <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full animate-pulse shadow-lg" />
      
      {/* Glow effect */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-green-400/20 to-yellow-400/20 blur-md group-hover:blur-lg transition-all duration-300" />
    </Button>
  );
};

export default ChatbotButton;

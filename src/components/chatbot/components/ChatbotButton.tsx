
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
        "bg-kic-green-600 hover:bg-kic-green-700 text-white",
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
      
      {/* Notification dot */}
      <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
    </Button>
  );
};

export default ChatbotButton;

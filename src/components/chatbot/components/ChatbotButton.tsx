
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';
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
        "fixed shadow-xl transition-all duration-300 hover:scale-105 z-50",
        "bg-kic-green-600 hover:bg-kic-green-700",
        isMobile 
          ? "bottom-4 right-4 h-12 w-12 rounded-full" 
          : "bottom-6 right-6 h-14 w-14 rounded-full"
      )}
      size="icon"
      aria-label="open chat assistant"
    >
      <MessageCircle className={cn("text-white", isMobile ? "h-5 w-5" : "h-6 w-6")} />
      
      {/* Pulse animation for attention */}
      <div className="absolute inset-0 rounded-full bg-kic-green-600 animate-ping opacity-75" />
    </Button>
  );
};

export default ChatbotButton;

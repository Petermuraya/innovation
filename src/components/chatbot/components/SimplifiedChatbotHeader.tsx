
import { Button } from '@/components/ui/button';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { Bot, X, Minimize2, Maximize2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SimplifiedChatbotHeaderProps {
  user: any;
  userName?: string;
  isMobile: boolean;
  isMinimized: boolean;
  onClose: () => void;
  onToggleMinimize: () => void;
}

const SimplifiedChatbotHeader = ({
  user,
  userName,
  isMobile,
  isMinimized,
  onClose,
  onToggleMinimize
}: SimplifiedChatbotHeaderProps) => {
  return (
    <CardHeader className={cn(
      "flex flex-row items-center justify-between space-y-0 pb-3",
      "bg-kic-green-600 text-white",
      isMobile ? "px-4 py-3 rounded-t-none" : "px-6 py-4 rounded-t-lg"
    )}>
      <div className="flex items-center gap-3">
        <div className={cn(
          "rounded-full bg-white/20 flex items-center justify-center",
          isMobile ? "w-8 h-8" : "w-10 h-10"
        )}>
          <Bot className={cn("text-white", isMobile ? "h-4 w-4" : "h-5 w-5")} />
        </div>
        
        <div>
          <CardTitle className={cn(
            "font-semibold text-white",
            isMobile ? "text-lg" : "text-xl"
          )}>
            KUIC Assistant
          </CardTitle>
          <p className="text-sm text-green-100">
            {user ? `Hello, ${userName || 'there'}!` : "Ready to help"}
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-1">
        {!isMobile && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleMinimize}
            className="h-8 w-8 text-white hover:bg-white/10"
          >
            {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
          </Button>
        )}
        
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="h-8 w-8 text-white hover:bg-white/10"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </CardHeader>
  );
};

export default SimplifiedChatbotHeader;

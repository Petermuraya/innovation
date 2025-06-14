
import { cn } from '@/lib/utils';
import { Bot, User, Loader2, CheckCheck, AlertCircle, ExternalLink } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Message } from '../types';
import EnhancedTypingEffect from './EnhancedTypingEffect';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface SimplifiedMessageBubbleProps {
  message: Message;
  isMobile: boolean;
  showTypingEffect?: boolean;
  onTypingComplete?: () => void;
}

// Function to detect and convert navigation links in text
const renderMessageWithLinks = (content: string) => {
  const linkPattern = /(?:(?:check out|visit|go to|access|view|explore|see)\s+(?:our\s+)?(?:the\s+)?([^\/\s]+)\s+at\s+)?(\/[a-zA-Z0-9\-\/]+)|(?:register|login|sign up|dashboard|home|about|projects|events|blogs|careers|leaderboard|elections)/gi;
  
  const parts = content.split(linkPattern);
  const elements = [];
  
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    
    if (part && part.startsWith('/')) {
      // This is a URL path
      elements.push(
        <Link 
          key={i} 
          to={part} 
          className="inline-flex items-center gap-1 text-kic-green-600 hover:text-kic-green-700 underline font-medium transition-colors"
        >
          {part}
          <ExternalLink className="w-3 h-3" />
        </Link>
      );
    } else if (part && ['register', 'login', 'sign up', 'dashboard', 'home', 'about', 'projects', 'events', 'blogs', 'careers', 'leaderboard', 'elections'].includes(part.toLowerCase())) {
      // This is a page name
      const pagePath = part.toLowerCase() === 'home' ? '/' : `/${part.toLowerCase().replace(' ', '-')}`;
      elements.push(
        <Link 
          key={i} 
          to={pagePath} 
          className="inline-flex items-center gap-1 text-kic-green-600 hover:text-kic-green-700 underline font-medium transition-colors"
        >
          {part}
          <ExternalLink className="w-3 h-3" />
        </Link>
      );
    } else if (part) {
      elements.push(part);
    }
  }
  
  return elements;
};

const SimplifiedMessageBubble = ({ 
  message, 
  isMobile, 
  showTypingEffect = false,
  onTypingComplete 
}: SimplifiedMessageBubbleProps) => {
  const { user } = useAuth();
  const [hasTyped, setHasTyped] = useState(false);

  // Track if this message should show typing effect
  const shouldShowTyping = !message.isUser && showTypingEffect && !hasTyped;

  const handleTypingComplete = () => {
    setHasTyped(true);
    onTypingComplete?.();
  };

  const getUserAvatarUrl = () => {
    return user?.user_metadata?.avatar_url || user?.avatar_url || null;
  };

  const getUserInitials = () => {
    if (user?.user_metadata?.name) {
      return user.user_metadata.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
    }
    return user?.email?.charAt(0).toUpperCase() || 'U';
  };

  if (shouldShowTyping) {
    return (
      <EnhancedTypingEffect
        message={message.content}
        onComplete={handleTypingComplete}
        isMobile={isMobile}
      />
    );
  }

  return (
    <div className={cn(
      "flex items-start gap-3 animate-fade-in",
      message.isUser ? "justify-end" : "justify-start"
    )}>
      {!message.isUser && (
        <div className={cn(
          "rounded-full bg-kic-green-600 flex items-center justify-center flex-shrink-0 shadow-md",
          isMobile ? "w-8 h-8" : "w-10 h-10"
        )}>
          <Bot className={cn("text-white", isMobile ? "w-4 h-4" : "w-5 h-5")} />
        </div>
      )}
      
      <div
        className={cn(
          "rounded-2xl p-4 max-w-[80%] shadow-md transition-all duration-200 hover:shadow-lg",
          message.isUser
            ? "bg-kic-green-600 text-white ml-auto"
            : "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700",
          message.status === 'error' && "border-red-400 bg-red-50 dark:bg-red-900/20"
        )}
      >
        <div className="whitespace-pre-wrap leading-relaxed text-sm">
          {message.isUser ? message.content : renderMessageWithLinks(message.content)}
        </div>
        
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-opacity-20 border-gray-300 dark:border-gray-600">
          {!message.isUser && (
            <span className="text-xs opacity-70 text-kic-green-600 font-medium">kuic assistant</span>
          )}
          
          <div className="flex items-center gap-2">
            <span className="text-xs opacity-70">
              {message.timestamp.toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </span>
            {message.isUser && (
              <>
                {message.status === 'sending' && <Loader2 className="h-3 w-3 animate-spin" />}
                {message.status === 'error' && <AlertCircle className="h-3 w-3 text-red-300" />}
                {message.status === 'delivered' && <CheckCheck className="h-3 w-3 text-green-300" />}
              </>
            )}
          </div>
        </div>
      </div>
      
      {message.isUser && (
        <div className={cn(
          "flex-shrink-0 shadow-md",
          isMobile ? "w-8 h-8" : "w-10 h-10"
        )}>
          {user ? (
            <Avatar className={cn("border-2 border-gray-300", isMobile ? "w-8 h-8" : "w-10 h-10")}>
              <AvatarImage src={getUserAvatarUrl()} />
              <AvatarFallback className="bg-gray-500 text-white text-sm">
                {getUserInitials()}
              </AvatarFallback>
            </Avatar>
          ) : (
            <div className={cn(
              "rounded-full bg-gray-500 flex items-center justify-center",
              isMobile ? "w-8 h-8" : "w-10 h-10"
            )}>
              <User className={cn("text-white", isMobile ? "w-4 h-4" : "w-5 h-5")} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SimplifiedMessageBubble;

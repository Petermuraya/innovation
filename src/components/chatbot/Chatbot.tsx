
import React, { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Send, Bot, User, X, MessageCircle, Sparkles, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm your AI assistant for the Karatina Innovation Club. How can I help you today?",
      isUser: false,
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (message: string) => {
    if (!message.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: message,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Simulate AI response with more contextual replies
      const responses = [
        "I'd be happy to help you with information about our innovation club! What specific area interests you?",
        "That's a great question! The Innovation Club offers various programs in tech, entrepreneurship, and creative problem-solving.",
        "For more detailed information about events and workshops, you can check our Events page or Dashboard.",
        "Our community is always growing! Feel free to explore our Projects section to see what members are working on.",
        "If you're interested in joining, visit our registration page or contact our team for more information."
      ];

      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: responses[Math.floor(Math.random() * responses.length)],
        isUser: false,
        timestamp: new Date(),
      };

      setTimeout(() => {
        setMessages(prev => [...prev, botResponse]);
        setIsLoading(false);
      }, 1500);
    } catch (error) {
      console.error('Error sending message:', error);
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  return (
    <>
      {/* Floating Chat Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: "spring", stiffness: 260, damping: 20 }}
      >
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "h-16 w-16 rounded-full shadow-2xl transition-all duration-300 group relative overflow-hidden",
            "bg-gradient-to-br from-kic-green-500 via-kic-green-600 to-emerald-700",
            "hover:from-kic-green-400 hover:via-kic-green-500 hover:to-emerald-600",
            "hover:scale-110 hover:shadow-kic-green-500/40",
            "border-2 border-white/20"
          )}
          size="icon"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                exit={{ rotate: 90, scale: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X className="h-7 w-7 text-white" />
              </motion.div>
            ) : (
              <motion.div
                key="open"
                initial={{ rotate: 90, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                exit={{ rotate: -90, scale: 0 }}
                transition={{ duration: 0.2 }}
                className="relative"
              >
                <MessageCircle className="h-7 w-7 text-white" />
                <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-yellow-300 animate-pulse" />
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Pulsing ring effect */}
          <div className="absolute inset-0 rounded-full bg-kic-green-400/30 animate-ping" />
          <div className="absolute inset-2 rounded-full bg-gradient-to-br from-kic-green-400/20 to-transparent animate-pulse" />
        </Button>
      </motion.div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, x: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, x: 20, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-24 right-6 z-40 w-96 h-[500px]"
          >
            <Card className="w-full h-full flex flex-col backdrop-blur-xl bg-white/95 border-2 border-kic-green-200/50 shadow-2xl shadow-kic-green-500/20 overflow-hidden">
              {/* Futuristic Header */}
              <CardHeader className="bg-gradient-to-r from-kic-green-500 via-kic-green-600 to-emerald-600 text-white p-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 via-kic-green-300 to-cyan-400" />
                <CardTitle className="flex items-center gap-3 relative z-10">
                  <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                    <Bot className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-bold text-lg">KIC Assistant</div>
                    <div className="text-sm text-kic-green-100 font-normal">
                      Powered by AI • Online
                    </div>
                  </div>
                  <div className="ml-auto flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <Zap className="w-4 h-4 text-yellow-300" />
                  </div>
                </CardTitle>
              </CardHeader>

              {/* Messages Area */}
              <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-br from-gray-50 to-kic-green-50/30">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className={cn(
                      "flex items-end gap-3",
                      message.isUser ? 'justify-end' : 'justify-start'
                    )}
                  >
                    {!message.isUser && (
                      <div className="p-2 bg-gradient-to-br from-kic-green-500 to-kic-green-600 rounded-xl shadow-lg">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                    )}
                    <div
                      className={cn(
                        "max-w-[80%] p-3 rounded-2xl shadow-lg backdrop-blur-sm relative",
                        message.isUser
                          ? "bg-gradient-to-br from-kic-green-500 to-kic-green-600 text-white rounded-br-md"
                          : "bg-white/80 text-gray-800 rounded-bl-md border border-kic-green-100"
                      )}
                    >
                      <div className="relative z-10">{message.content}</div>
                      {!message.isUser && (
                        <div className="absolute inset-0 bg-gradient-to-br from-kic-green-50/50 to-transparent rounded-2xl" />
                      )}
                    </div>
                    {message.isUser && (
                      <div className="p-2 bg-gradient-to-br from-gray-500 to-gray-600 rounded-xl shadow-lg">
                        <User className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </motion.div>
                ))}
                
                {/* Loading Animation */}
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-end gap-3"
                  >
                    <div className="p-2 bg-gradient-to-br from-kic-green-500 to-kic-green-600 rounded-xl shadow-lg">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-white/80 p-4 rounded-2xl rounded-bl-md shadow-lg border border-kic-green-100">
                      <div className="flex space-x-2">
                        <div className="w-2 h-2 bg-kic-green-500 rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-kic-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                        <div className="w-2 h-2 bg-kic-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      </div>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </CardContent>

              {/* Input Area */}
              <div className="p-4 bg-white/90 backdrop-blur-sm border-t border-kic-green-200/50">
                <form onSubmit={handleSubmit} className="flex gap-2">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Type your message..."
                    disabled={isLoading}
                    className="flex-1 border-kic-green-200 focus:border-kic-green-500 focus:ring-kic-green-500/20 rounded-xl bg-white/70 backdrop-blur-sm"
                  />
                  <Button 
                    type="submit" 
                    disabled={isLoading || !inputValue.trim()}
                    className="bg-gradient-to-r from-kic-green-500 to-kic-green-600 hover:from-kic-green-600 hover:to-kic-green-700 rounded-xl px-4 shadow-lg"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </form>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;

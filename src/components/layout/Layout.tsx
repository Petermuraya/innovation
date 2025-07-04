
import { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Chatbot from "@/components/chatbot/Chatbot";
import ScrollToTop from "@/components/ui/scroll-to-top";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/dashboard') || 
                     location.pathname.startsWith('/admin') ||
                     location.pathname.startsWith('/community/');
  
  console.log("Layout component rendering");
  
  // For dashboard pages, don't wrap with the main layout
  if (isDashboard) {
    return <>{children}</>;
  }
  
  return (
    <div className="flex flex-col min-h-screen bg-background w-full">
      <Navbar />
      <main className="flex-grow w-full">
        {children}
      </main>
      <Footer />
      <Chatbot />
      <ScrollToTop />
    </div>
  );
}

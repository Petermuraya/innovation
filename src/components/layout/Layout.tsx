
import { ReactNode } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Chatbot from "@/components/chatbot/Chatbot";
import { usePointTracking } from "@/components/hooks/usePointTracking";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  console.log("Layout component rendering");
  
  // Initialize point tracking for website visits
  usePointTracking();
  
  return (
    <div className="flex flex-col min-h-screen bg-background w-full">
      <Navbar />
      <main className="flex-grow w-full">
        {children}
      </main>
      <Footer />
      <Chatbot />
    </div>
  );
}

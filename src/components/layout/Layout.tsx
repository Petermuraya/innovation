
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Chatbot from "@/components/chatbot/Chatbot";
import { usePointTracking } from "@/components/hooks/usePointTracking";

export default function Layout() {
  console.log("Layout component rendering");
  
  // Initialize point tracking for website visits
  usePointTracking();
  
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
      <Chatbot />
    </div>
  );
}

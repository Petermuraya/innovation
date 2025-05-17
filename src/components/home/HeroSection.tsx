
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import InnovationCube from "./InnovationCube";
import { MoveIn } from "@/components/ui/animations";
import { Box } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-white dark:bg-gray-900">
      {/* Background pattern */}
      <div className="absolute inset-0 pattern-bg opacity-50"></div>
      
      <div className="relative container-custom py-16 md:py-24 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text content */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6 animate-fade-in">
              <Box size={16} className="animate-pulse" />
              <span className="text-sm font-medium">Innovate • Create • Transform</span>
            </div>
            
            <MoveIn>
              <h1 className="font-bold mb-6 leading-tight">
                <span className="block text-foreground dark:text-white">Building the future</span>
                <span className="gradient-text">one innovation at a time</span>
              </h1>
            </MoveIn>
            
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-lg mx-auto lg:mx-0 animate-fade-in delay-100">
              Join Karatina Innovation Club to collaborate on exciting tech projects, 
              learn new skills, and connect with like-minded innovators.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in delay-200">
              <Button size="lg" className="gap-2" asChild>
                <Link to="/register">Join Us</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/projects">View Projects</Link>
              </Button>
              <Button size="lg" variant="secondary" asChild>
                <Link to="/events">See Events</Link>
              </Button>
            </div>
          </div>
          
          {/* 3D Innovation View */}
          <div className="lg:pl-6 animate-fade-in delay-300 h-[350px] md:h-[450px] overflow-hidden rounded-xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/10 shadow-xl">
            <InnovationCube />
          </div>
        </div>
      </div>
    </section>
  );
}

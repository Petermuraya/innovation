
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-white">
      {/* Background pattern */}
      <div className="absolute inset-0 pattern-bg opacity-50"></div>
      
      <div className="relative container-custom py-20 md:py-32 flex flex-col lg:flex-row items-center">
        {/* Text content */}
        <div className="lg:w-1/2 text-center lg:text-left mb-10 lg:mb-0 animate-fade-in">
          <h1 className="font-bold mb-6">
            <span className="block">Innovate. Create.</span>
            <span className="gradient-text">Transform.</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-lg mx-auto lg:mx-0">
            Join Karatina Innovation Club to collaborate on exciting tech projects, 
            learn new skills, and connect with like-minded innovators.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Button size="lg" asChild>
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
        
        {/* Hero image */}
        <div className="lg:w-1/2 lg:pl-12 animate-scale-in">
          <div className="relative">
            <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-primary to-secondary opacity-30 blur"></div>
            <img 
              src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
              alt="Students collaborating on tech projects" 
              className="rounded-lg shadow-xl relative w-full h-auto object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

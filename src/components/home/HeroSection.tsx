
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MoveIn, FadeIn, ScaleIn } from "@/components/ui/animations";
import { Box, ArrowRight, Users, Code, Lightbulb } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export default function HeroSection() {
  const isMobile = useIsMobile();

  return (
    <section className="relative overflow-hidden bg-white dark:bg-gray-900 pb-16 md:pb-24">
      {/* Background overlay with gradient */}
      <div className="absolute inset-0 pattern-bg opacity-50 z-0"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 z-0"></div>
      
      {/* Hero content */}
      <div className="relative container-custom pt-8 md:pt-16 lg:pt-24 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Text content - spans 6 columns on large screens */}
          <div className="lg:col-span-6 text-center lg:text-left z-10">
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
            
            <FadeIn delay={100}>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-xl mx-auto lg:mx-0">
                Join Karatina Innovation Club to collaborate on exciting tech projects,
                learn new skills, and connect with like-minded innovators in our thriving community.
              </p>
            </FadeIn>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in delay-200">
              <Button size="lg" className="gap-2 px-6" asChild>
                <Link to="/register">Join Us <ArrowRight size={16} /></Link>
              </Button>
              <Button size="lg" variant="outline" className="gap-2" asChild>
                <Link to="/projects">View Projects</Link>
              </Button>
              <Button size="lg" variant="secondary" className="gap-2" asChild>
                <Link to="/events">See Events</Link>
              </Button>
            </div>

            {/* Feature highlights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12 animate-fade-in delay-300">
              <ScaleIn delay={400} className="bg-background/50 backdrop-blur-sm p-4 rounded-lg border border-primary/10 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Users size={18} className="text-primary" />
                  </div>
                  <p className="font-medium text-sm text-left">Community-driven</p>
                </div>
              </ScaleIn>
              
              <ScaleIn delay={500} className="bg-background/50 backdrop-blur-sm p-4 rounded-lg border border-primary/10 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Code size={18} className="text-primary" />
                  </div>
                  <p className="font-medium text-sm text-left">Hands-on Projects</p>
                </div>
              </ScaleIn>
              
              <ScaleIn delay={600} className="bg-background/50 backdrop-blur-sm p-4 rounded-lg border border-primary/10 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Lightbulb size={18} className="text-primary" />
                  </div>
                  <p className="font-medium text-sm text-left">Innovative Ideas</p>
                </div>
              </ScaleIn>
            </div>
          </div>
          
          {/* Image carousel - spans 6 columns on large screens */}
          <div className="lg:col-span-6 z-10">
            <ScaleIn delay={200}>
              <div className="relative rounded-xl overflow-hidden border border-primary/10 shadow-2xl">
                <Carousel 
                  opts={{
                    align: "start",
                    loop: true,
                  }}
                  className="w-full"
                >
                  <CarouselContent>
                    <CarouselItem>
                      <div className="relative aspect-[16/9] md:aspect-[16/10] overflow-hidden">
                        <img 
                          src="https://images.unsplash.com/photo-1492551557933-34265f7af79e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80" 
                          alt="Students working together on innovation projects"
                          className="object-cover w-full h-full rounded-lg"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                          <p className="text-white font-medium text-sm md:text-base">Collaborative learning environment</p>
                        </div>
                      </div>
                    </CarouselItem>
                    <CarouselItem>
                      <div className="relative aspect-[16/9] md:aspect-[16/10] overflow-hidden">
                        <img 
                          src="https://images.unsplash.com/photo-1573164713988-8665fc963095?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80" 
                          alt="Tech innovation showcase"
                          className="object-cover w-full h-full rounded-lg"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                          <p className="text-white font-medium text-sm md:text-base">Showcasing innovative projects</p>
                        </div>
                      </div>
                    </CarouselItem>
                    <CarouselItem>
                      <div className="relative aspect-[16/9] md:aspect-[16/10] overflow-hidden">
                        <img 
                          src="https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80" 
                          alt="Coding workshop"
                          className="object-cover w-full h-full rounded-lg"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                          <p className="text-white font-medium text-sm md:text-base">Hands-on coding workshops</p>
                        </div>
                      </div>
                    </CarouselItem>
                  </CarouselContent>
                  <div className="absolute bottom-4 right-4 flex gap-2 z-20">
                    <CarouselPrevious className="relative h-8 w-8 rounded-full bg-black/30 hover:bg-black/50 border-0 text-white inset-auto transform-none left-0 top-0" />
                    <CarouselNext className="relative h-8 w-8 rounded-full bg-black/30 hover:bg-black/50 border-0 text-white inset-auto transform-none right-0 top-0" />
                  </div>
                </Carousel>

                {/* Floating feature cards over the image */}
                {!isMobile && (
                  <>
                    <div className="absolute -left-12 top-1/4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-xl border border-primary/10 animate-float-medium z-20 hidden lg:block">
                      <p className="font-medium text-sm">20+ Active Projects</p>
                    </div>
                    <div className="absolute -right-12 bottom-1/4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-xl border border-primary/10 animate-float-slow z-20 hidden lg:block">
                      <p className="font-medium text-sm">Weekly Workshops</p>
                    </div>
                  </>
                )}
              </div>
            </ScaleIn>
          </div>
        </div>

        {/* Wave separator */}
        <div className="absolute bottom-0 left-0 w-full">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="text-background">
            <path fill="currentColor" fillOpacity="1" d="M0,288L48,272C96,256,192,224,288,208C384,192,480,192,576,197.3C672,203,768,213,864,229.3C960,245,1056,267,1152,266.7C1248,267,1344,245,1392,234.7L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
      </div>
    </section>
  );
}

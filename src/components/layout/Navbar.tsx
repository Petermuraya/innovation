
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const navigationItems = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Projects", href: "/projects" },
  { name: "Events", href: "/events" },
  { name: "Blog", href: "/blog" },
  { name: "Communities", href: "/communities" },
];

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  
  return (
    <nav className="bg-kic-white/80 backdrop-blur-sm border-b border-kic-lightGray sticky top-0 z-50">
      <div className="container-custom flex h-16 items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-primary text-kic-white font-bold text-xl rounded-md h-8 w-8 flex items-center justify-center">
              K
            </div>
            <span className="font-semibold text-xl hidden sm:block text-kic-gray">
              Karatina Innovation Club
            </span>
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex md:items-center md:space-x-1">
          {navigationItems.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "nav-link text-kic-gray hover:text-primary",
                location.pathname === item.href ? "text-primary font-semibold" : ""
              )}
            >
              {item.name}
            </Link>
          ))}
        </div>
        
        {/* Auth Buttons */}
        <div className="hidden md:flex md:items-center md:space-x-2">
          <Button variant="outline" asChild className="border-primary text-primary hover:bg-primary/10">
            <Link to="/login">Login</Link>
          </Button>
          <Button asChild className="bg-primary hover:bg-primary/90">
            <Link to="/register">Join Us</Link>
          </Button>
        </div>
        
        {/* Mobile Navigation */}
        <div className="flex md:hidden items-center space-x-2">
          <Button variant="outline" size="sm" asChild className="border-primary text-primary">
            <Link to="/login">Login</Link>
          </Button>
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="border-primary text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                  <line x1="4" x2="20" y1="12" y2="12" />
                  <line x1="4" x2="20" y1="6" y2="6" />
                  <line x1="4" x2="20" y1="18" y2="18" />
                </svg>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-kic-white">
              <SheetHeader>
                <SheetTitle>
                  <div className="flex items-center space-x-2">
                    <div className="bg-primary text-kic-white font-bold text-xl rounded-md h-8 w-8 flex items-center justify-center">
                      K
                    </div>
                    <span className="font-semibold text-xl text-kic-gray">Innovation Club</span>
                  </div>
                </SheetTitle>
              </SheetHeader>
              <div className="mt-8 flex flex-col space-y-4">
                {navigationItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      "text-kic-gray hover:text-primary transition-colors py-2 text-lg",
                      location.pathname === item.href ? "font-medium text-primary" : ""
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                <Button className="mt-4 bg-primary hover:bg-primary/90" asChild>
                  <Link to="/register">Join Us</Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}

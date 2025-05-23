
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
import { useAuth } from "@/contexts/AuthContext";

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
  const { user, loading, signOut } = useAuth();
  
  return (
    <nav className="bg-kic-white/80 backdrop-blur-sm border-b border-kic-lightGray sticky top-0 z-50">
      <div className="container-custom flex h-16 items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-kic-green-500 text-kic-white font-bold text-xl rounded-md h-8 w-8 flex items-center justify-center">
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
                "nav-link text-kic-gray hover:text-kic-green-500",
                location.pathname === item.href ? "text-kic-green-500 font-semibold" : ""
              )}
            >
              {item.name}
            </Link>
          ))}
        </div>
        
        {/* Auth Buttons */}
        <div className="hidden md:flex md:items-center md:space-x-2">
          {loading ? (
            <div className="w-20 h-9 bg-gray-200 animate-pulse rounded"></div>
          ) : user ? (
            <>
              <Button variant="outline" asChild className="border-kic-green-500 text-kic-green-500 hover:bg-kic-green-50">
                <Link to="/dashboard">Dashboard</Link>
              </Button>
              <Button onClick={signOut} variant="outline" className="border-kic-gray text-kic-gray hover:bg-gray-50">
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" asChild className="border-kic-green-500 text-kic-green-500 hover:bg-kic-green-50">
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild className="bg-kic-green-500 hover:bg-kic-green-600">
                <Link to="/register">Join Us</Link>
              </Button>
            </>
          )}
        </div>
        
        {/* Mobile Navigation */}
        <div className="flex md:hidden items-center space-x-2">
          {!loading && (
            <>
              {user ? (
                <Button variant="outline" size="sm" asChild className="border-kic-green-500 text-kic-green-500">
                  <Link to="/dashboard">Dashboard</Link>
                </Button>
              ) : (
                <Button variant="outline" size="sm" asChild className="border-kic-green-500 text-kic-green-500">
                  <Link to="/login">Login</Link>
                </Button>
              )}
            </>
          )}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="border-kic-green-500 text-kic-green-500">
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
                    <div className="bg-kic-green-500 text-kic-white font-bold text-xl rounded-md h-8 w-8 flex items-center justify-center">
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
                      "text-kic-gray hover:text-kic-green-500 transition-colors py-2 text-lg",
                      location.pathname === item.href ? "font-medium text-kic-green-500" : ""
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                {user ? (
                  <>
                    <Link
                      to="/dashboard"
                      className="text-kic-gray hover:text-kic-green-500 transition-colors py-2 text-lg"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Button onClick={signOut} variant="outline" className="mt-4">
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <Button className="mt-4 bg-kic-green-500 hover:bg-kic-green-600" asChild>
                    <Link to="/register">Join Us</Link>
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}

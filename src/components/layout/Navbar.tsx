
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
import { Menu, X } from "lucide-react";

const navigationItems = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Projects", href: "/projects" },
  { name: "Events", href: "/events" },
  { name: "Careers", href: "/careers" },
  { name: "Leaderboard", href: "/leaderboard" },
];

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, loading, signOut } = useAuth();
  
  return (
    <nav className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="container-custom">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg group-hover:shadow-emerald-200 transition-shadow duration-300">
                <span className="text-white font-bold text-lg">K</span>
              </div>
              <div className="absolute -inset-1 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl opacity-20 group-hover:opacity-30 transition-opacity duration-300 -z-10"></div>
            </div>
            <div className="hidden sm:block">
              <h1 className="font-semibold text-gray-900 text-lg tracking-tight">
                Karatina Innovation Club
              </h1>
              <p className="text-xs text-gray-500 font-medium">Building Tomorrow's Leaders</p>
            </div>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-gray-50",
                  location.pathname === item.href 
                    ? "text-emerald-600 bg-emerald-50" 
                    : "text-gray-700 hover:text-gray-900"
                )}
              >
                {item.name}
                {location.pathname === item.href && (
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-emerald-500 rounded-full"></div>
                )}
              </Link>
            ))}
          </div>
          
          {/* Auth Buttons - Desktop */}
          <div className="hidden lg:flex items-center gap-3">
            {loading ? (
              <div className="flex gap-2">
                <div className="w-20 h-9 bg-gray-100 animate-pulse rounded-lg"></div>
                <div className="w-16 h-9 bg-gray-100 animate-pulse rounded-lg"></div>
              </div>
            ) : user ? (
              <div className="flex items-center gap-3">
                <Button 
                  variant="ghost" 
                  asChild 
                  className="text-gray-700 hover:text-emerald-600 hover:bg-emerald-50"
                >
                  <Link to="/dashboard">Dashboard</Link>
                </Button>
                <Button 
                  onClick={signOut} 
                  variant="outline" 
                  size="sm"
                  className="border-gray-200 text-gray-700 hover:bg-gray-50"
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Button 
                  variant="ghost" 
                  asChild 
                  className="text-gray-700 hover:text-emerald-600 hover:bg-emerald-50"
                >
                  <Link to="/login">Login</Link>
                </Button>
                <Button 
                  asChild 
                  className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg hover:shadow-emerald-200 transition-all duration-200"
                >
                  <Link to="/register">Join Club</Link>
                </Button>
              </div>
            )}
          </div>
          
          {/* Mobile Controls */}
          <div className="flex lg:hidden items-center gap-2">
            {!loading && !user && (
              <Button 
                variant="outline" 
                size="sm" 
                asChild 
                className="border-emerald-200 text-emerald-700 hover:bg-emerald-50"
              >
                <Link to="/login">Login</Link>
              </Button>
            )}
            
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-gray-700 hover:bg-gray-100"
                  aria-label="Open menu"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <SheetHeader className="text-left">
                  <SheetTitle className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                      <span className="text-white font-bold text-sm">K</span>
                    </div>
                    <span className="text-gray-900">Innovation Club</span>
                  </SheetTitle>
                </SheetHeader>
                
                <div className="mt-8 space-y-1">
                  {navigationItems.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={cn(
                        "flex items-center px-3 py-3 rounded-lg text-base font-medium transition-colors",
                        location.pathname === item.href 
                          ? "bg-emerald-50 text-emerald-700 border-l-4 border-emerald-500" 
                          : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                      )}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                  
                  {user && (
                    <>
                      <Link
                        to="/dashboard"
                        className="flex items-center px-3 py-3 rounded-lg text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Dashboard
                      </Link>
                      <div className="pt-4 border-t border-gray-100">
                        <Button 
                          onClick={() => {
                            signOut();
                            setIsMobileMenuOpen(false);
                          }} 
                          variant="outline" 
                          className="w-full"
                        >
                          Sign Out
                        </Button>
                      </div>
                    </>
                  )}
                  
                  {!loading && !user && (
                    <div className="pt-4 border-t border-gray-100">
                      <Button 
                        className="w-full bg-emerald-600 hover:bg-emerald-700" 
                        asChild
                      >
                        <Link to="/register" onClick={() => setIsMobileMenuOpen(false)}>
                          Join Club
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}

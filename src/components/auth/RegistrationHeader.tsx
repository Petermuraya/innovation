import { Link } from "react-router-dom";
import logo from "../../assets/logo.png"; // Ensure the logo path is correct

const RegistrationHeader = () => {
  // Security best practice: Add rel="noopener noreferrer" to external links
  // Consider adding CSP-compliant inline styles if needed

  return (
    <header className="text-center max-w-md mx-auto" role="banner">
      <Link 
        to="/" 
        className="inline-flex items-center justify-center group"
        aria-label="Go to Karatina Innovation Club homepage"
      >
        <img 
          src={logo} 
          alt="Karatina Innovation Club Logo" 
          className="h-16 w-16 group-hover:scale-105 transition-transform duration-300"
          width="64" 
          height="64" // Explicit dimensions for CLS optimization
          loading="lazy" // Lazy loading for better performance
        />
      </Link>
      
      <h1 className="mt-8 text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-green-600">
        Join Karatina Innovation Club
      </h1>
      
      <p className="mt-3 text-lg text-gray-400 font-light">
        Create your secure account to access our innovation ecosystem
      </p>
      
      {/* Security notice with enhanced semantics */}
      <aside 
        className="mt-6 p-4 bg-gradient-to-br from-emerald-900/20 to-green-900/30 border border-emerald-500/30 rounded-xl backdrop-blur-sm"
        aria-label="Account security information"
      >
        <div className="flex items-start">
          <svg 
            className="w-5 h-5 mt-0.5 text-emerald-400 flex-shrink-0" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
            aria-hidden="true" // Decorative icon
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="ml-2 text-sm text-emerald-100">
            <strong className="font-semibold">Secure Verification Process:</strong> All registrations require admin approval for security. 
            You'll receive an encrypted email notification once your account is activated. 
            <span className="block mt-1 text-emerald-300">We never share your data with third parties.</span>
          </p>
        </div>
      </aside>
      
      {/* Loading indicator with aria attributes */}
      <div 
        className="mt-6 flex justify-center space-x-2"
        aria-live="polite" 
        aria-label="Loading indicator"
      >
        <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" style={{ animationDelay: '0ms' }}></div>
        <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" style={{ animationDelay: '300ms' }}></div>
        <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" style={{ animationDelay: '600ms' }}></div>
      </div>

      {/* Security badges - enhances trust signals */}
      <div className="mt-6 flex justify-center items-center space-x-4">
        <span className="text-xs text-emerald-300 flex items-center">
          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          HTTPS Secure
        </span>
        <span className="text-xs text-emerald-300 flex items-center">
          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          GDPR Compliant
        </span>
      </div>
    </header>
  );
};

export default RegistrationHeader;
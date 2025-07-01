
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import PasswordStrengthMeter from "./PasswordStrengthMeter";

interface RegistrationStep1Props {
  onNext: (data: {
    email: string;
    username: string;
    password: string;
  }) => void;
}

const RegistrationStep1 = ({ onNext }: RegistrationStep1Props) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [usernameGenerated, setUsernameGenerated] = useState(false);

  const validateKaratinaEmail = (email: string): boolean => {
    const karatinaEmailPattern = /^[a-zA-Z0-9._%+-]+@(s\.karu\.ac\.ke|karu\.ac\.ke)$/;
    return karatinaEmailPattern.test(email);
  };

  const validatePassword = (password: string): boolean => {
    return password.length >= 8 &&
           /[a-z]/.test(password) &&
           /[A-Z]/.test(password) &&
           /\d/.test(password);
  };

  const generateUsernameFromEmail = (email: string): string => {
    if (!email || !email.includes('@')) return '';
    
    const localPart = email.split('@')[0];
    const parts = localPart.split('.');
    
    // Try different combinations
    const options = [];
    
    if (parts.length >= 2) {
      // For "ndungu.muraya", try "muraya", "ndungu", "ndungumuraya"
      options.push(parts[parts.length - 1]); // Last part: "muraya"
      options.push(parts[0]); // First part: "ndungu"
      options.push(parts.join('')); // Combined: "ndungumuraya"
    } else {
      // Single part, use as is
      options.push(localPart);
    }
    
    return options[0] || 'user';
  };

  const generateUniqueUsername = async (baseUsername: string): Promise<string> => {
    if (!baseUsername) return 'user';
    
    let username = baseUsername.toLowerCase();
    let counter = 0;
    
    while (counter < 100) { // Prevent infinite loops
      try {
        // Simplified query to avoid complex type inference
        const { data, error } = await supabase
          .from('profiles')
          .select('display_name')
          .eq('display_name', username)
          .limit(1);
        
        if (error) {
          console.error('Error checking username:', error);
          return `${baseUsername}${Math.floor(Math.random() * 1000)}`;
        }
        
        // If no data returned, username is available
        if (!data || data.length === 0) {
          return username;
        }
        
        counter++;
        // Generate different number formats
        if (counter <= 9) {
          username = `${baseUsername}${counter}`;
        } else if (counter <= 99) {
          username = `${baseUsername}${counter.toString().padStart(2, '0')}`;
        } else {
          username = `${baseUsername}${counter.toString().padStart(3, '0')}`;
        }
      } catch (error) {
        console.error('Error checking username:', error);
        return `${baseUsername}${Math.floor(Math.random() * 1000)}`;
      }
    }
    
    return `${baseUsername}${Math.floor(Math.random() * 10000)}`;
  };

  // Auto-generate username when email changes
  useEffect(() => {
    const generateUsername = async () => {
      if (email && validateKaratinaEmail(email) && !usernameGenerated) {
        setLoading(true);
        const baseUsername = generateUsernameFromEmail(email);
        const uniqueUsername = await generateUniqueUsername(baseUsername);
        setUsername(uniqueUsername);
        setUsernameGenerated(true);
        setLoading(false);
      }
    };

    if (email && !usernameGenerated) {
      generateUsername();
    }
  }, [email, usernameGenerated]);

  // Reset username generation when email changes
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setUsernameGenerated(false);
    setUsername('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!validateKaratinaEmail(email)) {
      setError("Please use a valid Karatina University email (@s.karu.ac.ke or @karu.ac.ke)");
      setLoading(false);
      return;
    }

    if (!validatePassword(password)) {
      setError("Password must be at least 8 characters with uppercase, lowercase, and number");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (!username) {
      setError("Username is required");
      setLoading(false);
      return;
    }

    setLoading(false);
    onNext({ email, username, password });
  };

  return (
    <>
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-kic-gray">Karatina University Email</Label>
          <Input 
            id="email"
            type="email" 
            placeholder="e.g., john.doe@s.karu.ac.ke" 
            value={email}
            onChange={handleEmailChange}
            required
            className="border-kic-lightGray focus:border-kic-green-500"
          />
          <p className="text-xs text-kic-gray/60">
            Must be a valid Karatina University email (@s.karu.ac.ke or @karu.ac.ke)
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="username" className="text-kic-gray">Username</Label>
          <Input 
            id="username"
            type="text" 
            placeholder="Auto-generated from your email" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="border-kic-lightGray focus:border-kic-green-500"
          />
          <p className="text-xs text-kic-gray/60">
            Auto-generated from your email or customize as needed
          </p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="password" className="text-kic-gray">Password</Label>
          <Input 
            id="password"
            type="password" 
            placeholder="Create a strong password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="border-kic-lightGray focus:border-kic-green-500"
          />
          <PasswordStrengthMeter password={password} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-kic-gray">Confirm Password</Label>
          <Input 
            id="confirmPassword"
            type="password" 
            placeholder="Confirm your password" 
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="border-kic-lightGray focus:border-kic-green-500"
          />
        </div>
        
        <Button 
          type="submit" 
          className="w-full bg-kic-green-500 hover:bg-kic-green-600" 
          disabled={loading || !validatePassword(password) || password !== confirmPassword}
        >
          {loading ? "Processing..." : "Continue to Step 2"}
        </Button>
      </form>
    </>
  );
};

export default RegistrationStep1;

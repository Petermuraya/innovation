
import { useState } from "react";
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

  const checkUsernameAvailability = async (username: string): Promise<boolean> => {
    try {
      // Check if username is already taken by querying the display_name field
      // Since profiles.username doesn't exist, we'll use display_name instead
      const { data, error } = await supabase
        .from('profiles')
        .select('display_name')
        .eq('display_name', username.toLowerCase())
        .single();
      
      if (error && error.code !== 'PGRST116') {
        // PGRST116 is "not found" which means username is available
        console.error('Error checking username:', error);
        return true; // Assume available if there's an error
      }
      
      // If we get data back, username is taken
      return !data;
    } catch (error) {
      console.error('Error checking username availability:', error);
      return true; // Assume available if there's an error
    }
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

    const isUsernameAvailable = await checkUsernameAvailability(username);
    if (!isUsernameAvailable) {
      setError("Username is already taken. Please choose another one.");
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
            onChange={(e) => setEmail(e.target.value)}
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
            placeholder="Choose a unique username" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="border-kic-lightGray focus:border-kic-green-500"
          />
          <p className="text-xs text-kic-gray/60">
            This will be your unique identifier in the club
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
          {loading ? "Validating..." : "Continue to Step 2"}
        </Button>
      </form>
    </>
  );
};

export default RegistrationStep1;

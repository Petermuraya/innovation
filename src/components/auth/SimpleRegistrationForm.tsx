import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import PasswordStrengthMeter from "./PasswordStrengthMeter";

const SimpleRegistrationForm = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
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

    if (!fullName.trim()) {
      setError("Full name is required");
      setLoading(false);
      return;
    }

    try {
      console.log('Starting simplified user registration...');

      // Create the user account with minimal data
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
          data: {
            full_name: fullName.trim(),
            display_name: email.split('@')[0]
          },
        },
      });

      if (authError) {
        console.error('Auth error:', authError);
        throw authError;
      }

      console.log('User created successfully:', authData);

      // Show success message
      toast({
        title: "Registration successful!",
        description: "Please check your Karatina University email to verify your account.",
      });

      // Navigate to login with a success message
      navigate("/login?message=registration-success");

    } catch (err: any) {
      console.error("Registration error:", err);
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-kic-white border-kic-lightGray">
      <CardHeader>
        <CardTitle className="text-kic-gray">Create Your KIC Account</CardTitle>
        <CardDescription className="text-kic-gray/70">
          Join the Karatina Innovation Club
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-kic-gray">Full Name</Label>
            <Input 
              id="fullName"
              type="text" 
              placeholder="Enter your full name" 
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="border-kic-lightGray focus:border-kic-green-500"
            />
          </div>

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
            disabled={loading || !validatePassword(password) || password !== confirmPassword || !fullName.trim()}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </Button>
        </form>
        
        <p className="mt-6 text-center text-sm text-kic-gray">
          Already have an account?{" "}
          <Link to="/login" className="text-kic-green-500 font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </CardContent>
    </Card>
  );
};

export default SimpleRegistrationForm;
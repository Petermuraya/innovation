import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import PasswordStrengthMeter from "./PasswordStrengthMeter";

const RegistrationForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [course, setCourse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

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

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            phone,
            course,
          },
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) throw error;

      toast({
        title: "Registration successful!",
        description: "Please check your email to verify your account.",
      });

      navigate("/login");
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.");
      console.error("Registration error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-kic-white border-kic-lightGray">
      <CardHeader>
        <CardTitle className="text-kic-gray">Join KIC</CardTitle>
        <CardDescription className="text-kic-gray/70">
          Create your account to start your innovation journey
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
            <Label htmlFor="name" className="text-kic-gray">Full Name</Label>
            <Input 
              id="name"
              type="text" 
              placeholder="Enter your full name" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="border-kic-lightGray focus:border-kic-green-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-kic-gray">Email address</Label>
            <Input 
              id="email"
              type="email" 
              placeholder="Enter your email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="border-kic-lightGray focus:border-kic-green-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-kic-gray">Phone Number</Label>
            <Input 
              id="phone"
              type="tel" 
              placeholder="Enter your phone number" 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="border-kic-lightGray focus:border-kic-green-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="course" className="text-kic-gray">Course/Program</Label>
            <Input 
              id="course"
              type="text" 
              placeholder="Enter your course or program" 
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              required
              className="border-kic-lightGray focus:border-kic-green-500"
            />
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

export default RegistrationForm;

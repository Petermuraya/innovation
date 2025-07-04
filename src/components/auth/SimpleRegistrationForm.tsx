
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

const SimpleRegistrationForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Basic validation
    if (!email || !password || !fullName) {
      setError("Please fill in all required fields");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      console.log('Starting registration with email:', email);

      // Simple registration with email redirect
      const { data, error: authError } = await supabase.auth.signUp({
        email: email.toLowerCase().trim(),
        password: password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            full_name: fullName
          }
        }
      });

      console.log('Registration response data:', data);
      console.log('Registration response error:', authError);

      if (authError) {
        console.error('Registration failed:', authError);
        setError(`Registration failed: ${authError.message}`);
        setLoading(false);
        return;
      }

      if (data.user) {
        console.log('Registration successful! User:', data.user);

        // Create profile record after successful registration
        try {
          const { error: profileError } = await supabase
            .from('profiles')
            .insert([
              {
                user_id: data.user.id,
                email: email.toLowerCase().trim(),
                full_name: fullName
              }
            ]);

          if (profileError) {
            console.error('Profile creation failed:', profileError);
            // Don't block registration for profile creation failure
          } else {
            console.log('Profile created successfully');
          }

          // Create user role record
          const { error: roleError } = await supabase
            .from('user_roles')
            .insert([
              {
                user_id: data.user.id,
                role: 'member'
              }
            ]);

          if (roleError) {
            console.error('Role creation failed:', roleError);
            // Don't block registration for role creation failure
          } else {
            console.log('User role created successfully');
          }
        } catch (profileErr) {
          console.error('Profile/role creation error:', profileErr);
          // Continue with registration success even if profile creation fails
        }

        toast({
          title: "Registration Successful! 🎉",
          description: "Please check your email and click the verification link to complete your registration.",
        });

        navigate("/login");
      }

    } catch (err: any) {
      console.error("Unexpected registration error:", err);
      setError(`Unexpected error: ${err.message || "Please try again."}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-white border-gray-200">
      <CardHeader>
        <CardTitle className="text-gray-900">Create Account</CardTitle>
        <CardDescription className="text-gray-600">
          Join the Karatina Innovation Club community
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
            <Label htmlFor="fullName">Full Name *</Label>
            <Input 
              id="fullName"
              name="fullName"
              type="text" 
              placeholder="Enter your full name" 
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input 
              id="email"
              name="email"
              type="email" 
              placeholder="Enter your email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password *</Label>
            <Input 
              id="password"
              name="password"
              type="password" 
              placeholder="Choose a password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <p className="text-xs text-gray-500">
              Must be at least 6 characters
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password *</Label>
            <Input 
              id="confirmPassword"
              name="confirmPassword"
              type="password" 
              placeholder="Confirm your password" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </Button>
        </form>
        
        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </CardContent>
    </Card>
  );
};

export default SimpleRegistrationForm;

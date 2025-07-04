
import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Check for registration success message
    const message = searchParams.get('message');
    if (message === 'registration-success') {
      setSuccessMessage("Registration successful! Please check your email to verify your account before signing in.");
    }

    // Handle email confirmation redirect
    const handleAuthStateChange = () => {
      supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_IN' && session) {
          console.log('User signed in after email confirmation');
          navigate('/dashboard');
        }
      });
    };

    handleAuthStateChange();
  }, [searchParams, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "You have been logged in successfully.",
      });

      // Redirect to dashboard
      navigate("/dashboard");
    } catch (err: any) {
      if (err.message?.includes('Email not confirmed')) {
        setError("Please confirm your email address before signing in. Check your inbox for the confirmation link.");
      } else {
        setError(err.message || "Login failed. Please check your email and password.");
      }
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-kic-lightGray py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link to="/" className="inline-flex items-center justify-center mb-6">
            <img src="/logobanner.png" alt="Karatina Innovation Club" className="h-16 w-auto" />
          </Link>
          <h1 className="mt-6 text-3xl font-bold text-kic-gray">Sign in to your account</h1>
          <p className="mt-2 text-kic-gray/70">
            Access your Karatina Innovation Club member dashboard
          </p>
        </div>
        
        <Card className="bg-kic-white border-kic-lightGray">
          <CardContent className="pt-6">
            {successMessage && (
              <Alert className="mb-6 border-green-200 bg-green-50">
                <AlertDescription className="text-green-800">{successMessage}</AlertDescription>
              </Alert>
            )}
            
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
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
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-kic-gray">Password</Label>
                  <Link to="/forgot-password" className="text-sm text-kic-green-500 hover:underline">
                    Forgot your password?
                  </Link>
                </div>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="Enter your password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="border-kic-lightGray focus:border-kic-green-500"
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-kic-green-500 hover:bg-kic-green-600" 
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign in"}
              </Button>
            </form>
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-4 border-t border-kic-lightGray p-6">
            <p className="text-center text-sm text-kic-gray">
              Don't have an account?{" "}
              <Link to="/register" className="text-kic-green-500 font-medium hover:underline">
                Sign up
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;

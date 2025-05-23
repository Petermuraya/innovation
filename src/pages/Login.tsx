
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
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

      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message || "Login failed. Please check your email and password.");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-kic-lightGray py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link to="/" className="inline-flex items-center justify-center">
            <div className="bg-kic-green-500 text-kic-white font-bold text-xl rounded-md h-10 w-10 flex items-center justify-center">
              K
            </div>
          </Link>
          <h1 className="mt-6 text-3xl font-bold text-kic-gray">Sign in to your account</h1>
          <p className="mt-2 text-kic-gray/70">
            Access your Karatina Innovation Club member dashboard
          </p>
        </div>
        
        <Card className="bg-kic-white border-kic-lightGray">
          <CardContent className="pt-6">
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
              
              <Button type="submit" className="w-full bg-kic-green-500 hover:bg-kic-green-600" disabled={loading}>
                {loading ? "Signing in..." : "Sign in"}
              </Button>
            </form>
          </CardContent>
          
          <CardFooter className="flex justify-center border-t border-kic-lightGray p-6">
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

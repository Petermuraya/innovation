
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const MagicLinkTest = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const { toast } = useToast();

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      console.log('Testing magic link with email:', email);

      const { data, error } = await supabase.auth.signInWithOtp({
        email: email.toLowerCase().trim(),
        options: {
          shouldCreateUser: true,
          emailRedirectTo: `${window.location.origin}/`
        }
      });

      console.log('Magic link response data:', data);
      console.log('Magic link response error:', error);

      if (error) {
        console.error('Magic link failed:', error);
        setMessage(`Magic link failed: ${error.message}`);
      } else {
        console.log('Magic link sent successfully!');
        setMessage('Magic link sent! Check your email.');
        
        // For magic links, user data is not immediately available
        // The user will be authenticated when they click the email link
        // Profile creation should happen in the auth state change handler or after successful authentication
        
        toast({
          title: "Magic Link Sent! 📧",
          description: "Check your email for the sign-in link.",
        });
      }

    } catch (err: any) {
      console.error("Unexpected magic link error:", err);
      setMessage(`Unexpected error: ${err.message || "Please try again."}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-white border-gray-200 mt-6">
      <CardHeader>
        <CardTitle className="text-gray-900">Test Magic Link Authentication</CardTitle>
        <CardDescription className="text-gray-600">
          Quick sign-in without password (creates account if needed)
        </CardDescription>
      </CardHeader>
      <CardContent>
        {message && (
          <Alert className="mb-4">
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}
        
        <form onSubmit={handleMagicLink} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="magic-email">Email</Label>
            <Input 
              id="magic-email"
              type="email" 
              placeholder="Enter your email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={loading}
            variant="outline"
          >
            {loading ? "Sending Magic Link..." : "Send Magic Link"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default MagicLinkTest;

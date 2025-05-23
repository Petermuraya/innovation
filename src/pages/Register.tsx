
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    course: "",
    password: "",
    confirmPassword: "",
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCourseChange = (value: string) => {
    setFormData(prev => ({ ...prev, course: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name,
            phone: formData.phone,
            course: formData.course,
          }
        }
      });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Account created successfully. Please check your email for verification.",
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
    <div className="min-h-screen flex items-center justify-center bg-kic-lightGray py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link to="/" className="inline-flex items-center justify-center">
            <div className="bg-kic-green-500 text-kic-white font-bold text-xl rounded-md h-10 w-10 flex items-center justify-center">
              K
            </div>
          </Link>
          <h1 className="mt-6 text-3xl font-bold text-kic-gray">Join Karatina Innovation Club</h1>
          <p className="mt-2 text-kic-gray/70">
            Create your account to become a member
          </p>
        </div>
        
        <Card className="bg-kic-white">
          <CardContent className="pt-6">
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
                  name="name"
                  type="text" 
                  placeholder="Enter your full name" 
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="border-kic-lightGray focus:border-kic-green-500"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-kic-gray">Email address</Label>
                <Input 
                  id="email"
                  name="email"
                  type="email" 
                  placeholder="Enter your email" 
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="border-kic-lightGray focus:border-kic-green-500"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-kic-gray">Phone Number</Label>
                <Input 
                  id="phone"
                  name="phone"
                  type="tel" 
                  placeholder="Enter your phone number" 
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="border-kic-lightGray focus:border-kic-green-500"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="course" className="text-kic-gray">Course</Label>
                <Select 
                  value={formData.course} 
                  onValueChange={handleCourseChange}
                >
                  <SelectTrigger className="border-kic-lightGray focus:border-kic-green-500">
                    <SelectValue placeholder="Select your course" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="computer_science">Computer Science</SelectItem>
                    <SelectItem value="information_technology">Information Technology</SelectItem>
                    <SelectItem value="software_engineering">Software Engineering</SelectItem>
                    <SelectItem value="business_it">Business Information Technology</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-kic-gray">Password</Label>
                <Input 
                  id="password"
                  name="password"
                  type="password" 
                  placeholder="Create a password" 
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="border-kic-lightGray focus:border-kic-green-500"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-kic-gray">Confirm Password</Label>
                <Input 
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password" 
                  placeholder="Confirm your password" 
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="border-kic-lightGray focus:border-kic-green-500"
                />
              </div>
              
              <Button type="submit" className="w-full bg-kic-green-500 hover:bg-kic-green-600" disabled={loading}>
                {loading ? "Creating account..." : "Create account"}
              </Button>
            </form>
          </CardContent>
          
          <CardFooter className="flex justify-center border-t border-kic-lightGray p-6">
            <p className="text-center text-sm text-kic-gray">
              Already have an account?{" "}
              <Link to="/login" className="text-kic-green-500 font-medium hover:underline">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Register;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const RegistrationForm = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    email: "",
    fullName: "",
    phone: "",
    course: "",
    password: "",
    confirmPassword: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCourseChange = (value: string) => {
    setFormData(prev => ({ ...prev, course: value }));
  };

  const validateKaratinaEmail = (email: string): boolean => {
    const karatinaEmailPattern = /^[a-zA-Z0-9._%+-]+@(s\.karu\.ac\.ke|karu\.ac\.ke)$/;
    return karatinaEmailPattern.test(email);
  };

  const validatePassword = (password: string): boolean => {
    return password.length >= 6;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!validateKaratinaEmail(formData.email)) {
      setError("Please use a valid Karatina University email (@s.karu.ac.ke or @karu.ac.ke)");
      setLoading(false);
      return;
    }

    if (!validatePassword(formData.password)) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (!formData.fullName.trim()) {
      setError("Full name is required");
      setLoading(false);
      return;
    }

    if (!formData.phone.trim()) {
      setError("Phone number is required");
      setLoading(false);
      return;
    }

    if (!formData.course) {
      setError("Please select your course");
      setLoading(false);
      return;
    }

    try {
      console.log('Starting user registration...');

      // Create the user account with email verification and complete profile data
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email.toLowerCase().trim(),
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/login`,
          data: {
            full_name: formData.fullName.trim(),
            phone: formData.phone.trim(),
            course: formData.course,
            department: "School of Computing and Information Technology", // Default for KU
          },
        },
      });

      if (authError) {
        console.error('Auth error:', authError);
        throw authError;
      }

      console.log('User created successfully:', authData);

      // Show success message with email verification info
      toast({
        title: "Registration successful!",
        description: "Please check your email and click the verification link to activate your account. Your registration will be pending admin approval after email verification.",
      });

      // Navigate to login
      navigate("/login");

    } catch (err: any) {
      console.error("Registration error:", err);
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-white border-gray-200">
      <CardHeader>
        <CardTitle className="text-gray-900">Join Karatina Innovation Club</CardTitle>
        <CardDescription className="text-gray-600">
          Create your account to get started
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
            <Label htmlFor="fullName">Full Name</Label>
            <Input 
              id="fullName"
              name="fullName"
              type="text" 
              placeholder="Enter your full name" 
              value={formData.fullName}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Karatina University Email</Label>
            <Input 
              id="email"
              name="email"
              type="email" 
              placeholder="your.name@s.karu.ac.ke" 
              value={formData.email}
              onChange={handleInputChange}
              required
            />
            <p className="text-xs text-gray-500">
              Must be a valid Karatina University email
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input 
              id="phone"
              name="phone"
              type="tel" 
              placeholder="Enter your phone number" 
              value={formData.phone}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="course">Course</Label>
            <Select value={formData.course} onValueChange={handleCourseChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select your course" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="computer_science">Computer Science</SelectItem>
                <SelectItem value="information_technology">Information Technology</SelectItem>
                <SelectItem value="software_engineering">Software Engineering</SelectItem>
                <SelectItem value="business_it">Business Information Technology</SelectItem>
                <SelectItem value="data_science">Data Science</SelectItem>
                <SelectItem value="cybersecurity">Cybersecurity</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input 
              id="password"
              name="password"
              type="password" 
              placeholder="Choose a strong password" 
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input 
              id="confirmPassword"
              name="confirmPassword"
              type="password" 
              placeholder="Confirm your password" 
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={loading || !validatePassword(formData.password) || formData.password !== formData.confirmPassword || !formData.fullName.trim() || !formData.phone.trim() || !formData.course}
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

export default RegistrationForm;
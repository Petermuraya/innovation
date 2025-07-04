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
import { validateRegistrationForm, type RegistrationFormData } from "./RegistrationFormValidation";

const RegistrationForm = () => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState<RegistrationFormData>({
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
    // Clear errors when user starts typing
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  const handleCourseChange = (value: string) => {
    setFormData(prev => ({ ...prev, course: value }));
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors([]);

    // Validate form
    const validation = validateRegistrationForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      setLoading(false);
      return;
    }

    try {
      console.log('Starting user registration with cleaned data:', {
        email: formData.email.toLowerCase().trim(),
        fullName: formData.fullName.trim(),
        phone: formData.phone.trim(),
        course: formData.course
      });

      // Create user with email verification enabled
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email.toLowerCase().trim(),
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/login`,
          data: {
            // Send clean, consistent data to the database
            full_name: formData.fullName.trim(),
            phone: formData.phone.trim(),
            course: formData.course,
            department: "School of Computing and Information Technology",
          },
        },
      });

      if (authError) {
        console.error('Registration error:', authError);
        
        // Handle specific error types
        if (authError.message.includes('User already registered')) {
          setErrors(['An account with this email already exists. Please try logging in instead.']);
        } else if (authError.message.includes('Email rate limit exceeded')) {
          setErrors(['Too many registration attempts. Please wait a few minutes before trying again.']);
        } else if (authError.message.includes('Invalid email')) {
          setErrors(['Please enter a valid email address.']);
        } else {
          setErrors([`Registration failed: ${authError.message}`]);
        }
        
        setLoading(false);
        return;
      }

      console.log('Registration successful:', authData);

      // Show success message
      toast({
        title: "Registration Successful! 🎉",
        description: "Please check your email and click the verification link. After verification, an admin will review your account (this can take up to 12 hours). You can update your profile while waiting for approval.",
      });

      // Navigate to login page
      navigate("/login");

    } catch (err: any) {
      console.error("Unexpected registration error:", err);
      setErrors([err.message || "An unexpected error occurred. Please try again."]);
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = formData.email && formData.fullName && formData.phone && formData.course && formData.password && formData.confirmPassword;

  return (
    <Card className="bg-white border-gray-200">
      <CardHeader>
        <CardTitle className="text-gray-900">Join Karatina Innovation Club</CardTitle>
        <CardDescription className="text-gray-600">
          Create your account to get started
        </CardDescription>
      </CardHeader>
      <CardContent>
        {errors.length > 0 && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>
              <ul className="list-disc list-inside space-y-1">
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </AlertDescription>
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
              placeholder="0712345678 or +254712345678" 
              value={formData.phone}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="course">Course</Label>
            <Select value={formData.course} onValueChange={handleCourseChange}>
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Select your course" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
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
            <p className="text-xs text-gray-500">
              Must be at least 6 characters with uppercase and lowercase letters
            </p>
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
            disabled={loading || !isFormValid}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </Button>
        </form>
        
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="font-medium text-blue-900 mb-2">Registration Process:</h4>
          <ol className="text-sm text-blue-800 space-y-1">
            <li>1. Create your account</li>
            <li>2. Check email for verification link</li>
            <li>3. Wait for admin approval (up to 12 hours)</li>
            <li>4. You can update your profile while waiting</li>
          </ol>
        </div>
        
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

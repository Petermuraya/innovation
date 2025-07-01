
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import PasswordStrengthMeter from "./PasswordStrengthMeter";

const RegistrationForm = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  // Step 1: Basic signup data
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Step 2: Additional details
  const [fullName, setFullName] = useState("");
  const [department, setDepartment] = useState("");
  const [course, setCourse] = useState("");
  const [year, setYear] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedCommunities, setSelectedCommunities] = useState<string[]>([]);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

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
      const { data, error } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', username.toLowerCase());
      
      if (error) throw error;
      return data.length === 0;
    } catch (error) {
      console.error('Error checking username:', error);
      return false;
    }
  };

  const handleStep1Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validate Karatina email
    if (!validateKaratinaEmail(email)) {
      setError("Please use a valid Karatina University email (@s.karu.ac.ke or @karu.ac.ke)");
      setLoading(false);
      return;
    }

    // Validate password
    if (!validatePassword(password)) {
      setError("Password must be at least 8 characters with uppercase, lowercase, and number");
      setLoading(false);
      return;
    }

    // Check password confirmation
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    // Check username availability
    const isUsernameAvailable = await checkUsernameAvailability(username);
    if (!isUsernameAvailable) {
      setError("Username is already taken. Please choose another one.");
      setLoading(false);
      return;
    }

    setLoading(false);
    setStep(2);
  };

  const handleStep2Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!acceptedTerms) {
      setError("Please accept the terms and conditions to continue");
      setLoading(false);
      return;
    }

    if (selectedCommunities.length === 0) {
      setError("Please select at least one community to participate in");
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username.toLowerCase(),
            full_name: fullName,
            phone,
            department,
            course,
            year,
            communities: selectedCommunities,
          },
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) throw error;

      toast({
        title: "Registration successful!",
        description: "Please check your Karatina University email to verify your account.",
      });

      navigate("/login");
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.");
      console.error("Registration error:", err);
    } finally {
      setLoading(false);
    }
  };

  const communities = [
    { id: "web-dev", name: "Web Development" },
    { id: "mobile-dev", name: "Mobile Development" },
    { id: "data-science", name: "Data Science & AI" },
    { id: "cybersecurity", name: "Cybersecurity" },
    { id: "iot", name: "Internet of Things (IoT)" },
    { id: "blockchain", name: "Blockchain & Crypto" },
    { id: "game-dev", name: "Game Development" },
    { id: "ui-ux", name: "UI/UX Design" },
  ];

  const handleCommunityToggle = (communityId: string) => {
    setSelectedCommunities(prev => {
      if (prev.includes(communityId)) {
        return prev.filter(id => id !== communityId);
      } else if (prev.length < 3) {
        return [...prev, communityId];
      } else {
        setError("You can select a maximum of 3 communities");
        return prev;
      }
    });
  };

  const handleTermsChange = (checked: boolean | "indeterminate") => {
    setAcceptedTerms(checked === true);
  };

  if (step === 1) {
    return (
      <Card className="bg-kic-white border-kic-lightGray">
        <CardHeader>
          <CardTitle className="text-kic-gray">Create Your KIC Account</CardTitle>
          <CardDescription className="text-kic-gray/70">
            Step 1 of 2: Basic Account Information
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <form onSubmit={handleStep1Submit} className="space-y-4">
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
          
          <p className="mt-6 text-center text-sm text-kic-gray">
            Already have an account?{" "}
            <Link to="/login" className="text-kic-green-500 font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-kic-white border-kic-lightGray">
      <CardHeader>
        <CardTitle className="text-kic-gray">Complete Your Profile</CardTitle>
        <CardDescription className="text-kic-gray/70">
          Step 2 of 2: Additional Information
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <form onSubmit={handleStep2Submit} className="space-y-4">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="department" className="text-kic-gray">Department</Label>
              <Select value={department} onValueChange={setDepartment}>
                <SelectTrigger className="border-kic-lightGray focus:border-kic-green-500">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="computing">Computing & Information Technology</SelectItem>
                  <SelectItem value="engineering">Engineering</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="agriculture">Agriculture</SelectItem>
                  <SelectItem value="health">Health Sciences</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="year" className="text-kic-gray">Year of Study</Label>
              <Select value={year} onValueChange={setYear}>
                <SelectTrigger className="border-kic-lightGray focus:border-kic-green-500">
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Year 1</SelectItem>
                  <SelectItem value="2">Year 2</SelectItem>
                  <SelectItem value="3">Year 3</SelectItem>
                  <SelectItem value="4">Year 4</SelectItem>
                  <SelectItem value="graduate">Graduate</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="course" className="text-kic-gray">Course/Program</Label>
            <Input 
              id="course"
              type="text" 
              placeholder="e.g., Computer Science, Information Technology" 
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              required
              className="border-kic-lightGray focus:border-kic-green-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-kic-gray">Phone Number</Label>
            <Input 
              id="phone"
              type="tel" 
              placeholder="e.g., +254700000000" 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="border-kic-lightGray focus:border-kic-green-500"
            />
          </div>

          <div className="space-y-3">
            <Label className="text-kic-gray">
              Communities to Participate (Choose up to 3)
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {communities.map((community) => (
                <div key={community.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={community.id}
                    checked={selectedCommunities.includes(community.id)}
                    onCheckedChange={() => handleCommunityToggle(community.id)}
                    disabled={!selectedCommunities.includes(community.id) && selectedCommunities.length >= 3}
                  />
                  <Label 
                    htmlFor={community.id} 
                    className="text-sm text-kic-gray cursor-pointer"
                  >
                    {community.name}
                  </Label>
                </div>
              ))}
            </div>
            <p className="text-xs text-kic-gray/60">
              Selected: {selectedCommunities.length}/3 communities
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="terms"
              checked={acceptedTerms}
              onCheckedChange={handleTermsChange}
            />
            <Label htmlFor="terms" className="text-sm text-kic-gray cursor-pointer">
              I accept the{" "}
              <Link to="/terms" className="text-kic-green-500 hover:underline">
                Terms and Conditions
              </Link>{" "}
              and{" "}
              <Link to="/privacy" className="text-kic-green-500 hover:underline">
                Privacy Policy
              </Link>
            </Label>
          </div>
          
          <div className="flex gap-3">
            <Button 
              type="button"
              variant="outline"
              onClick={() => setStep(1)}
              className="flex-1"
            >
              Back
            </Button>
            <Button 
              type="submit" 
              className="flex-1 bg-kic-green-500 hover:bg-kic-green-600" 
              disabled={loading || !acceptedTerms || selectedCommunities.length === 0}
            >
              {loading ? "Creating Account..." : "Create Account"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default RegistrationForm;


import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import RegistrationStep1 from "./RegistrationStep1";
import RegistrationStep2 from "./RegistrationStep2";

const RegistrationForm = () => {
  const [step, setStep] = useState(1);
  const [basicData, setBasicData] = useState({
    email: "",
    username: "",
    password: ""
  });

  const handleStep1Complete = (data: { email: string; username: string; password: string }) => {
    setBasicData(data);
    setStep(2);
  };

  const handleBackToStep1 = () => {
    setStep(1);
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
          <RegistrationStep1 onNext={handleStep1Complete} />
          
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
        <RegistrationStep2 basicData={basicData} onBack={handleBackToStep1} />
      </CardContent>
    </Card>
  );
};

export default RegistrationForm;

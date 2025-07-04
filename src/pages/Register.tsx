
import RegistrationHeader from "@/components/auth/RegistrationHeader";
import SimpleRegistrationForm from "@/components/auth/SimpleRegistrationForm";
import MagicLinkTest from "@/components/auth/MagicLinkTest";

const Register = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-kic-lightGray py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <RegistrationHeader />
        <SimpleRegistrationForm />
        <MagicLinkTest />
      </div>
    </div>
  );
};

export default Register;

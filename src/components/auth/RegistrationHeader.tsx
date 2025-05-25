
import { Link } from "react-router-dom";

const RegistrationHeader = () => {
  return (
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
      <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          <span className="font-medium">Security Notice:</span> All registrations require admin approval. 
          You'll receive an email notification once your account is reviewed.
        </p>
      </div>
    </div>
  );
};

export default RegistrationHeader;

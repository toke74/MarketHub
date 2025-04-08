//Package imports
import { toast } from "sonner";
import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";

//React icons
import { FaGoogle } from "react-icons/fa";

//Local Imports
import { app } from "../../firebase";
import { useSocialAuthMutation } from "../../services/authApi/authApi";

const GoogleLogin = () => {
  const [socialAuth] = useSocialAuthMutation();
  const navigate = useNavigate();
  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);

      const result = await signInWithPopup(auth, provider);
      const data = {
        name: result.user.displayName,
        email: result.user.email,
        avatar: result.user.photoURL,
        provider: "Google",
      };
      const response = await socialAuth(data).unwrap();

      navigate("/");
      window.location.reload(true);
    } catch (err) {
      console.log(err);
      toast.error(err?.data?.message);
    }
  };
  return (
    <button
      type="button"
      onClick={handleGoogleClick}
      className="flex items-center justify-center cursor-pointer w-full gap-2 bg-red-600 text-white 
        px-4 py-2 rounded-lg hover:bg-red-700 transition"
    >
      <FaGoogle /> Google
    </button>
  );
};

export default GoogleLogin;

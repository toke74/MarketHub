//Package imports
import { getAuth, GithubAuthProvider, signInWithPopup } from "firebase/auth";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

//React icons
import { FaGithub } from "react-icons/fa";

//Local Imports
import { app } from "../../firebase";
import { useSocialAuthMutation } from "../../services/authApi/authApi";

const GitHubLogin = () => {
  const [socialAuth] = useSocialAuthMutation();
  const navigate = useNavigate();

  const handleGitHubLogin = async () => {
    try {
      const githubProvider = new GithubAuthProvider();
      const auth = getAuth(app);

      const result = await signInWithPopup(auth, githubProvider);

      const data = {
        name: result.user.displayName,
        email: result.user.email,
        avatar: result.user.photoURL,
        provider: "GitHub",
      };

      const response = await socialAuth(data).unwrap();
      console.log(response);

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
      onClick={handleGitHubLogin}
      className="flex items-center justify-center cursor-pointer w-full gap-2 bg-gray-800 text-white 
      px-4 py-2 rounded-lg hover:bg-gray-900 transition"
    >
      <FaGithub /> GitHub
    </button>
  );
};

export default GitHubLogin;

// Package imports
import { useRef, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useSelector } from "react-redux";

// Local Imports
import { useActivateSellerMutation } from "../../../services/sellerApi/sellerApi";

const VerifySellerEmail = () => {
  const [error, setError] = useState(false);
  const [isAlreadyVerified, setIsAlreadyVerified] = useState(false);
  const { token } = useParams();
  const [activateSeller] = useActivateSellerMutation();
  const navigate = useNavigate();
  const hasRun = useRef(false); // Track if function has already run

  useEffect(() => {
    if (!hasRun.current && token) {
      hasRun.current = true; // Mark as executed

      const sendRequest = async () => {
        try {
          const response = await activateSeller(token).unwrap();

          if (response?.success) {
            toast.success("Email verified successfully");
            setTimeout(() => navigate("/seller_login"), 5000);
          } else {
            setError(true);
            toast.error(response?.message || "Your token is expired!");
            setTimeout(() => navigate("/resend_seller_token"), 5000);
          }
        } catch (err) {
          setError(true);
          if (err?.data?.message === "Email is already verified") {
            toast.error(err?.data?.message || "Email is already verified!");
            setIsAlreadyVerified(true);

            setTimeout(() => navigate("/seller_login"), 5000);
          } else {
            toast.error(err?.data?.message || "Your token is expired!");
            setTimeout(() => navigate("/resend_seller_token"), 5000);
          }
        }
      };

      sendRequest();
    }
  }, [token]);

  return (
    <div className="flex items-center justify-center h-screen">
      {error ? (
        isAlreadyVerified ? (
          <p>Email is already verified!</p>
        ) : (
          <p>Your token is expired!</p>
        )
      ) : (
        <p>Your account has been Verified successfully!</p>
      )}
    </div>
  );
};

export default VerifySellerEmail;

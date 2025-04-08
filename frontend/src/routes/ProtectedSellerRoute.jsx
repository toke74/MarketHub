import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedSellerRoute = () => {
  const { isSellerAuthenticated } = useSelector((state) => state.seller);
  return isSellerAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to="/seller_login" replace />
  );
};

export default ProtectedSellerRoute;

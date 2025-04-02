//Package imports
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Routes, Route, Navigate } from "react-router-dom";

// Header and footer imports
import Header from "./components/layout/header/Header";
import Footer from "./components/layout/footer/Footer";

//Local import
import {
  useLoadUserQuery,
  useUpdateAccessTokenQuery,
} from "./services/authApi/authApi";
import {
  loadUserRequest,
  loadUserSuccess,
  loadUserFailure,
} from "./features/auth/authSlice";

//Navbar Pages imports
import Home from "./pages/navbarPages/Home";
import Products from "./pages/navbarPages/Products";
import Shops from "./pages/navbarPages/Shops";
import TodaysDeals from "./pages/navbarPages/TodaysDeals";
import BestSellers from "./pages/navbarPages/BestSellers";
import HotOffers from "./pages/navbarPages/HotOffers";
import Blog from "./pages/navbarPages/Blog";
import CustomerService from "./pages/navbarPages/CustomerService";

// Seller imports
import RegisterSeller from "./pages/seller/RegisterSeller";
import SellerLogin from "./pages/seller/SellerLogin";
import VerifySellerEmail from "./pages/seller/VerifySellerEmail";
import ResendSellerToken from "./pages/seller/ResendSellerToken";

//authPages imports
import SignIn from "./pages/authPages/SignIn";
import SignUp from "./pages/authPages/SignUp";
import EmailVerification from "./pages/authPages/EmailVerification";
import ResendActivation from "./pages/authPages/ResendActivation";
import ForgotPassword from "./pages/authPages/ForgotPassword";
import ResetPassword from "./pages/authPages/ResetPassword";

//Protected Route imports
import ProtectedRoute from "./routes/ProtectedRoute";
import Dashboard from "./pages/UserProfilePages/Dashboard";
import UserProfile from "./pages/UserProfilePages/UserProfile";
import Orders from "./pages/UserProfilePages/Orders";
import PaymentMethods from "./pages/UserProfilePages/PaymentMethods";
import AccountSettings from "./pages/UserProfilePages/AccountSettings";
import Address from "./pages/UserProfilePages/address/Address";
import Wishlist from "./pages/UserProfilePages/Wishlist";
import ReviewsRatings from "./pages/UserProfilePages/ReviewsRatings";
import Memberships from "./pages/UserProfilePages/Memberships";

function App() {
  const dispatch = useDispatch();
  const { data, error, refetch } = useLoadUserQuery();
  const {
    data: tokenData,
    refetch: refreshAccessToken,
    isFetching,
  } = useUpdateAccessTokenQuery();

  // Load user on app mount
  useEffect(() => {
    dispatch(loadUserRequest());
    if (data) {
      dispatch(loadUserSuccess(data));
    }
    if (error) {
      dispatch(loadUserFailure(error.message));
      if (error.status === 401) {
        refreshAccessToken(); // Attempt to refresh the token if unauthorized
      }
    }
  }, [data, error, dispatch, refreshAccessToken]);

  // Auto-refresh token every 10 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isFetching) {
        refreshAccessToken();
      }
    }, 10 * 60 * 1000); // 10 minutes

    return () => clearInterval(interval);
  }, [refreshAccessToken, isFetching]);

  // Reload user data when a new token is received
  useEffect(() => {
    if (tokenData) {
      refetch(); // Reload user after token update
    }
  }, [tokenData, refetch]);
  return (
    <div>
      <Header />

      <Routes>
        {/* Navbar Links */}
        <Route path="/" element={<Home />} />
        <Route path="/shops" element={<Shops />} />
        <Route path="/todays_deals" element={<TodaysDeals />} />
        <Route path="/best_sellers" element={<BestSellers />} />
        <Route path="/hot_offers" element={<HotOffers />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/products" element={<Products />} />
        <Route path="/customer_service" element={<CustomerService />} />

        {/* auth Links */}
        <Route path="/sign_in" element={<SignIn />} />
        <Route path="/sign_up" element={<SignUp />} />
        <Route path="/verify_email" element={<EmailVerification />} />
        <Route path="/resend_activation" element={<ResendActivation />} />
        <Route path="/forgot_password" element={<ForgotPassword />} />
        <Route path="/reset_password/:resetToken" element={<ResetPassword />} />

        {/* Seller Routes */}
        <Route path="/become_a_seller" element={<RegisterSeller />} />
        <Route path="/seller_login" element={<SellerLogin />} />
        <Route
          path="/verify_seller_email/:token"
          element={<VerifySellerEmail />}
        />
        <Route path="/resend_seller_token" element={<ResendSellerToken />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/payments" element={<PaymentMethods />} />
          <Route path="/settings" element={<AccountSettings />} />
          <Route path="/address" element={<Address />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/reviews" element={<ReviewsRatings />} />
          <Route path="/memberships" element={<Memberships />} />
        </Route>

        {/* Redirect unknown routes to login */}
        <Route path="*" element={<Navigate to="/sign_in" replace />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;

//Package imports
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Routes, Route, Navigate } from "react-router-dom";

// Header and footer imports
import Header from "./components/layout/header/Header";
import Footer from "./components/layout/footer/Footer";

//Local import for user
import {
  useLoadUserQuery,
  useUpdateAccessTokenQuery,
} from "./services/authApi/authApi";
import {
  loadUserRequest,
  loadUserSuccess,
  loadUserFailure,
} from "./features/auth/authSlice";

//Local Imports for seller
import {
  useLoadSellerQuery,
  useUpdateSellerAccessTokenQuery,
} from "./services/sellerApi/sellerApi"; // Import the seller query
import {
  loadSellerRequest,
  loadSellerSuccess,
  loadSellerFailure,
} from "./features/seller/sellerSlice"; // Import seller actions

//Navbar Pages imports
import Home from "./pages/navbarPages/Home";
import Products from "./pages/products/Products";
import Shops from "./pages/navbarPages/Shops";
import TodaysDeals from "./pages/navbarPages/TodaysDeals";
import BestSellers from "./pages/navbarPages/BestSellers";
import HotOffers from "./pages/navbarPages/HotOffers";
import Blog from "./pages/navbarPages/Blog";
import CustomerService from "./pages/navbarPages/CustomerService";

// Seller imports
import RegisterSeller from "./pages/seller/auth/RegisterSeller";
import SellerLogin from "./pages/seller/auth/SellerLogin";
import VerifySellerEmail from "./pages/seller/auth/VerifySellerEmail";
import ResendSellerToken from "./pages/seller/auth/ResendSellerToken";
import SellerDashboard from "./pages/seller/dashboard/SellerDashboard";
import SellerForgotPassword from "./pages/seller/auth/SellerForgotPassword";
import ProtectedSellerRoute from "./routes/ProtectedSellerRoute";
import CustomerMessages from "./pages/seller/customer/CustomerMessages";
import CustomerReviews from "./pages/seller/customer/CustomerReviews";
import SellerProfile from "./pages/seller/profile/SellerProfile";

//Orders Route
import OrderManagement from "./pages/orders/OrderManagement";

//authPages imports
import SignIn from "./pages/user/auth/SignIn";
import SignUp from "./pages/user/auth/SignUp";
import EmailVerification from "./pages/user/auth/EmailVerification";
import ResendActivation from "./pages/user/auth/ResendActivation";
import ForgotPassword from "./pages/user/auth/ForgotPassword";
import ResetPassword from "./pages/user/auth/ResetPassword";

//Protected Route imports
import ProtectedRoute from "./routes/ProtectedRoute";
import Dashboard from "./pages/user/dashboard/Dashboard";
import UserProfile from "./pages/user/UserProfile/UserProfile";
import Orders from "./pages/user/UserProfile/Orders";
import PaymentMethods from "./pages/user/UserProfile/PaymentMethods";
import AccountSettings from "./pages/user/UserProfile/AccountSettings";
import Address from "./pages/user/UserProfile/address/Address";
import Wishlist from "./pages/user/wishlist/Wishlist";
import ReviewsRatings from "./pages/user/UserProfile/ReviewsRatings";
import Memberships from "./pages/user/UserProfile/Memberships";

//Page not found
import NotFound from "./pages/NotFound";

function App() {
  const dispatch = useDispatch();

  // Load User
  const {
    data: userData,
    error: userError,
    refetch: refetchUser,
  } = useLoadUserQuery();
  const {
    data: userTokenData,
    refetch: refreshUserAccessToken,
    isFetching: isUserFetching,
  } = useUpdateAccessTokenQuery();

  // Load Seller
  const {
    data: sellerData,
    error: sellerError,
    refetch: refetchSeller,
  } = useLoadSellerQuery();
  const {
    data: sellerTokenData,
    refetch: refreshSellerAccessToken,
    isFetching: isSellerFetching,
  } = useUpdateSellerAccessTokenQuery();

  // Load user on app mount
  useEffect(() => {
    dispatch(loadUserRequest());
    if (userData) {
      dispatch(loadUserSuccess(userData));
    }
    if (userError) {
      dispatch(loadUserFailure(userError.message));
      if (userError.status === 401) {
        refreshUserAccessToken(); // Refresh token if unauthorized
      }
    }
  }, [userData, userError, dispatch, refreshUserAccessToken]);

  // Load seller on app mount
  useEffect(() => {
    dispatch(loadSellerRequest());
    if (sellerData) {
      dispatch(loadSellerSuccess(sellerData));
    }
    if (sellerError) {
      dispatch(loadSellerFailure(sellerError.message));
      if (sellerError.status === 401) {
        refreshSellerAccessToken(); // Refresh seller token if unauthorized
      }
    }
  }, [sellerData, sellerError, dispatch, refreshSellerAccessToken]);

  // Auto-refresh tokens every 10 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isUserFetching) {
        refreshUserAccessToken();
      }
      if (!isSellerFetching) {
        refreshSellerAccessToken();
      }
    }, 10 * 60 * 1000); // 10 minutes

    return () => clearInterval(interval);
  }, [
    refreshUserAccessToken,
    refreshSellerAccessToken,
    isUserFetching,
    isSellerFetching,
  ]);

  // Reload user data when a new token is received
  useEffect(() => {
    if (userTokenData) {
      refetchUser();
    }
  }, [userTokenData, refetchUser]);

  // Reload seller data when a new token is received
  useEffect(() => {
    if (sellerTokenData) {
      refetchSeller();
    }
  }, [sellerTokenData, refetchSeller]);

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
        <Route
          path="/seller/forgot_password"
          element={<SellerForgotPassword />}
        />
        {/* Seller Protected Routes */}
        <Route element={<ProtectedSellerRoute />}>
          <Route path="/seller/dashboard" element={<SellerDashboard />} />
          <Route path="/order_management" element={<OrderManagement />} />
          <Route path="/customer_messages" element={<CustomerMessages />} />
          <Route path="/customer_reviews" element={<CustomerReviews />} />
          <Route path="/seller/profile" element={<SellerProfile />} />
        </Route>

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
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;

//Package Imports
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

//React Icons
import {
  FiHome,
  FiPackage,
  FiShoppingBag,
  FiDollarSign,
  FiMessageSquare,
  FiPercent,
  FiPieChart,
  FiHelpCircle,
  FiBell,
  FiMenu,
  FiX,
} from "react-icons/fi";
import { MdOutlineReviews } from "react-icons/md";
import { FaSignOutAlt, FaStore } from "react-icons/fa";
import { FaUser } from "react-icons/fa6";
import { BiMoneyWithdraw } from "react-icons/bi";
import { HiOutlineReceiptRefund } from "react-icons/hi2";
import { RiCoupon3Line } from "react-icons/ri";

//Local import
import { useLogoutSellerMutation } from "../../../services/sellerApi/sellerApi";
import { logout } from "../../../features/seller/sellerSlice";
import DashboardOverview from "./DashboardOverview";
import ProductManagement from "../../products/ProductManagement";
import OrderManagement from "../../orders/OrderManagement";
import SalesEarnings from "../../sales/SalesEarnings";
import CustomerMessages from "../customer/CustomerMessages";
import CustomerReviews from "../customer/CustomerReviews";
import StoreSettings from "./StoreSettings";
import SellerProfile from "../profile/SellerProfile";
import Refunds from "../refunds/Refunds";
import WithDrawMoney from "../wthdrawMoney/WithDrawMoney";
import Coupons from "../coupons/Coupons";

const SellerDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutSeller] = useLogoutSellerMutation();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setMobileSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    if (isMobile) {
      setMobileSidebarOpen(!mobileSidebarOpen);
    } else {
      setSidebarOpen(!sidebarOpen);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutSeller().unwrap();
      dispatch(logout());
      toast.success("Logged out successfully!");
      navigate("/seller_login");
    } catch (error) {
      toast.error("Logout failed. Please try again.");
    }
  };

  const navItems = [
    { icon: <FiHome />, text: "Dashboard", key: "dashboard" },
    { icon: <FaUser />, text: "Seller Profile", key: "profile" },
    { icon: <FiPackage />, text: "Products", key: "products" },
    { icon: <FiShoppingBag />, text: "Orders", key: "orders" },
    { icon: <FiDollarSign />, text: "Sales & Earnings", key: "sales" },
    { icon: <HiOutlineReceiptRefund />, text: "Refunds", key: "refunds" },
    {
      icon: <BiMoneyWithdraw />,
      text: "WithDraw Money",
      key: "withdraw_money",
    },
    { icon: <RiCoupon3Line />, text: "Coupons", key: "coupons" },
    { icon: <FiMessageSquare />, text: "Customer Messages", key: "messages" },
    { icon: <MdOutlineReviews />, text: "Customer Reviews", key: "reviews" },
    { icon: <FiPercent />, text: "Marketing", key: "marketing" },
    { icon: <FaStore />, text: "Store Settings", key: "settings" },
    { icon: <FiPieChart />, text: "Analytics", key: "analytics" },
    { icon: <FiHelpCircle />, text: "Help Center", key: "help" },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardOverview />;
      case "profile":
        return <SellerProfile />;
      case "products":
        return <ProductManagement />;
      case "orders":
        return <OrderManagement />;
      case "sales":
        return <SalesEarnings />;
      case "refunds":
        return <Refunds />;
      case "withdraw_money":
        return <WithDrawMoney />;
      case "coupons":
        return <Coupons />;
      case "messages":
        return <CustomerMessages />;
      case "reviews":
        return <CustomerReviews />;
      case "settings":
        return <StoreSettings />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="container mx-auto flex flex-col md:flex-row h-screen bg-gray-50 overflow-hidden mb-3">
      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`transition-all duration-300 pb-15 min-[600px]:pb-3 ease-in-out z-50 bg-white shadow-md 
          h-screen  top-0 left-0 fixed md:relative             
        ${
          isMobile
            ? mobileSidebarOpen
              ? "translate-x-0 w-64"
              : "-translate-x-full w-64"
            : sidebarOpen
            ? "w-20"
            : "w-64"
        }`}
      >
        <div className="px-5 py-3 md:pt-0 border-b border-gray-200 flex justify-between items-center">
          {!sidebarOpen ? (
            <h1 className="text-xl font-bold text-primary whitespace-nowrap mt-6">
              Seller Center
            </h1>
          ) : (
            <div className="w-full flex justify-center">
              <span className="text-xl font-bold text-primary">SC</span>
            </div>
          )}
          <button
            onClick={toggleSidebar}
            className="md:hidden text-gray-500 hover:text-gray-700"
          >
            <FiX size={24} />
          </button>
        </div>

        <nav className="mt-4 overflow-y-auto h-[calc(100%-64px)]">
          {navItems.map((item) => (
            <button
              key={item.key}
              onClick={() => {
                setActiveTab(item.key);
                if (isMobile) setMobileSidebarOpen(false);
              }}
              className={`flex items-center w-full px-4 py-3 text-left cursor-pointer ${
                activeTab === item.key
                  ? "bg-primary-50 text-primary"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <span className="mr-3">{item.icon}</span>
              {!sidebarOpen && <span>{item.text}</span>}
            </button>
          ))}
          {/* <hr className="my-2 border-gray-300" /> */}
          <button
            onClick={handleLogout}
            className="flex items-center w-full text-gray-600 cursor-pointer px-4 py-2 hover:bg-gray-100 transition"
          >
            <span className="mr-3 text-[19px]">
              <FaSignOutAlt />
            </span>{" "}
            Logout
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Navigation */}
        <header className="bg-white shadow-sm px-4 py-3 flex justify-between items-center sticky top-0 z-10 h-16">
          <div className="flex items-center">
            <button
              onClick={toggleSidebar}
              className="mr-4 text-gray-600 hover:text-gray-900 md:hidden cursor-pointer"
            >
              <FiMenu size={20} />
            </button>
            <h2 className="text-lg font-semibold capitalize">
              {activeTab === "messages"
                ? "Customer Messages"
                : activeTab === "reviews"
                ? "Customer Reviews"
                : activeTab}
            </h2>
          </div>
          <div className="flex items-center space-x-4">
            <button className="relative p-2 text-gray-600 hover:text-gray-900">
              <FiBell size={20} />
              <span className="absolute top-1 right-2 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <div className="flex items-center">
              <img
                src="/images/prof-3.jpg"
                alt="Profile"
                className="w-8 h-8 rounded-full mr-2 cursor-pointer"
              />
              {!isMobile && (
                <span className="text-sm font-medium">Seller Name</span>
              )}
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-4 md:p-6 flex-1 overflow-y-auto max-h-[calc(100vh-4rem)]">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default SellerDashboard;

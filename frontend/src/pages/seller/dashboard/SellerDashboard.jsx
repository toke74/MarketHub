import {
  FiHome,
  FiPackage,
  FiShoppingBag,
  FiDollarSign,
  FiMessageSquare,
  FiStar,
  FiPercent,
  FiSettings,
  FiPieChart,
  FiHelpCircle,
  FiBell,
  FiMenu,
  FiX,
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";
import { FaChartLine, FaStore } from "react-icons/fa";
import { useState, useEffect } from "react";
import DashboardOverview from "./DashboardOverview";
import ProductManagement from "../../products/ProductManagement";
import OrderManagement from "../../orders/OrderManagement";
import SalesEarnings from "../../sales/SalesEarnings";
import CustomerMessages from "../customer/CustomerMessages";
import CustomerReviews from "../customer/CustomerReviews";
import StoreSettings from "./StoreSettings";

const SellerDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [collapsedSections, setCollapsedSections] = useState({});

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

  const toggleSection = (section) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const toggleSidebar = () => {
    if (isMobile) {
      setMobileSidebarOpen(!mobileSidebarOpen);
    } else {
      setSidebarOpen(!sidebarOpen);
    }
  };

  const navItems = [
    { icon: <FiHome />, text: "Dashboard", key: "dashboard" },
    { icon: <FiPackage />, text: "Products", key: "products" },
    { icon: <FiShoppingBag />, text: "Orders", key: "orders" },
    { icon: <FiDollarSign />, text: "Sales & Earnings", key: "sales" },
    {
      icon: <FiMessageSquare />,
      text: "Customer",
      key: "customer",
      subItems: [
        { text: "Messages", key: "messages" },
        { text: "Reviews", key: "reviews" },
      ],
    },
    { icon: <FiPercent />, text: "Marketing", key: "marketing" },
    { icon: <FaStore />, text: "Store Settings", key: "settings" },
    { icon: <FiPieChart />, text: "Analytics", key: "analytics" },
    { icon: <FiHelpCircle />, text: "Help Center", key: "help" },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardOverview />;
      case "products":
        return <ProductManagement />;
      case "orders":
        return <OrderManagement />;
      case "sales":
        return <SalesEarnings />;
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
    <div className="container mx-auto flex h-screen bg-gray-50 overflow-hidden mt-3">
      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`${sidebarOpen ? "w-20" : "w-64"} 
        bg-white shadow-md z-30 transition-all duration-300 ease-in-out
        fixed md:relative h-full
        ${mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0`}
      >
        <div className="p-4 border-b flex justify-between items-center">
          {!sidebarOpen && (
            <h1 className="text-xl font-bold text-primary whitespace-nowrap">
              Seller Center
            </h1>
          )}
          {sidebarOpen && (
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
          {navItems.map((item) => {
            if (item.subItems) {
              return (
                <div key={item.key}>
                  <button
                    onClick={() => toggleSection(item.key)}
                    className={`flex items-center justify-between w-full px-4 py-3 text-left cursor-pointer ${
                      activeTab === item.key ||
                      item.subItems.some((sub) => sub.key === activeTab)
                        ? "bg-primary-50 text-primary"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <div className="flex items-center">
                      <span className="mr-3">{item.icon}</span>
                      {!sidebarOpen && <span>{item.text}</span>}
                    </div>
                    {!sidebarOpen &&
                      (collapsedSections[item.key] ? (
                        <FiChevronDown />
                      ) : (
                        <FiChevronUp />
                      ))}
                  </button>

                  {!sidebarOpen && !collapsedSections[item.key] && (
                    <div className="pl-12">
                      {item.subItems.map((subItem) => (
                        <button
                          key={subItem.key}
                          onClick={() => setActiveTab(subItem.key)}
                          className={`flex items-center w-full px-4 py-2 text-left text-sm cursor-pointer ${
                            activeTab === subItem.key
                              ? "bg-primary-100 text-primary"
                              : "text-gray-600 hover:bg-gray-50"
                          }`}
                        >
                          {subItem.text}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <button
                key={item.key}
                onClick={() => setActiveTab(item.key)}
                className={`flex items-center w-full px-4 py-3 text-left cursor-pointer ${
                  activeTab === item.key
                    ? "bg-primary-50 text-primary"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                {!sidebarOpen && <span>{item.text}</span>}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto flex flex-col h-screen">
        {/* Top Navigation */}
        <header className="bg-white shadow-sm p-4 flex justify-between items-center sticky top-0 z-10">
          <div className="flex items-center">
            <button
              onClick={toggleSidebar}
              className="mr-4 text-gray-600 hover:text-gray-900 md:hidden"
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
              <span className="absolute top-1 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
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
        <main className="p-4 md:p-6 flex-1 overflow-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default SellerDashboard;

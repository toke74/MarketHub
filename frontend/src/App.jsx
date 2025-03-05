//Package imports
import { Routes, Route } from "react-router-dom";

// Header imports
import Header from "./components/layout/header/Header";

//Navbar Pages imports
import Home from "./pages/navbarPages/Home";
import Shops from "./pages/navbarPages/Shops";
import TodaysDeals from "./pages/navbarPages/TodaysDeals";
import BestSellers from "./pages/navbarPages/BestSellers";
import HotOffers from "./pages/navbarPages/HotOffers";
import Blog from "./pages/navbarPages/Blog";
import Gifts from "./pages/navbarPages/Gifts";
import CustomerService from "./pages/navbarPages/CustomerService";

//authPages imports
import SignIn from "./pages/authPages/SignIn";
import SignUp from "./pages/authPages/SignUp";

function App() {
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
        <Route path="/gifts" element={<Gifts />} />
        <Route path="/customer_service" element={<CustomerService />} />

        {/* auth Links */}
        <Route path="/sign_in" element={<SignIn />} />
        <Route path="/sign_up" element={<SignUp />} />
      </Routes>
    </div>
  );
}

export default App;

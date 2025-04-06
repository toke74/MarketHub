//package import
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

//local import
import CategoryDropdownMenu from "./CategoryDropdownMenu";
import { navigationMenu } from "../../../utils/data";

const HeaderDesktopMenu = () => {
  const { isSellerAuthenticated } = useSelector((state) => state.seller);

  // Filter out "Become a Seller" if the seller is logged in
  const filteredMenu = isSellerAuthenticated
    ? navigationMenu.filter((item) => item.name !== "Become a Seller")
    : navigationMenu;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return (
    <nav className="hidden lg:block bg-white shadow-md">
      <div className="container mx-auto">
        <ul className="flex justify-center items-center gap-8 py-4">
          {/*Dropdown Categories */}
          <CategoryDropdownMenu />

          {/* Navigation Menu */}
          {filteredMenu.map((item, index) => (
            <li key={index} className="relative group">
              <Link
                to={item.url}
                onClick={scrollToTop}
                className="flex items-center cursor-pointer text-text uppercase font-semibold text-[11.5px] xl:text-[15.6px] hover:text-primary transition"
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default HeaderDesktopMenu;

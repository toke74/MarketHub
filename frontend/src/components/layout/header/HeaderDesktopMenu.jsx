//package import
import { Link } from "react-router-dom";

//local import
import CategoryDropdownMenu from "./CategoryDropdownMenu";
import { navigationMenu } from "../../../utils/data";

const HeaderDesktopMenu = () => {
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
          {navigationMenu.map((item, index) => (
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

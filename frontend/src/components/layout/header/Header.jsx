import React from "react";
import HeaderTop from "./HeaderTop";
import HeaderMain from "./HeaderMain";
import HeaderDesktopMenu from "./HeaderDesktopMenu";
import MobileBottomNav from "./MobileBottomNav";

const Header = () => {
  return (
    <>
      <header className="sticky top-0 z-50 md:z-51">
        <HeaderTop />
        <div className="sticky top-0 bg-white shadow-sm">
          <HeaderMain />
          <HeaderDesktopMenu />
        </div>
      </header>
      <MobileBottomNav />
    </>
  );
};

export default Header;

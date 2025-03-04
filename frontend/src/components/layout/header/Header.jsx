import React from "react";
import HeaderTop from "./HeaderTop";
import HeaderMain from "./HeaderMain";
import HeaderDesktopMenu from "./HeaderDesktopMenu";
import MobileBottomNav from "./MobileBottomNav";

const Header = () => {
  return (
    <>
      <HeaderTop />
      <HeaderMain />
      <HeaderDesktopMenu />
      <MobileBottomNav />
    </>
  );
};

export default Header;

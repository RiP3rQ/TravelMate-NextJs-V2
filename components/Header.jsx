import Image from "next/image";
import React from "react";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 grid grid-cols-3 bg-white shadow-md p-5 md:px-10">
      {/* Logo section (LEFT)*/}
      <div className="relative flex items-center h-10 cursor-pointer my-auto">
        <Image
          src="https://links.papareact.com/qd3"
          alt="logo"
          fill
          style={{ objectFit: "contain", objectPosition: "left" }}
        />
      </div>
      {/* Search section (MIDDLE)*/}
      <div>
        <input type="text" />
      </div>

      {/* Login / HamburgerMenu section (RIGHT)*/}
    </header>
  );
};

export default Header;

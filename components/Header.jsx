import Image from "next/image";
import React from "react";
import {
  MagnifyingGlassIcon,
  LanguageIcon,
  Bars3Icon,
  UserCircleIcon,
  MoonIcon,
} from "@heroicons/react/24/solid";

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
      <div className="flex items-center border-2 rounded-full py-2 md:shadow-md">
        <input
          className="pl-5 bg-transparent outline-none flex-grow 
          text-sm text-gray-600 placeholder-gray-400"
          type="text"
          placeholder="Wyszukaj miejsca"
        />
        <MagnifyingGlassIcon
          className="hidden h-8 bg-red-400 text-white rounded-full 
        p-2 cursor-pointer md:inline-flex md:mx-2"
        />
      </div>

      {/* Login / HamburgerMenu section (RIGHT)*/}
      <div className="flex items-center space-x-4 justify-end text-gray-500">
        <MoonIcon className="h-6 cursor-pointer" />
        <LanguageIcon className="h-6 cursor-pointer" />

        <div className="flex items-center space-x-2 border-2 p-2 rounded-full">
          <Bars3Icon className="h-6 cursor-pointer" />
          <UserCircleIcon className="h-6 cursor-pointer" />
        </div>
      </div>
    </header>
  );
};

export default Header;

import Image from "next/image";
import React, { useEffect, useState } from "react";
import {
  MagnifyingGlassIcon,
  LanguageIcon,
  UserCircleIcon,
  MoonIcon,
  UserIcon,
  ChevronDownIcon,
  SunIcon,
} from "@heroicons/react/24/solid";
import { useRouter } from "next/router";
import { signOut, useSession } from "next-auth/react";
import { toast } from "react-hot-toast";

const Header = ({ placeholder }) => {
  const { data: session } = useSession();
  const [searchInput, setSearchInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [avatarDropdownIsOpen, setAvatarDropdownIsOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(session?.user || null);

  // selection of possible search options
  const list = ["Noclegi", "Atrakcje", "Szlaki"];
  const [selectedOption, setSelectedOption] = useState(list[0]);

  const router = useRouter();

  const search = () => {
    router.push({
      pathname: "/search",
      query: {
        activity: selectedOption,
        location: searchInput,
      },
    });
  };

  const login = () => {
    router.push("/login");
  };

  // router for profile settings page
  const profilePageHandle = () => {
    router.push("/profile");
  };

  const SignOutHandle = () => {
    signOut().then(() => {
      toast.success("Wylogowano pomyślnie");
      router.push("/");
    });
  };

  return (
    <header className="sticky top-0 z-30 bg-white shadow-md md:p-5 md:px-10 grid lg:grid-cols-12 md:grid-cols-5 sm:grid-cols-4">
      {/* Logo section (LEFT)*/}
      <div
        className="relative flex items-center h-full cursor-pointer my-auto lg:col-span-3 md:col-span-1 sm:col-span-1"
        onClick={() => router.push("/")}
      >
        <Image
          src="/assets/logo.png"
          alt="logo"
          fill
          style={{ objectFit: "contain", objectPosition: "left" }}
        />
      </div>

      {/* Search section (MIDDLE)*/}
      {/* Selecting items for searching */}
      <div className="flex flex-col items-center relative md:col-span-1 mr-2 lg:col-span-2 sm:col-span-1">
        <button
          className="bg-[#3F9337] p-2 w-full flex items-center justify-center font-bold text-lg 
        tracking-wider rounded-2xl border-4 border-transparent active:border-[#3F9337] active:bg-white duration-300 z-10"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          {selectedOption}
          {!isOpen ? (
            <ChevronDownIcon className="h-6 ml-2 transform duration-200" />
          ) : (
            <ChevronDownIcon className="h-6 ml-2 transform rotate-180 duration-200" />
          )}
        </button>

        <div className="bg-slate-200 absolute top-8 left-0 flex flex-col items-start rounded-2xl w-full">
          {isOpen && (
            <div className="flex flex-col items-center w-full space-y-2 mt-6">
              {list
                .filter((item) => item !== selectedOption)
                .map((item) => (
                  <button
                    key={item}
                    className="bg-[#3F9337] p-2 w-full flex items-center justify-center font-bold text-lg 
                  tracking-wider rounded-2xl border-4 border-transparent active:border-[#3F9337] active:bg-white duration-300"
                    onClick={() => {
                      setSelectedOption(item);
                      setIsOpen(false);
                    }}
                  >
                    {item}
                  </button>
                ))}
            </div>
          )}
        </div>
      </div>
      {/* Search bar */}
      <div className="flex items-center border-2 rounded-2xl py-2 md:shadow-md md:col-span-2 lg:col-span-4 sm:col-span-1">
        <input
          className="pl-5 bg-transparent outline-none flex-grow 
          text-sm text-gray-600 placeholder-gray-400"
          type="text"
          placeholder={placeholder || "Wyszukaj miejsca"}
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <MagnifyingGlassIcon
          className="hidden h-8 bg-[#3F9337] text-white rounded-full 
        p-2 cursor-pointer md:inline-flex md:mx-2"
          onClick={search}
        />
      </div>

      {/* Login / HamburgerMenu section (RIGHT)*/}
      <div className="flex items-center space-x-4 justify-end text-gray-500 lg:col-span-3 md:col-span-1 sm:col-span-1">
        <div className="flex items-center space-x-2 border-2 p-2 rounded-full relative">
          <p className="hidden md:inline">Dodaj {selectedOption}</p>
        </div>
        {!currentUser ? (
          <UserCircleIcon className="h-12 cursor-pointer" onClick={login} />
        ) : (
          <div
            className="h-12 w-12 rounded-full cursor-pointer relative"
            onClick={() => setAvatarDropdownIsOpen(!avatarDropdownIsOpen)}
          >
            <Image
              src={
                currentUser.image
                  ? currentUser.image
                  : "https://st3.depositphotos.com/1767687/16607/v/600/depositphotos_166074422-stock-illustration-default-avatar-profile-icon-grey.jpg"
              }
              alt="Profile Pic"
              fill
              className="absolute rounded-full h-full w-full object-cover"
            />
          </div>
        )}
      </div>

      {/* Dropdown menu for profile picture */}
      {avatarDropdownIsOpen && (
        <div className="absolute top-16 right-10 bg-slate-200 border-4 border-[#3F9337] h-20 w-52 rounded-xl mt-2">
          <div className="flex flex-col items-center justify-center h-full w-full">
            <p
              className="text-lg font-semibold border-b border-gray-500 py-1 cursor-pointer"
              onClick={profilePageHandle}
            >
              Ustawienia profilu
            </p>
            <button
              className="text-lg text-[#3F9337] font-bold py-1 tracking-widest cursor-pointer"
              onClick={SignOutHandle}
            >
              Wyloguj
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;

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
import { DateRange } from "react-date-range";

import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import { useRouter } from "next/router";
import { auth } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

const Header = ({ placeholder }) => {
  const [searchInput, setSearchInput] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [numberOfGuests, setNumberOfGuests] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const [themeOfPage, setThemeOfPage] = useState("Light");
  const [polishLanguage, setPolishLanguage] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [avatarDropdownIsOpen, setAvatarDropdownIsOpen] = useState(false);

  // selection of possible search options
  const list = ["Noclegi", "Atrakcje", "Szlaki"];
  const [selectedOption, setSelectedOption] = useState(list[0]);

  const router = useRouter();

  const selectionRange = {
    startDate: startDate,
    endDate: endDate,
    key: "selection",
  };

  const handleSelect = (ranges) => {
    setStartDate(ranges.selection.startDate);
    setEndDate(ranges.selection.endDate);
  };

  const resetInput = () => {
    setSearchInput("");
    setStartDate(new Date());
    setEndDate(new Date());
    setNumberOfGuests(1);
  };

  const search = () => {
    router.push({
      pathname: "/search",
      query: {
        location: searchInput,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        numberOfGuests,
      },
    });
  };

  const login = () => {
    router.push("/login");
  };

  // check if user is logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });

    return () => unsubscribe();
  }, []);

  // sign out user using firebase
  const SignOutHandle = async () => {
    await signOut(auth);
    setAvatarDropdownIsOpen(false);
  };

  // router for profile settings page
  const profilePageHandle = () => {
    router.push("/profile");
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md md:p-5 md:px-10 grid lg:grid-cols-12 md:grid-cols-5 sm:grid-cols-4">
      {/* Logo section (LEFT)*/}
      <div
        className="relative flex items-center h-10 cursor-pointer my-auto lg:col-span-3 md:col-span-1 sm:col-span-1"
        onClick={() => router.push("/")}
      >
        <Image
          src="https://links.papareact.com/qd3"
          alt="logo"
          fill
          style={{ objectFit: "contain", objectPosition: "left" }}
        />
      </div>

      {/* Search section (MIDDLE)*/}
      {/* Selecting items for searching */}
      <div className="flex flex-col items-center relative md:col-span-1 mr-2 lg:col-span-2 sm:col-span-1">
        <button
          className="bg-red-400 p-2 w-full flex items-center justify-center font-bold text-lg 
        tracking-wider rounded-2xl border-4 border-transparent active:border-red-400 active:bg-white duration-300 z-10"
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
                    className="bg-red-400 p-2 w-full flex items-center justify-center font-bold text-lg 
                  tracking-wider rounded-2xl border-4 border-transparent active:border-red-400 active:bg-white duration-300"
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
          className="hidden h-8 bg-red-400 text-white rounded-full 
        p-2 cursor-pointer md:inline-flex md:mx-2"
        />
      </div>

      {/* Login / HamburgerMenu section (RIGHT)*/}
      <div className="flex items-center space-x-4 justify-end text-gray-500 lg:col-span-3 md:col-span-1 sm:col-span-1">
        <div className="flex items-center space-x-2 border-2 p-2 rounded-full relative">
          {themeOfPage == "Light" ? (
            <MoonIcon
              className="h-6 cursor-pointer"
              onClick={() => setThemeOfPage("Dark")}
            />
          ) : (
            <SunIcon
              className="h-6 cursor-pointer"
              onClick={() => setThemeOfPage("Light")}
            />
          )}
          <LanguageIcon
            className="h-6 cursor-pointer"
            onClick={() => setPolishLanguage((prev) => !prev)}
          />
        </div>
        {!currentUser ? (
          <UserCircleIcon className="h-12 cursor-pointer" onClick={login} />
        ) : (
          <div
            className="h-12 w-12 rounded-full cursor-pointer relative"
            onClick={() => setAvatarDropdownIsOpen(!avatarDropdownIsOpen)}
          >
            <Image
              src={currentUser.photoURL}
              alt="Profile Pic"
              fill
              className="absolute rounded-full h-full w-full object-cover"
            />
          </div>
        )}
      </div>

      {/* Dropdown menu for searching */}
      {searchInput && (
        <div className="flex flex-col mx-auto lg:col-span-12 md:col-span-5 sm:col-span-4">
          <DateRange
            ranges={[selectionRange]}
            minDate={new Date()}
            rangeColors={["#FD5B61"]}
            onChange={handleSelect}
          />
          <div className="flex items-center border-b mb-4 px-4">
            <h2 className="text-2xl flex-grow font-semibold">
              Number of Guests
            </h2>

            <UserIcon className="h-5" />
            <input
              type="number"
              className="w-12 pl-2 text-lg outline-none text-red-400"
              min={1}
              value={numberOfGuests}
              onChange={(e) => setNumberOfGuests(e.target.value)}
            />
          </div>
          <div className="flex ">
            <button
              className="flex-grow text-gray-500 font-bold"
              onClick={resetInput}
            >
              Cancel
            </button>
            <button
              className="flex-grow text-red-400 font-bold"
              onClick={search}
            >
              Search
            </button>
          </div>
        </div>
      )}

      {/* Dropdown menu for profile picture */}
      {avatarDropdownIsOpen && (
        <div className="absolute top-16 right-10 bg-slate-200 border-4 border-red-400 h-20 w-52 rounded-xl mt-2">
          <div className="flex flex-col items-center justify-center h-full w-full">
            <p
              className="text-lg font-semibold border-b border-gray-500 py-1 cursor-pointer"
              onClick={profilePageHandle}
            >
              Ustawienia profilu
            </p>
            <button
              className="text-lg text-red-500 font-bold py-1 tracking-widest cursor-pointer"
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

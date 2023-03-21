import Image from "next/image";
import React, { useState } from "react";
import {
  MagnifyingGlassIcon,
  LanguageIcon,
  Bars3Icon,
  UserCircleIcon,
  MoonIcon,
  UserIcon,
} from "@heroicons/react/24/solid";
import { DateRangePicker } from "react-date-range";

import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file

const Header = () => {
  const [searchInput, setSearchInput] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [numberOfGuests, setNumberOfGuests] = useState(1);

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
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
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

      {/* Dropdown menu */}
      {searchInput && (
        <div className="flex flex-col col-span-3 mx-auto">
          <DateRangePicker
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
            <button className="flex-grow text-red-400 font-bold">Search</button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;

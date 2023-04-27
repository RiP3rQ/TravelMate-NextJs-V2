import Image from "next/image";
import React, { useCallback, useMemo, useState } from "react";
import {
  MagnifyingGlassIcon,
  UserCircleIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/solid";
import { GiMountainClimbing } from "react-icons/gi";
import { MdOutlineBedroomParent } from "react-icons/md";
import { AiFillThunderbolt } from "react-icons/ai";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { toast } from "react-hot-toast";
import useRentModal from "../hooks/useRentModal";
import axios from "axios";
// google autocomplete
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";

export const list = [
  {
    label: "Noclegi",
    icon: MdOutlineBedroomParent,
    description: "Znajdź miejsce na nocleg",
  },
  {
    label: "Atrakcje",
    icon: AiFillThunderbolt,
    description: "Przeżyj coś nowego",
  },
  {
    label: "Szlaki",
    icon: GiMountainClimbing,
    description: "Zdobądź nowe szczyty",
  },
];

const Header = ({ placeholder, page }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [avatarDropdownIsOpen, setAvatarDropdownIsOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const rentModal = useRentModal();

  const user = async () => {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_URL}/api/auth/getCurrentUser`
    );
    if (res.data.message === "Not logged In!") {
      return;
    } else {
      setCurrentUser(res.data);
    }
  };

  useMemo(() => {
    user();
  }, []);

  // selection of possible search options
  const [selectedOption, setSelectedOption] = useState(list[0].label);

  useMemo(() => {
    if (page === "Attractions") {
      setSelectedOption(list[1].label);
    }
    if (page === "Listings") {
      setSelectedOption(list[0].label);
    }
  }, [page]);

  // router
  const router = useRouter();

  // router for search page
  const search = () => {
    if (!address || !coordinates) {
      return;
    }
    if (selectedOption === "Noclegi") {
      router.push({
        pathname: "/search",
        query: {
          location: address,
          coordinatesLat: coordinates.lat,
          coordinatesLng: coordinates.lng,
        },
      });
    }
    if (selectedOption === "Atrakcje") {
      router.push({
        pathname: "/searchAttractions",
        query: {
          location: address,
          coordinatesLat: coordinates.lat,
          coordinatesLng: coordinates.lng,
        },
      });
    }
  };

  // router for login page
  const login = () => {
    router.push("/login");
  };

  // router for profile settings page
  const profilePageHandle = () => {
    router.push("/profile");
  };

  // router for profile settings page
  const favoritePageHandle = () => {
    router.push("/favorites");
  };

  // router for reserved listings/attractions page
  const reservationsPageHandle = () => {
    router.push("/reservations");
  };

  // sign out functionallity
  const SignOutHandle = () => {
    signOut().then(() => {
      toast.success("Wylogowano pomyślnie");
      router.push("/");
    });
  };

  // open rent modal
  const onRent = useCallback(() => {
    if (!currentUser) {
      return;
    }

    // open rent modal
    rentModal.onOpen();
  }, [currentUser, rentModal]);

  // google autocomplete
  const [address, setAddress] = useState("");
  const [coordinates, setCoordinates] = useState({
    lat: null,
    lng: null,
  });

  const handleChange = (address) => {
    setAddress(address);
  };

  const handleSelect = (address) => {
    setAddress(address);
    geocodeByAddress(address)
      .then((results) => getLatLng(results[0]))
      .then((latLng) =>
        setCoordinates({
          lat: latLng.lat,
          lng: latLng.lng,
        })
      )
      .catch((error) => console.error("Error", error));
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
                    key={item.label}
                    className="bg-[#3F9337] p-2 w-full flex items-center justify-center font-bold text-lg 
                  tracking-wider rounded-2xl border-4 border-transparent active:border-[#3F9337] active:bg-white duration-300"
                    onClick={() => {
                      setSelectedOption(item.label);
                      setIsOpen(false);
                    }}
                  >
                    {item.label}
                  </button>
                ))}
            </div>
          )}
        </div>
      </div>
      {/* Search bar */}
      <div className="flex items-center border-2 rounded-2xl py-2 md:shadow-md md:col-span-2 lg:col-span-4 sm:col-span-1 relative">
        <PlacesAutocomplete
          value={address}
          onChange={handleChange}
          onSelect={handleSelect}
        >
          {({
            getInputProps,
            suggestions,
            getSuggestionItemProps,
            loading,
          }) => (
            <div className="flex-1 ml-2">
              <input
                {...getInputProps({
                  placeholder: `${
                    placeholder ? placeholder : "Wyszukaj miejsce"
                  }`,
                  className: "location-search-input",
                })}
                className=" w-full py-1 outline-none focus:outline-none relative"
              />
              {loading || suggestions.length > 0 ? (
                <div className="autocomplete-dropdown-container absolute top-12 left-0 w-full border border-gray-400 rounded-xl">
                  {loading && <div className="text-center">Ładowanie...</div>}
                  {suggestions.map((suggestion) => (
                    <div
                      {...getSuggestionItemProps(suggestion)}
                      key={suggestion.placeId}
                      className="bg-white hover:bg-gray-400 cursor-pointer"
                    >
                      <span className=" px-2">{suggestion.description}</span>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          )}
        </PlacesAutocomplete>
        <MagnifyingGlassIcon
          className="hidden h-8 bg-[#3F9337] text-white rounded-full 
        p-2 cursor-pointer md:inline-flex md:mx-2"
          onClick={search}
        />
      </div>

      {/* Login / HamburgerMenu section (RIGHT)*/}
      {!currentUser ? (
        <div className="flex items-center space-x-4 justify-end text-gray-500 lg:col-span-3 md:col-span-1 sm:col-span-1">
          <div
            className="flex items-center space-x-2 pl-4 border-2 rounded-full relative cursor-pointer"
            onClick={login}
          >
            <p className="hidden md:inline font-semibold text-lg">Zaloguj</p>
            <UserCircleIcon className="h-12" />
          </div>
        </div>
      ) : (
        <div className="flex items-center space-x-4 justify-end text-gray-500 lg:col-span-3 md:col-span-1 sm:col-span-1 ">
          <div
            className="flex items-center space-x-2 p-2 border-2 rounded-full relative cursor-pointer hover:bg-green-600 hover:text-white"
            onClick={onRent}
          >
            <p className="hidden md:inline font-semibold text-lg">
              Zostań Mate-em
            </p>
          </div>
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
        </div>
      )}

      {/* Dropdown menu for profile picture */}
      {avatarDropdownIsOpen && (
        <div className="absolute top-16 right-10 bg-slate-200 border-4 border-[#3F9337] w-52 rounded-xl mt-2">
          <div className="flex flex-col items-center justify-center h-full w-full">
            <p
              className="text-lg font-semibold border-b border-gray-500 py-1 cursor-pointer w-full rounded-lg text-center
              hover:bg-green-400 hover:text-white "
              onClick={profilePageHandle}
            >
              Ustawienia profilu
            </p>
            <p
              className="text-lg font-semibold border-b border-gray-500 py-1 cursor-pointer w-full rounded-lg text-center
              hover:bg-green-400 hover:text-white "
              onClick={favoritePageHandle}
            >
              Polubione
            </p>
            <p
              className="text-lg font-semibold border-b border-gray-500 py-1 cursor-pointer w-full rounded-lg text-center
              hover:bg-green-400 hover:text-white "
              onClick={reservationsPageHandle}
            >
              Rezerwacje/Bilety
            </p>
            <p
              className="text-xl text-[#3F9337] font-extrabold py-1 tracking-widest cursor-pointer w-full rounded-lg text-center
              hover:bg-green-400 hover:text-white"
              onClick={SignOutHandle}
            >
              Wyloguj
            </p>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;

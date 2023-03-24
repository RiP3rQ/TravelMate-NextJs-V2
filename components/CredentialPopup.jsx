import {
  EnvelopeIcon,
  LockClosedIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import React, { useState } from "react";

const CredentialPopup = ({ setPopup, setCredentials }) => {
  const [credentialPassword, setCredentialPassword] = useState("");

  const handleClick = () => {
    setCredentials(credentialPassword);
    setPopup(false);
  };

  return (
    <div
      className="fixed top-0 left-0 w-full h-full bg-black/90 z-40 flex items-center justify-center cursor-pointer backdrop-blur-sm"
      onClick={(e) => {
        if (e.target.id === "outer" || e.target.id === "close-button") {
          setPopup(false);
        }
      }}
      id="outer"
    >
      <div
        className="bg-red-100 w-1/2 h-1/2 rounded-md flex flex-col items-center justify-center z-50 cursor-default relative"
        id="inner"
      >
        <div
          className="absolute -top-4 -right-4 cursor-pointer"
          onClick={() => setPopup(false)}
          id="close-button"
        >
          <XMarkIcon className="h-12 text-white bg-red-500 rounded-full" />
        </div>
        <h1 className="text-2xl font-bold mb-6">
          Musimy upewnić się, że to ty:
        </h1>

        {/* FORMULARZ */}

        <div className="relative z-0 my-6 w-1/2">
          <LockClosedIcon className="h-6 absolute top-3 right-1 text-white" />
          <input
            type="password"
            id="password"
            className="block py-2.5 px-0 w-full text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-white focus:outline-none focus:ring-0 focus:border-white peer"
            placeholder=" "
            value={credentialPassword}
            onChange={(e) => setCredentialPassword(e.target.value)}
          />
          <label
            htmlFor="password"
            className="absolute text-sm text-gray-700 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-white peer-focus:dark:text-white peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-100 peer-focus:-translate-y-6"
          >
            HASŁO<span className="text-red-500">*</span>
          </label>
        </div>
        {/* PRZYCISK */}
        <button
          className="bg-red-400 text-white px-4 py-2 rounded-md w-1/4"
          onClick={handleClick}
        >
          Zaloguj
        </button>
      </div>
    </div>
  );
};

export default CredentialPopup;

import {
  EnvelopeIcon,
  LockClosedIcon,
  PhotoIcon,
  UserIcon,
} from "@heroicons/react/24/solid";
import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";

const Register = () => {
  const router = useRouter();

  const goBack = () => {
    router.push("/");
  };

  return (
    <div className="h-screen w-full relative">
      <Image
        src="/assets/login_background.jpg"
        alt="background"
        fill
        className="z-10"
      />
      <section className="z-50 absolute top-0 left-0 w-full h-screen flex justify-center items-center">
        <div className="relative w-[600px] h-[450px] flex justify-center items-center bg-transparent border-2 border-white rounded-3xl backdrop-blur-3xl">
          {/* LOGO */}
          <div className="absolute -top-16 cursor-pointer">
            <p
              className="text-white font-bold text-4xl md:text-6xl font-mono"
              onClick={goBack}
            >
              TravelMate
            </p>
          </div>
          <div className="w-full mx-6">
            {/* FORM */}
            <form action="" className="">
              <h2 className="text-5xl text-center text-white mb-8">
                Rejestracja
              </h2>
              <div class="relative z-0 my-6">
                <EnvelopeIcon className="h-6 absolute top-3 right-1 text-white" />
                <input
                  type="text"
                  id="email"
                  class="block py-2.5 px-0 w-full text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-white focus:outline-none focus:ring-0 focus:border-white peer"
                  placeholder=" "
                />
                <label
                  for="email"
                  class="absolute text-sm text-gray-700 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-white peer-focus:dark:text-white peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-100 peer-focus:-translate-y-6"
                >
                  EMAIL<span className="text-red-500">*</span>
                </label>
              </div>

              <div class="relative z-0 my-6">
                <LockClosedIcon className="h-6 absolute top-3 right-1 text-white" />
                <input
                  type="password"
                  id="password"
                  class="block py-2.5 px-0 w-full text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-white focus:outline-none focus:ring-0 focus:border-white peer"
                  placeholder=" "
                />
                <label
                  for="password"
                  class="absolute text-sm text-gray-700 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-white peer-focus:dark:text-white peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-100 peer-focus:-translate-y-6"
                >
                  HASŁO<span className="text-red-500">*</span>
                </label>
              </div>

              <div class="relative z-0 my-6">
                <UserIcon className="h-6 absolute top-3 right-1 text-white" />
                <input
                  type="text"
                  id="username"
                  class="block py-2.5 px-0 w-full text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-white focus:outline-none focus:ring-0 focus:border-white peer"
                  placeholder=" "
                />
                <label
                  for="username"
                  class="absolute text-sm text-gray-700 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-white peer-focus:dark:text-white peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-100 peer-focus:-translate-y-6"
                >
                  NAZWA UŻYTKOWNIKA<span className="text-red-500">*</span>
                </label>
              </div>
              <div class="relative z-0 my-6">
                <PhotoIcon className="h-6 absolute top-3 right-1 text-white" />
                <input
                  type="file"
                  id="profile_picture"
                  class="block py-4 px-0 w-full text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-white focus:outline-none focus:ring-0 focus:border-white peer"
                  placeholder=" "
                />
                <label
                  for="profile_picture"
                  class="absolute text-lg text-gray-700 -translate-y-6 scale-75 top-3 -z-10 origin-[0]"
                >
                  ZDJĘCIE PROFILOWE<span className="text-red-500">*</span>
                </label>
              </div>

              <button className="w-full h-11 rounded-3xl border-0 outline-none cursor-pointer text-xl font-bold bg-white">
                Zarejestruj
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Register;

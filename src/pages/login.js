import { EnvelopeIcon, LockClosedIcon } from "@heroicons/react/24/solid";
import { signInWithEmailAndPassword } from "firebase/auth";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { auth } from "../../firebase";

const Login = () => {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const router = useRouter();

  const goBack = () => {
    router.push("/");
  };

  const goRegister = () => {
    router.push("/register");
  };

  const loginHandle = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
    } catch (error) {
      console.log(error.message);
    } finally {
      router.push("/");
    }
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
        <div className="relative w-96 h-96 flex justify-center items-center bg-transparent border-2 border-white rounded-3xl backdrop-blur-3xl">
          {/* LOGO */}
          <div className="absolute -top-16 cursor-pointer">
            <p
              className="text-white font-bold text-4xl md:text-6xl font-mono"
              onClick={goBack}
            >
              TravelMate
            </p>
          </div>
          <div className="">
            {/* FORM */}
            <form action="" className="">
              <h2 className="text-5xl text-center text-white my-8">
                Logowanie
              </h2>
              <div className="relative z-0 my-6">
                <EnvelopeIcon className="h-6 absolute top-3 right-1 text-white" />
                <input
                  type="text"
                  id="email"
                  className="block py-2.5 px-0 w-full text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-white focus:outline-none focus:ring-0 focus:border-white peer"
                  placeholder=" "
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                />
                <label
                  htmlFor="email"
                  className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-white peer-focus:dark:text-white peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-100 peer-focus:-translate-y-6"
                >
                  EMAIL<span className="text-red-500">*</span>
                </label>
              </div>

              <div className="relative z-0 my-6">
                <LockClosedIcon className="h-6 absolute top-3 right-1 text-white" />
                <input
                  type="password"
                  id="password"
                  className="block py-2.5 px-0 w-full text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-white focus:outline-none focus:ring-0 focus:border-white peer"
                  placeholder=" "
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                />
                <label
                  htmlFor="password"
                  className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-white peer-focus:dark:text-white peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-100 peer-focus:-translate-y-6"
                >
                  HASŁO<span className="text-red-500">*</span>
                </label>
              </div>
              <button
                className="w-full h-11 rounded-3xl border-0 outline-none cursor-pointer text-xl font-bold bg-white"
                onClick={(e) => loginHandle(e)}
              >
                Zaloguj
              </button>
              <div className="font-lg text-white my-5 text-center">
                <p>
                  Nie masz jeszcze konta?{" "}
                  <span
                    className="cursor-pointer no-underline font-bold text-xl hover:underline"
                    onClick={goRegister}
                  >
                    Zarejestruj
                  </span>
                </p>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Login;

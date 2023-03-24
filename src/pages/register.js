import {
  EnvelopeIcon,
  LockClosedIcon,
  PhotoIcon,
  UserIcon,
} from "@heroicons/react/24/solid";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useState, useRef } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, storage } from "../../firebase";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";

const Register = () => {
  const router = useRouter();

  // form info
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [profilePicture, setProfilePicture] = useState("");

  // ref to file picker
  const filePickerRef = useRef(null);

  // helpers for storage in firebase
  const [imgUrl, setImgUrl] = useState(null);
  const [progresspercent, setProgresspercent] = useState(0);

  // register user using firebase
  const register = async (e) => {
    e.preventDefault();

    // register
    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // upload profile picture to Firebase storage if user has selected one
      if (profilePicture) {
        const storageRef = ref(
          storage,
          `profileImages/${profilePicture.name + user.uid}`
        );
        await uploadBytesResumable(storageRef, profilePicture);

        // get download url
        const downloadUrl = await getDownloadURL(storageRef);

        // set user display name to username and avatar
        await updateProfile(user, {
          displayName: username,
          photoURL: downloadUrl,
        });
      } else {
        // set user display name to username
        await updateProfile(user, {
          displayName: username,
        });
      }

      router.push("/");
    } catch (error) {
      console.log(error.message);
    }

    // reset state
    setEmail("");
    setPassword("");
    setUsername("");
    setProfilePicture("");
    filePickerRef.current.value = "";
  };

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
              <div className="relative z-0 my-6">
                <EnvelopeIcon className="h-6 absolute top-3 right-1 text-white" />
                <input
                  type="text"
                  id="email"
                  className="block py-2.5 px-0 w-full text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-white focus:outline-none focus:ring-0 focus:border-white peer"
                  placeholder=" "
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <label
                  htmlFor="email"
                  className="absolute text-sm text-gray-700 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-white peer-focus:dark:text-white peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-100 peer-focus:-translate-y-6"
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <label
                  htmlFor="password"
                  className="absolute text-sm text-gray-700 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-white peer-focus:dark:text-white peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-100 peer-focus:-translate-y-6"
                >
                  HASŁO<span className="text-red-500">*</span>
                </label>
              </div>

              <div className="relative z-0 my-6">
                <UserIcon className="h-6 absolute top-3 right-1 text-white" />
                <input
                  type="text"
                  id="username"
                  className="block py-2.5 px-0 w-full text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-white focus:outline-none focus:ring-0 focus:border-white peer"
                  placeholder=" "
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <label
                  htmlFor="username"
                  className="absolute text-sm text-gray-700 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-white peer-focus:dark:text-white peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-100 peer-focus:-translate-y-6"
                >
                  NAZWA UŻYTKOWNIKA<span className="text-red-500">*</span>
                </label>
              </div>
              <div className="relative z-0 my-6">
                <PhotoIcon className="h-6 absolute top-3 right-1 text-white" />
                <input
                  type="file"
                  id="profile_picture"
                  className="block py-4 px-0 w-full text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-white focus:outline-none focus:ring-0 focus:border-white peer"
                  placeholder=" "
                  ref={filePickerRef}
                  onChange={(e) => setProfilePicture(e.target.files[0])}
                />
                <label
                  htmlFor="profile_picture"
                  className="absolute text-lg text-gray-700 -translate-y-6 scale-75 top-3 -z-10 origin-[0]"
                >
                  ZDJĘCIE PROFILOWE<span className="text-red-500">*</span>
                </label>
              </div>

              <button
                className="w-full h-11 rounded-3xl border-0 outline-none cursor-pointer text-xl font-bold bg-white"
                onClick={(e) => register(e)}
              >
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

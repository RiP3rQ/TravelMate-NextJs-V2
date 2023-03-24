import { XMarkIcon } from "@heroicons/react/24/solid";
import {
  EmailAuthProvider,
  onAuthStateChanged,
  reauthenticateWithCredential,
  updateEmail,
  updateProfile,
} from "firebase/auth";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useRouter } from "next/router";
import React, { useEffect, useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import CredentialPopup from "../../components/CredentialPopup";
import Header from "../../components/Header";
import { auth, storage } from "../../firebase";

const Profile = () => {
  const router = useRouter();
  // preview image
  const [preview, setPreview] = useState();
  // firebase state
  const [avatar, setAvatar] = useState();
  const [emailAddress, SetEmailAddress] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");

  //popup state
  const [popup, setPopup] = useState(false);
  const [credentials, setCredentials] = useState("");

  // dropzone variables
  const onDrop = useCallback((acceptedFiles) => {
    setPreview(URL.createObjectURL(acceptedFiles[0]));
    setAvatar(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  // get data about user
  useEffect(() => {
    if (!auth.currentUser) {
      router.push("/");
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      const avgImg = user.photoURL
        ? user.photoURL
        : "https://st3.depositphotos.com/1767687/16607/v/600/depositphotos_166074422-stock-illustration-default-avatar-profile-icon-grey.jpg";
      setAvatar(avgImg);
      SetEmailAddress(user.email);
      setDisplayName(user.displayName);
    });

    return () => unsubscribe();
  }, []);

  // get data from popup
  const changeDataWithCredentials = async () => {
    const user = auth.currentUser;

    // reauthenticate user
    const credential = EmailAuthProvider.credential(user.email, credentials);

    await reauthenticateWithCredential(user, credential)
      .then(async (e) => {
        try {
          // upload profile data with picture to Firebase storage if user has selected one
          if (preview) {
            const storageRef = ref(
              storage,
              `profileImages/${avatar + user.uid}`
            );
            await uploadBytesResumable(storageRef, avatar);

            // get download url
            const downloadUrl = await getDownloadURL(storageRef);

            // set user display name to username and avatar
            await updateProfile(user, {
              photoURL: downloadUrl,
            });
          } else {
          }

          if (displayName) {
            await updateProfile(user, {
              displayName: displayName,
            });
          }

          if (emailAddress) {
            await updateEmail(user, emailAddress);
          }
        } catch (error) {
          alert(error.message);
        }
      })
      .finally(() => {
        router.reload();
        setPopup(false);
      });
  };

  // change data
  const changeData = async (e) => {
    e.preventDefault();

    setPopup(true);
  };

  useEffect(() => {
    if (credentials) {
      changeDataWithCredentials();
    }
  }, [credentials]);

  return (
    <div className=" h-screen">
      {popup && (
        <CredentialPopup setPopup={setPopup} setCredentials={setCredentials} />
      )}
      <Header />
      <div className="flex flex-col max-w-7xl mx-auto mt-8">
        <div className=" w-full">
          <h1 className="text-4xl font-bold mb-6">Ustawienia Profilu:</h1>
        </div>
        <form action="" className="">
          {/* avatar */}
          <div className="relative z-0 my-8 w-full">
            <p
              htmlFor=""
              className="w-full text-sm text-gray-700 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-gray-700 peer-focus:dark:text-gray-700 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-100 peer-focus:-translate-y-6"
            >
              Avatar:
            </p>
            <div className="grid grid-cols-2 w-full">
              <div className="flex items-center justify-center">
                <img
                  src={preview ? preview : avatar}
                  alt={displayName}
                  fill
                  className="h-32 w-32 rounded-full"
                />
              </div>
              <div
                {...getRootProps()}
                className="h-full bg-slate-200 flex items-center justify-center border-4 border-dashed  border-red-400  "
              >
                <input {...getInputProps()} />
                {isDragActive ? (
                  <p>Upuść plik tutaj ...</p>
                ) : (
                  <p className="text-center">
                    Kliknij, aby dodać zdjęcie lub <br />
                    przeciągnij plik tutaj...
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* email */}
          <div className="relative z-0 my-8">
            <input
              type="text"
              id="email"
              className="block py-2.5 px-0 w-full text-lg text-gray-500 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-gray-400 focus:outline-none focus:ring-0 focus:border-gray-400 peer"
              placeholder=" "
              value={emailAddress}
              onChange={(e) => SetEmailAddress(e.target.value)}
            />
            <label
              htmlFor="email"
              className="absolute text-sm text-gray-700 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-gray-700 peer-focus:dark:text-gray-700 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-100 peer-focus:-translate-y-6"
            >
              EMAIL
            </label>
          </div>
          {/* displayName */}
          <div className="relative z-0 my-8">
            <input
              type="text"
              id="email"
              className="block py-2.5 px-0 w-full text-lg text-gray-500 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-gray-400 focus:outline-none focus:ring-0 focus:border-gray-400 peer"
              placeholder=" "
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
            <label
              htmlFor="email"
              className="absolute text-sm text-gray-700 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-gray-700 peer-focus:dark:text-gray-700 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-100 peer-focus:-translate-y-6"
            >
              NAZWA UŻYTKOWNIKA
            </label>
          </div>
          <div className="relative z-0 my-8 flex items-center justify-center">
            <button
              className="w-56 h-16 rounded-3xl border-0 outline-none cursor-pointer text-xl font-bold bg-red-400 text-white hover:bg-red-600 transition duration-300"
              onClick={(e) => changeData(e)}
            >
              Zmień dane
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;

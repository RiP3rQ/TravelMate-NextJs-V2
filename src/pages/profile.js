import { useRouter } from "next/router";
import React, { useEffect, useState, useCallback } from "react";
import CredentialPopup from "../../components/CredentialPopup";
import Header from "../../components/Header";
import { useFormik } from "formik";
import * as Yup from "yup";
import { signOut, useSession } from "next-auth/react";
import { CldUploadWidget } from "next-cloudinary";
import axios from "axios";
import { toast } from "react-hot-toast";

// password validation
const passwordRules = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}$/;
// min 6 characters, at least one uppercase letter, one lowercase letter and one number

// validation schema
const validationSchemaData = Yup.object({
  emailAddress: Yup.string()
    .email("Niepoprawny adres email")
    .required("Pole wymagane"),
  displayName: Yup.string()
    .min(3, "Nazwa użytkownika musi mieć conajmniej 3 znaki")
    .required("Pole wymagane"),
});

// validation schema
const validationSchemaPassword = Yup.object({
  password: Yup.string()
    .min(6, "Hasło musi mieć conajmniej 6 znaków")
    .matches(
      passwordRules,
      "Hasło musi zawierać conajmniej jedną dużą literę, jedną małą literę i jedną cyfrę"
    )
    .required("Pole wymagane"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Hasła muszą być takie same")
    .required("Pole wymagane"),
});

const Profile = () => {
  const router = useRouter();
  const { data: session } = useSession();
  // firebase state
  const [avatar, setAvatar] = useState(
    "https://st3.depositphotos.com/1767687/16607/v/600/depositphotos_166074422-stock-illustration-default-avatar-profile-icon-grey.jpg"
  );
  // preview image
  const [preview, setPreview] = useState();
  // form info data (1 form)
  const {
    values,
    handleBlur,
    handleChange,
    handleSubmit,
    errors,
    touched,
    isSubmitting,
    setFieldValue,
    setSubmitting,
  } = useFormik({
    initialValues: {
      emailAddress: "",
      displayName: "",
    },
    validationSchema: validationSchemaData,
    onSubmit: () => {
      changeData();
    },
  });
  // form info data (2 form)
  const {
    values: values2,
    handleBlur: handleBlur2,
    handleChange: handleChange2,
    handleSubmit: handleSubmit2,
    errors: errors2,
    touched: touched2,
    isSubmitting: isSubmitting2,
    setSubmitting: setSubmitting2,
  } = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validationSchema: validationSchemaPassword,
    onSubmit: () => {
      changePasswordHandle();
    },
  });

  //popup state
  const [popup, setPopup] = useState(false);
  const [credentials, setCredentials] = useState("");
  const [changeProfile, setChangeProfile] = useState(false);
  const [changePassword, setChangePassword] = useState(false);

  // change profile data
  const changeDataWithCredentials = async (values) => {
    const { displayName, emailAddress } = values;

    if (preview) {
      axios
        .post("/api/auth/update", {
          credentials: credentials,
          name: displayName,
          newEmail: emailAddress,
          oldEmail: session.user.email,
          image: avatar,
        })
        .then(() => {
          toast.success("Zmieniono dane");
          signOut();
          router.push("/login");
        })
        .catch((err) => {
          toast.error("Wystąpił błąd");
        })
        .finally(() => {
          setPopup(false);
          setCredentials("");
          setChangeProfile(false);
          setSubmitting(false);
        });
    }

    if (!preview) {
      axios
        .post("/api/auth/update", {
          credentials: credentials,
          name: displayName,
          newEmail: emailAddress,
          oldEmail: session.user.email,
        })
        .then(() => {
          toast.success("Zmieniono dane");
          signOut();
          router.push("/login");
        })
        .catch((err) => {
          toast.error("Wystąpił błąd");
        })
        .finally(() => {
          setPopup(false);
          setCredentials("");
          setChangeProfile(false);
          setSubmitting(false);
        });
    }
  };

  // change password
  const changePasswordWithCredentials = async (values2) => {
    const { password: newPassword } = values2;

    axios
      .post("/api/auth/updatePassword", {
        credentials: credentials,
        newPassword: newPassword,
        email: session.user.email,
      })
      .then(() => {
        toast.success("Zmieniono hasło");
        signOut();
        router.push("/login");
      })
      .catch((err) => {
        toast.error("Wystąpił błąd");
      })
      .finally(() => {
        setPopup(false);
        setCredentials("");
        setChangePassword(false);
        setSubmitting2(false);
      });
  };

  // change data
  const changeData = () => {
    setPopup(true);
    setChangeProfile(true);
  };

  // change password
  const changePasswordHandle = () => {
    setPopup(true);
    setChangePassword(true);
  };

  useEffect(() => {
    if (credentials && changeProfile) {
      changeDataWithCredentials(values);
    }

    if (credentials && changePassword) {
      changePasswordWithCredentials(values2);
    }
  }, [credentials]);

  // set initial values
  useEffect(() => {
    if (session) {
      setFieldValue("emailAddress", session.user.email);
      setFieldValue("displayName", session.user.name);
      if (session.user.image) {
        setAvatar(session.user.image);
      }
    }
  }, [session]);

  // upload image
  const uploadImage = useCallback(
    (file) => {
      setAvatar(file.info.secure_url);
      setPreview(file.info.secure_url);
    },
    [setAvatar, setPreview]
  );

  // check if user is logged in
  useEffect(() => {
    if (session === undefined || session === null) {
      router.push("/login");
    }
  }, [session]);

  console.log(session);

  return (
    <div className=" h-screen">
      {popup && (
        <CredentialPopup setPopup={setPopup} setCredentials={setCredentials} />
      )}
      <Header />
      <div className="flex flex-col max-w-7xl mx-auto mt-4">
        <div className=" w-full">
          <h1 className="text-4xl font-bold mb-6">Ustawienia Profilu:</h1>
        </div>
        {/* avatar, email, username */}
        <form onSubmit={handleSubmit}>
          {/* avatar */}
          <div className="relative z-0 my-8 w-full">
            <p
              htmlFor=""
              className="w-full text-sm text-gray-700 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-gray-700 peer-focus:dark:text-gray-700 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-100 peer-focus:-translate-y-6"
            >
              AVATAR:
            </p>
            <div className="grid grid-cols-2 w-full">
              <div className="flex items-center justify-center">
                <img
                  src={preview ? preview : avatar}
                  alt="avatar"
                  className="h-32 w-32 rounded-full"
                />
              </div>

              <CldUploadWidget
                onUpload={uploadImage}
                uploadPreset="places-uplouds"
                options={{
                  maxFiles: 1,
                }}
              >
                {({ open }) => {
                  return (
                    <div
                      className="h-full bg-slate-200 flex items-center justify-center border-4 border-dashed border-[#3F9337] cursor-pointer"
                      onClick={() => open?.()}
                    >
                      <p className="text-center">Kliknij, aby dodać zdjęcie</p>
                    </div>
                  );
                }}
              </CldUploadWidget>
            </div>
          </div>

          {/* email */}
          <div className="relative z-0 my-8">
            <input
              type="text"
              id="emailAddress"
              className="block py-2.5 px-0 w-full text-lg text-gray-500 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-gray-400 focus:outline-none focus:ring-0 focus:border-gray-400 peer"
              placeholder=" "
              value={values.emailAddress}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <label
              htmlFor="emailAddress"
              className="absolute text-sm text-gray-700 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-gray-700 peer-focus:dark:text-gray-700 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-100 peer-focus:-translate-y-6"
            >
              EMAIL
            </label>
            {errors.emailAddress && touched.emailAddress ? (
              <p className="text-red-500 text-sm font-bold absolute">
                {errors.emailAddress}
              </p>
            ) : (
              " "
            )}
          </div>
          {/* displayName */}
          <div className="relative z-0 my-8">
            <input
              type="text"
              id="displayName"
              className="block py-2.5 px-0 w-full text-lg text-gray-500 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-gray-400 focus:outline-none focus:ring-0 focus:border-gray-400 peer"
              placeholder=" "
              value={values.displayName}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <label
              htmlFor="displayName"
              className="absolute text-sm text-gray-700 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-gray-700 peer-focus:dark:text-gray-700 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-100 peer-focus:-translate-y-6"
            >
              NAZWA UŻYTKOWNIKA
            </label>
            {errors.displayName && touched.displayName ? (
              <p className="text-red-500 text-sm font-bold absolute">
                {errors.displayName}
              </p>
            ) : (
              " "
            )}
          </div>
          <div className="relative z-0 my-8 flex items-center justify-center">
            <button
              className="w-56 h-16 rounded-3xl border-0 outline-none cursor-pointer text-xl font-bold bg-[#3F9337] text-white hover:bg-green-900 transition duration-300 disabled:bg-gray-300 disabled:text-white"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? "ZMIENIAM DANE" : "Zmień dane"}
            </button>
          </div>
        </form>

        {/* change password */}
        <form onSubmit={handleSubmit2}>
          <div className="relative z-0 my-8">
            <input
              type="password"
              id="password"
              className="block py-2.5 px-0 w-full text-lg text-gray-500 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-gray-400 focus:outline-none focus:ring-0 focus:border-gray-400 peer"
              placeholder=" "
              value={values2.password}
              onChange={handleChange2}
              onBlur={handleBlur2}
            />
            <label
              htmlFor="password"
              className="absolute text-sm text-gray-700 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-gray-700 peer-focus:dark:text-gray-700 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-100 peer-focus:-translate-y-6"
            >
              NOWE HASŁO
            </label>
            {errors2.password && touched2.password ? (
              <p className="text-red-500 text-sm font-bold absolute">
                {errors2.password}
              </p>
            ) : (
              " "
            )}
          </div>
          {/* displayName */}
          <div className="relative z-0 my-8">
            <input
              type="password"
              id="confirmPassword"
              className="block py-2.5 px-0 w-full text-lg text-gray-500 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-gray-400 focus:outline-none focus:ring-0 focus:border-gray-400 peer"
              placeholder=" "
              value={values2.confirmPassword}
              onChange={handleChange2}
              onBlur={handleBlur2}
            />
            <label
              htmlFor="confirmPassword"
              className="absolute text-sm text-gray-700 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-gray-700 peer-focus:dark:text-gray-700 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-100 peer-focus:-translate-y-6"
            >
              POWTÓRZ HASŁO
            </label>
            {errors2.confirmPassword && touched2.confirmPassword ? (
              <p className="text-red-500 text-sm font-bold absolute">
                {errors2.confirmPassword}
              </p>
            ) : (
              " "
            )}
          </div>
          <div className="relative z-0 my-8 flex items-center justify-center">
            <button
              className="w-56 h-16 rounded-3xl border-0 outline-none cursor-pointer text-xl font-bold bg-[#3F9337] text-white hover:bg-green-900 transition duration-300 disabled:bg-gray-300 disabled:text-white"
              disabled={isSubmitting2}
              type="submit"
            >
              {isSubmitting2 ? "ZMIENIAM HASŁO" : "Zmień hasło"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;

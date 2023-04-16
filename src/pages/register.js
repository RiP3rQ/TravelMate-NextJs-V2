import {
  EnvelopeIcon,
  LockClosedIcon,
  PhotoIcon,
  UserIcon,
} from "@heroicons/react/24/solid";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useState, useRef, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useSession } from "next-auth/react";

// password validation
const passwordRules = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}$/;
// min 6 characters, at least one uppercase letter, one lowercase letter and one number

// validation schema
const validationSchema = Yup.object({
  email: Yup.string()
    .email("Niepoprawny adres email")
    .required("Pole wymagane"),
  password: Yup.string()
    .min(6, "Hasło musi mieć conajmniej 6 znaków")
    .matches(
      passwordRules,
      "Hasło musi zawierać conajmniej jedną dużą literę, jedną małą literę i jedną cyfrę"
    )
    .required("Pole wymagane"),
  username: Yup.string()
    .min(3, "Nazwa użytkownika musi mieć conajmniej 3 znaki")
    .required("Pole wymagane"),
});

const Register = () => {
  const router = useRouter();
  const { data: session } = useSession();

  // form info
  const {
    values,
    handleBlur,
    handleChange,
    handleSubmit,
    errors,
    touched,
    isSubmitting,
  } = useFormik({
    initialValues: {
      email: "",
      password: "",
      username: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values, actions) => {
      actions.setSubmitting(true);
      register(values, actions);
    },
  });

  // register user using firebase
  const register = async (values, actions) => {
    axios
      .post("/api/auth/register", values)
      .then(() => {
        router.push("/login");
        toast.success("Użytkownik został zarejestrowany");
        actions.setSubmitting(false);
      })
      .catch((err) => {
        toast.error("Nie udało się zarejestrować użytkownika");
        actions.setSubmitting(false);
      });
  };

  const goBack = () => {
    router.push("/");
  };

  useEffect(() => {
    if (session !== undefined && session !== null) {
      router.push("/");
    }
  }, [session]);

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
          <div
            className="absolute -top-32 cursor-pointer h-28 w-96 flex items-center justify-center "
            onClick={goBack}
          >
            <Image
              src="/assets/logo.png"
              alt="logo"
              fill
              style={{ objectFit: "cover" }}
              className=" rounded-3xl"
            />
          </div>
          <div className="w-full mx-6">
            {/* FORM */}
            <form onSubmit={handleSubmit}>
              <h2 className="text-5xl text-center text-white mb-8">
                Rejestracja
              </h2>
              <div className="relative z-0 my-8">
                <EnvelopeIcon className="h-6 absolute top-3 right-1 text-white" />
                <input
                  type="text"
                  id="email"
                  className={`block py-2.5 px-0 w-full text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-white focus:outline-none focus:ring-0 focus:border-white peer ${
                    errors.email && touched.email && "border-red-500"
                  }`}
                  placeholder=" "
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <label
                  htmlFor="email"
                  className="absolute text-sm text-gray-700 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-white peer-focus:dark:text-white peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-100 peer-focus:-translate-y-6"
                >
                  EMAIL<span className="text-red-500">*</span>
                </label>
                {errors.email && touched.email ? (
                  <p className="text-red-500 text-sm font-bold absolute">
                    {errors.email}
                  </p>
                ) : (
                  " "
                )}
              </div>

              <div className="relative z-0 my-8">
                <LockClosedIcon className="h-6 absolute top-3 right-1 text-white" />
                <input
                  type="password"
                  id="password"
                  className={`block py-2.5 px-0 w-full text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-white focus:outline-none focus:ring-0 focus:border-white peer ${
                    errors.password && touched.password && "border-red-500"
                  }`}
                  placeholder=" "
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <label
                  htmlFor="password"
                  className="absolute text-sm text-gray-700 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-white peer-focus:dark:text-white peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-100 peer-focus:-translate-y-6"
                >
                  HASŁO<span className="text-red-500">*</span>
                </label>
                {errors.password && touched.password ? (
                  <p className="text-red-500 text-sm font-bold absolute">
                    {errors.password}
                  </p>
                ) : (
                  " "
                )}
              </div>

              <div className="relative z-0 my-8">
                <UserIcon className="h-6 absolute top-3 right-1 text-white" />
                <input
                  type="text"
                  id="username"
                  className={`block py-2.5 px-0 w-full text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-white focus:outline-none focus:ring-0 focus:border-white peer ${
                    errors.username && touched.username && "border-red-500"
                  }`}
                  placeholder=" "
                  value={values.username}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <label
                  htmlFor="username"
                  className="absolute text-sm text-gray-700 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-white peer-focus:dark:text-white peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-100 peer-focus:-translate-y-6"
                >
                  NAZWA UŻYTKOWNIKA<span className="text-red-500">*</span>
                </label>
                {errors.username && touched.username ? (
                  <p className="text-red-500 text-sm font-bold absolute">
                    {errors.username}
                  </p>
                ) : (
                  " "
                )}
              </div>

              <button
                className="w-full h-11 rounded-3xl border-0 outline-none cursor-pointer text-xl font-bold bg-white disabled:bg-gray-300 disabled:text-white"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "REJESTRUJE" : "Zarejestruj"}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Register;

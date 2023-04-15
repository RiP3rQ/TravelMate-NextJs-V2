import { EnvelopeIcon, LockClosedIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import { useRouter } from "next/router";
import { useFormik } from "formik";
import * as Yup from "yup";
import { signIn } from "next-auth/react";
import { toast } from "react-hot-toast";

// password validation
const passwordRules = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}$/;
// min 6 characters, at least one uppercase letter, one lowercase letter and one number

// validation schema
const validationSchemaData = Yup.object({
  loginEmail: Yup.string()
    .email("Niepoprawny adres email")
    .required("Pole wymagane"),
  loginPassword: Yup.string()
    .min(6, "Hasło musi mieć conajmniej 6 znaków")
    .matches(
      passwordRules,
      "Hasło musi zawierać conajmniej jedną dużą literę, jedną małą literę i jedną cyfrę"
    )
    .required("Pole wymagane"),
});

const Login = () => {
  // form info data
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
      loginEmail: "",
      loginPassword: "",
    },
    validationSchema: validationSchemaData,
    onSubmit: (values, actions) => {
      actions.setSubmitting(true);
      loginHandle(values, actions);
    },
  });
  const router = useRouter();

  const goBack = () => {
    router.push("/");
  };

  const goRegister = () => {
    router.push("/register");
  };

  const loginHandle = async (values, actions) => {
    signIn("credentials", {
      email: values.loginEmail,
      password: values.loginPassword,
      redirect: false,
    }).then((callback) => {
      if (callback?.ok) {
        toast.success("Zalogowano pomyślnie");
        router.push("/");
        actions.setSubmitting(false);
        actions.resetForm();
      }

      if (callback?.error) {
        toast.error("Nie udało się zalogować");
        actions.setSubmitting(false);
      }
    });
  };

  console.log(isSubmitting);

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
          <div
            className="absolute -top-32 cursor-pointer h-28 w-full flex items-center justify-center "
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
          <div className="">
            {/* FORM */}
            <form onSubmit={handleSubmit}>
              <h2 className="text-5xl text-center text-white my-8">
                Logowanie
              </h2>
              <div className="relative z-0 my-8">
                <EnvelopeIcon className="h-6 absolute top-3 right-1 text-white" />
                <input
                  type="text"
                  id="loginEmail"
                  className="block py-2.5 px-0 w-full text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-white focus:outline-none focus:ring-0 focus:border-white peer"
                  placeholder=" "
                  value={values.loginEmail}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <label
                  htmlFor="loginEmail"
                  className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-white peer-focus:dark:text-white peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-100 peer-focus:-translate-y-6"
                >
                  EMAIL<span className="text-red-500">*</span>
                </label>
                {errors.loginEmail && touched.loginEmail ? (
                  <p className="text-red-500 text-sm font-bold absolute">
                    {errors.loginEmail}
                  </p>
                ) : (
                  " "
                )}
              </div>

              <div className="relative z-0 my-12">
                <LockClosedIcon className="h-6 absolute top-3 right-1 text-white" />
                <input
                  type="password"
                  id="loginPassword"
                  className="block py-2.5 px-0 w-full text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-white focus:outline-none focus:ring-0 focus:border-white peer"
                  placeholder=" "
                  value={values.loginPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <label
                  htmlFor="loginPassword"
                  className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-white peer-focus:dark:text-white peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-100 peer-focus:-translate-y-6"
                >
                  HASŁO<span className="text-red-500">*</span>
                </label>
                {errors.loginPassword && touched.loginPassword ? (
                  <p className="text-red-500 text-sm font-bold absolute">
                    {errors.loginPassword}
                  </p>
                ) : (
                  " "
                )}
              </div>
              <button
                className="w-full h-11 rounded-3xl border-0 outline-none cursor-pointer text-xl font-bold bg-white disabled:bg-gray-300 disabled:text-white"
                disabled={isSubmitting}
                type="submit"
              >
                {isSubmitting ? "LOGOWANIE" : "Zaloguj"}
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

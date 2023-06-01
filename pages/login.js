import React, { useEffect, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { auth } from "../firebase/firebase.js";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { useAuthContext } from "@/firebase/auth.js";
import { useRouter } from "next/router.js";
import Loader from "@/components/Loader.jsx";
import Link from "next/link.js";

const provider = new GoogleAuthProvider();

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [warn, setWarn] = useState("");

  const { authUser, isLoading } = useAuthContext()();

  const router = useRouter();
  useEffect(() => {
    if (authUser && !isLoading) {
      router.push("/");
    }
  }, [authUser, isLoading]);

  const signInWithGoogle = async () => {
    await signInWithPopup(auth, provider)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        setWarn("Logged in");
        // console.log(userCredential);
        // console.log(user);
      })
      .catch((error) => {
        let errorCode = error.code;
        errorCode = errorCode.replaceAll("-", " ");
        const errorMsg = errorCode.split("/");
        const str = errorMsg[1].charAt(0).toUpperCase() + errorMsg[1].slice(1);
        setWarn(str);
      });
    setTimeout(() => {
      setWarn("");
    }, 1000 * 2);
  };

  const loginHandler = async () => {
    if (!email || !password) return;

    await signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        // console.log(userCredential);
        //   console.log(user);
      })
      .catch((error) => {
        let errorCode = error.code;
        errorCode = errorCode.replaceAll("-", " ");
        const errorMsg = errorCode.split("/");
        const str = errorMsg[1].charAt(0).toUpperCase() + errorMsg[1].slice(1);
        setWarn(str);
      });
    setTimeout(() => {
      setWarn("");
    }, 1000 * 2);
  };

  // return (
    return isLoading || (authUser && !isLoading) ? (
      <Loader />
    ) : (
    <main className="flex lg:h-[100vh]">
      <div className="w-full lg:w-[60%] p-8 md:p-14 flex items-center justify-center lg:justify-start">
        <div className="p-8 w-[600px]">
          <h1 className="text-6xl font-semibold">Login</h1>
          <p className="mt-6 ml-1">
            Don't have an account ?{" "}
            <Link
              href="/register"
              className="underline hover:text-blue-400 cursor-pointer"
            >
              Sign Up
            </Link>
          </p>

          <div
            className="bg-black/[0.05] text-white w-full py-4 mt-10 rounded-full transition-transform hover:bg-black/[0.8] active:scale-90 flex justify-center items-center gap-4 cursor-pointer group"
            onClick={signInWithGoogle}
          >
            <FcGoogle size={22} />
            <span className="font-medium text-black group-hover:text-white">
              Login with Google
            </span>
          </div>
          <div className="flex h-[20px] justify-center items-center warn">
          <h2 className="font-medium h-0 text-red-500" >{warn}</h2>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <div className="mt-10 pl-1 flex flex-col">
              <label>Email</label>
              <input
                type="text"
                className="font-medium border-b border-black p-4 outline-0 focus-within:border-blue-400"
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                required
              />
            </div>
            <div className="mt-10 pl-1 flex flex-col">
              <label>Password</label>
              <input
                type="password"
                className="font-medium border-b border-black p-4 outline-0 focus-within:border-blue-400"
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                required
              />
            </div>
            <button
              className="bg-black text-white w-44 py-4 mt-10 rounded-full transition-transform hover:bg-black/[0.8] active:scale-90"
              onClick={loginHandler}
            >
              Sign in
            </button>
          </form>
        </div>
      </div>
      <div
        className="w-[40%] bg-slate-400 bg-cover bg-right-top hidden lg:block"
        style={{
          backgroundImage: "url('/login-banner.jpg')",
        }}
      ></div>
    </main>
  );
};

export default LoginForm;

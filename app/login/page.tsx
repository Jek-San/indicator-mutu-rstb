"use client";
import React, { useState } from "react";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const Login: React.FC = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [mutating, setMutating] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMutating(true);

    const res = await fetch(`${apiUrl}/simrs_auth/login.php`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    if (res.ok) {
      const data = await res.json();
      document.cookie = `isLoggedIn=true; path=/;`;
      document.cookie = `unit_id=${data.unit_id}; path=/;`;
      document.cookie = `isAdmin=${data.is_admin}; path=/;`;
      document.cookie = `userName=${data.userName}; path=/;`;
      setUsername("");
      setPassword("");
      toast.message("Login successful");
      setMessage("Login successful");
      setMutating(false);
      window.location.reload();
    } else {
      console.log(res.json());
      toast.error("Pastikan Username dan Password Anda Benar");
      setMessage("Login Failed");
    }
  };

  return (
    <>
      <Head>
        <title>RSTB | MUTU</title>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, user-scalable=0, minimal-ui"
        />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <link
          rel="icon"
          href="/assets/images/favicon.ico"
          type="image/x-icon"
        />
      </Head>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-400 to-indigo-600 text-black">
        <div className="w-full max-w-4xl p-8 bg-white shadow-2xl rounded-2xl flex">
          <div className="w-1/2 flex justify-center items-center">
            <Image
              src="/assets/images/light.png"
              alt="Logo"
              width={300}
              height={300}
              className="rounded-full shadow-lg"
            />
          </div>
          <div className="w-1/2 p-8 flex flex-col justify-center">
            <div className="text-center mb-6">
              <h3 className="text-3xl font-bold text-gray-800">
                Penilaian MUTU RS Telaga Bunda
              </h3>
            </div>
            <hr className="my-4 border-gray-200" />
            <h3 className="text-lg font-medium text-gray-700 text-center mb-4">
              Sign in
            </h3>
            <form
              onSubmit={handleSubmit}
              autoComplete="off"
              className="space-y-6"
            >
              <div className="relative">
                <label htmlFor="usn" className="sr-only">
                  Email address / Username
                </label>
                <input
                  type="text"
                  id="usn"
                  name="usn"
                  placeholder="Email address / Username"
                  className="w-full bg-white px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="relative">
                <label htmlFor="pas" className="sr-only">
                  Password
                </label>
                <input
                  type="password"
                  id="pas"
                  name="pas"
                  placeholder="Password"
                  className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="flex justify-between items-center">
                <a href="#" className="text-sm text-blue-500 hover:underline">
                  Forgot Password?
                </a>
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full px-4 py-2 text-white bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg shadow-lg hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Sign In
                </button>
              </div>
              {message && (
                <div id="msg" className="mt-2 text-green-500 text-center">
                  {message}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;

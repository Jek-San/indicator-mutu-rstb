"use client";
import React, { useState, useEffect } from "react";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/navigation";
import SelectUnit from "./selectUnit"; //

type Option = {
  id: number;
  name: string;
};

const SignUp: React.FC = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [unit, setUnit] = useState<Option | null>(null);
  const [units, setUnits] = useState<Option[]>([]);
  const [message, setMessage] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    // Fetch units from the server
    const fetchUnits = async () => {
      const res = await fetch(`${apiUrl}/simrs_unit/`);
      const data = await res.json();
      setUnits(data);
    };
    fetchUnits();
  }, []);

  useEffect(() => {
    // Fetch units from the server
    console.log(unit);
  }, [unit]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Simulate successful login and set cookie
    const res = await fetch(`${apiUrl}/simrs_auth/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password, unit_id: unit?.id }),
    });

    if (res.ok) {
      console.log("Account created successfully");
      setUsername("");
      setPassword("");
      setUnit(null);
      router.push("/");
      setMessage("Account created successfully");
    } else {
      setMessage("Username already exists");
      console.error("Error creating account:", res.statusText);
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-400 to-indigo-600">
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
              Sign Up
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="relative">
                <label htmlFor="unit" className="sr-only">
                  Select Unit
                </label>
                <SelectUnit options={units} value={unit} onChange={setUnit} />
              </div>
              <div className="flex justify-between items-center">
                <a
                  href="#"
                  className="text-sm text-blue-500 hover:underline"
                ></a>
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full px-4 py-2 text-white bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg shadow-lg hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Sign Up
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

export default SignUp;

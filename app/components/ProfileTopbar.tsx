"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import nookies from "nookies";

type Props = {};

export default function ProfileTopbar({}: Props) {
  const [userName, setUserName] = useState<string | null>(null);
  useEffect(() => {
    const cookies = nookies.get(null);
    const userName = cookies.userName;
    setUserName(userName);
    console.log(userName);
  }, []);
  return (
    <div className="flex items-center space-x-4">
      {userName && (
        <Image
          src="/assets/images/anon.png" // Update this to the path of your profile image
          alt="Profile"
          width={40}
          height={40}
          className="rounded-full shadow-lg bg-slate-200"
        />
      )}
      <div className="text-white">
        {userName ? (
          <>
            <p className="text-lg font-semibold">{userName}</p>
            <p className="text-sm text-gray-400">Kanit</p>
          </>
        ) : (
          <>
            <p className="text-lg font-semibold"></p>
            <p className="text-sm text-gray-400"></p>
          </>
        )}
      </div>
    </div>
  );
}

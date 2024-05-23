import Link from "next/link";
import React from "react";
import Image from "next/image";
import TextUnit from "./components/TextUnit";
import ProfileTopbar from "./components/ProfileTopbar";

type Props = {};

export default function Topbar({}: Props) {
  return (
    <>
      {/* Topbar content goes here */}
      <Link href={"/home"}>
        <Image
          src="/assets/images/light.png"
          alt="Logo"
          width={50}
          height={50}
          className="rounded-full shadow-lg bg-white"
        />
      </Link>
      <TextUnit />
      <ProfileTopbar />
    </>
  );
}

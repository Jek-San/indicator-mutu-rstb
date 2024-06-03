import React from "react";

type Props = {};

export default function LogOutIcon({}: Props) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12" cy="12" r="12" fill="#F44336" />
      <path d="M14 7L19 12L14 17V13H8V11H14V7Z" fill="white" />
      <path d="M4 4H10V6H6V18H10V20H4V4Z" fill="white" />
    </svg>
  );
}

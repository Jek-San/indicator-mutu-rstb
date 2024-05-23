import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Props = {
  onToggle: (expanded: boolean) => void;
};

export default function Sidebar({ onToggle }: Props) {
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    onToggle(expanded);
  }, [expanded, onToggle]);

  const menuItems = [
    // { label: "Units", href: "/units" },
    { label: "Tambah Menu", href: "/menus" },
    { label: "Tambah Indicator", href: "/indicators" },
    // { label: "Monthly Data", href: "/monthlydata" },
  ];

  return (
    <div
      className={`fixed top-0 left-0 h-full w-16 bg-gray-900 text-white p-2 shadow-lg transition-all duration-300 ${
        expanded ? "w-64" : ""
      }`}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      <div className="flex items-center justify-center cursor-pointer">
        <div className="w-8 h-8 bg-white rounded-full"></div>
      </div>
      <ul className="mt-10    space-y-4">
        {menuItems.map((item) => (
          <li key={item.href} className="group flex items-center">
            <Link href={item.href}>
              <div className=" py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer flex items-center">
                <div className="w-6 h-6 bg-white rounded-full"></div>
                <span
                  className={`${expanded ? "inline-block" : "hidden"} ml-2`}
                >
                  {item.label}
                </span>
              </div>
            </Link>
          </li>
        ))}
        <li className="group mt-8">
          <div
            onClick={() => {
              document.cookie = "isLoggedIn=false; path=/";
              document.cookie = "unit_id=; path=/";
              document.cookie = "isAdmin=; path=/";
              document.cookie = "userName=; path=/";
              window.location.reload();
              router.refresh();
            }}
            className="py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer flex items-center"
          >
            <div className="flex items-center justify-center">
              <div className="w-6 h-6 bg-white rounded-full"></div>
              <span className={`${expanded ? "inline-block" : "hidden"} ml-2`}>
                Sign Out
              </span>
            </div>
          </div>
        </li>
      </ul>
    </div>
  );
}

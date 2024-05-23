"use client";
import React, { useState, useEffect } from "react";
import nookies from "nookies";
import Sidebar from "./sidebar";
import Topbar from "./topbar";

interface ClientSideRenderProps {
  children: React.ReactNode;
}

const ClientSideRender: React.FC<ClientSideRenderProps> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  useEffect(() => {
    // Read the cookie value using nookies
    const cookies = nookies.get(null);
    if (cookies.isLoggedIn === "true") {
      setIsLoggedIn(true);
    }
  }, [isLoggedIn]);

  const handleSidebarToggle = (expanded: boolean) => {
    setSidebarExpanded(expanded);
  };

  return (
    <>
      {isLoggedIn && (
        <div className="sidebar fixed top-0 left-0 flex flex-col justify-between h-full">
          <Sidebar onToggle={handleSidebarToggle} />
        </div>
      )}
      <div className="topbar bg-gray-800 p-4 flex justify-between items-center shadow-md fixed w-full z-10">
        <Topbar />
      </div>
      <div
        className={`flex ${
          isLoggedIn ? (sidebarExpanded ? "ml-64 pt-16" : "ml-16 pt-16") : ""
        } bg-slate-600 text-white min-h-screen min-w-screen transition-all duration-300`}
      >
        <div className="w-full">{children}</div>
      </div>
    </>
  );
};

export default ClientSideRender;

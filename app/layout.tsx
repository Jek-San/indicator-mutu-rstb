// RootLayout.tsx
import React from "react";
import "./globals.css";
import ClientSideRender from "./clientSideLayout";

export const metadata = {
  icons: {
    icon: "/assets/images/light.png",
  },
  title: "RSTB | Penilaian Indikator Mutu",
};

const RootLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <html lang="en">
      <head>{/* Additional meta tags can be added here */}</head>
      <body className="bg-gray-900 text-white font-sans h-full">
        <ClientSideRender>{children}</ClientSideRender>
      </body>
    </html>
  );
};

export default RootLayout;

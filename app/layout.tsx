// RootLayout.tsx
import React from "react";
import "./globals.css";
import ClientSideRender from "./clientSideLayout";
import { Toaster } from "sonner";

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
      <body className="bg-gray-900 text-black font-sans h-full">
        <ClientSideRender>{children}</ClientSideRender>
        <Toaster richColors />
      </body>
    </html>
  );
};

export default RootLayout;

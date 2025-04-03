import Navbar from "@/components/Navbar";
import React from "react";
import { SidebarDemo } from "@/components/SideBar";

interface RootLayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
  return (
    <SidebarDemo
      children={
        <div className="flex flex-col overflow-auto w-full">
          <Navbar />
          {children}
        </div>
      }
    />
  );
}

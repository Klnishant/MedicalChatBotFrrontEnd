"use client";
import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import {
  IconArrowLeft,
  IconBrandTabler,
  IconSettings,
  IconUserBolt,
  IconHomeMove,
} from "@tabler/icons-react";
import Link from "next/link";
import { motion } from "motion/react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import ChatbotPage from "./Chat";

interface RootLayoutProps {
  children: React.ReactNode;
}

export function SidebarDemo({children}: RootLayoutProps) {
    const links = [
      {
        label: "Home",
        href: "/",
        icon: (
          <IconHomeMove className="h-5 w-5 shrink-0 text-white" />
        ),
      },
      {
        label: "Consult With Image",
        href: "/analyse",
        icon: (
          <IconUserBolt className="h-5 w-5 shrink-0 text-white" />
        ),
      },
    ];
    const [open, setOpen] = useState(false);
    return (
      <div
        className={cn(
          " flex flex-1 flex-col overflow-hidden w-full max-w-screen bg-gray-800 md:flex-row",
          "h-screen", // for your use case, use `h-screen` instead of `h-[60vh]`
        )}
      >
        <Sidebar open={open} setOpen={setOpen} >
          <SidebarBody className="justify-between gap-10 h-157 bg-gray-700 text-white">
            <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
              {open ? <Logo /> : <LogoIcon />}
              <div className="mt-8 flex flex-col gap-2">
                {links.map((link, idx) => (
                  <SidebarLink key={idx} link={link} className="text-white" />
                ))}
              </div>
            </div>
            <div>
              <SidebarLink
                link={{
                  label: "Manu Arora",
                  href: "#",
                  icon: (
                    <Image
                      src="https://assets.aceternity.com/manu.png"
                      className="h-7 w-7 shrink-0 rounded-full"
                      width={50}
                      height={50}
                      alt="Avatar"
                    />
                  ),
                }}
              />
            </div>
          </SidebarBody>
        </Sidebar>
        {children}
      </div>
    );
  }
  export const Logo = () => {
    return (
      <Link
        href="#"
        className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-white"
      >
        <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-black" />
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="font-medium whitespace-pre text-white"
        >
          Acet Labs
        </motion.span>
      </Link>
    );
  };
  export const LogoIcon = () => {
    return (
      <div></div>
    );
  };
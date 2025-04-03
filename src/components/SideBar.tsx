"use client";
import React, { useEffect, useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import {
  IconHomeMove,
  IconRefreshDot,
  IconHistory,
  IconUser,
  IconLogin2,
  IconLogin,
  IconLogout,
  IconTrash,
} from "@tabler/icons-react";
import Link from "next/link";
import { motion } from "motion/react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import imageLogo from "@/media/image/logo.png";
import axios from "axios";
import chatBotImage from "@/media/image/chatbot.png";
import { signOut, useSession } from "next-auth/react";
import { User } from "next-auth";
import router from "next/router";

interface RootLayoutProps {
  children: React.ReactNode;
}

export function SidebarDemo({ children }: RootLayoutProps) {
  const { data: session } = useSession();
  const user: User = session?.user as User;
  const links = [
    {
      label: "Consult With Image",
      href: `${user ? "/analyse" : "/sign-in"}`,
      icon: (
        <Image
          src={`${imageLogo.src}`}
          alt=""
          width={40}
          height={40}
          className="h-7 w-7 shrink-0"
        />
      ),
    },
    {
      label: "Chat With Us",
      href: `${user ? "/chat" : "/sign-in"}`,
      icon: (
        <Image
          src={`${chatBotImage.src}`}
          alt=""
          width={40}
          height={40}
          className=" shrink-0"
        />
      ),
    },
  ];
  const [open, setOpen] = useState(false);
  return (
    <div
      className={cn(
        " flex flex-1 flex-col overflow-hidden w-full max-w-screen bg-gray-800 md:flex-row",
        "h-screen" // for your use case, use `h-screen` instead of `h-[60vh]`
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10 bg-gray-900 md:bg-gray-700 text-white">
          <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} className="text-white" />
              ))}
            </div>
            <div>
              {user || session ? (
                <>
                  <div>
                    {open ? (
                      <History />
                    ) : (
                      <IconHistory className="h-7 w-7 shrink-0 text-white mt-2" />
                    )}
                  </div>
                </>
              ) : (
                <div></div>
              )}
            </div>
          </div>
          <div>
            {user ? (
              <div>
                <div>
                  <button
                    className="px-4 py-2 rounded-md border border-neutral-300 bg-transparent text-white text-sm hover:-translate-y-1 transform transition duration-200 hover:shadow-md inline-flex items-center gap-2 md:hidden mb-2"
                    onClick={() => {
                      signOut();
                      router.replace("/");
                    }}
                  >
                    <span>Log Out</span>
                    <IconLogout />
                  </button>
                </div>
                <SidebarLink
                  link={{
                    label: `${user?.username}`,
                    href: "#",
                    icon: <IconUser className="h-7 w-7 shrink-0 text-white" />,
                  }}
                />
              </div>
            ) : (
              <div>
                {open ? (
                  <a
                    href="/sign-in"
                    className="shrink-0 flex justify-center items-center w-full"
                  >
                    <button className="px-4 py-2 rounded-md border border-neutral-300 bg-transparent text-white text-sm hover:-translate-y-1 transform transition duration-200 hover:shadow-md inline-flex items-center gap-2 shrink-0">
                      <span>
                        <IconLogin2 className="shrink-0" />
                      </span>
                      <span className="shrink-0">Log In</span>
                    </button>
                  </a>
                ) : (
                  <div>
                    <IconLogin className="h-7 w-7 shrink-0 text-white" />
                  </div>
                )}
              </div>
            )}
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
      href="/"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-white"
    >
      <IconHomeMove className="h-7 w-7 shrink-0 text-white" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium whitespace-pre text-lg text-white"
      >
        Home
      </motion.span>
    </Link>
  );
};
export const LogoIcon = () => {
  return (
    <Link
      href="#"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal"
    >
      <IconHomeMove className="h-7 w-7 shrink-0 text-white" />
    </Link>
  );
};

export const History = () => {
  const [history, setHistory] = useState([]);

  const getHistory = async () => {
    const response = await axios.get("/api/get-history");
    console.log(response?.data?.data[0]);

    setHistory(response?.data?.data);
  };

  const deleteHistory = async () => {
    const response = await axios.delete("/api/delete-history");
    setHistory([]);
    console.log(response);
  };
  useEffect(() => {}, [history]);
  return (
    <div>
      <div>
        <div className="flex gap-5 items-center bg-gray-600 w-full justify-between rounded-lg px-2 py-1">
          <h3 className="md:text-xl font-medium">Hisory</h3>
          <button onClick={getHistory}>
            <IconRefreshDot className="h-7 w-7" />
          </button>
          <button>
            <IconTrash className="h-7 w-7" onClick={deleteHistory} />
          </button>
        </div>
        <div className="flex flex-col overflow-x-hidden overflow-y-auto max-h-70 md:max-h-95 no-scrollbar h-full shrink-0">
          {history &&
            history?.map((data: { question: string; answer: string }, idx) => (
              <>
                <div className="mt-2">
                  <div
                    key={idx}
                    className="overflow-hidden line-clamp-1 shrink-0 "
                  >
                    {data?.question}
                  </div>
                </div>
              </>
            ))}
        </div>
      </div>
    </div>
  );
};

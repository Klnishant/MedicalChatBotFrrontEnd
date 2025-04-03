"use client";

import React from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ColourfulText from "./ui/colourful-text";
import botImage from "@/media/image/chatbot.png";
import Image from "next/image";
import { CornerDownRight } from "lucide-react";
import { IconLogout } from "@tabler/icons-react";

function Navbar() {
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <nav className=" p-2 md:p-4 shadow-md bg-gray-900 text-white w-auto hidden md:block">
      <div className="container mx-auto flex flex-row justify-between items-center">
        <section className="shrink-0 flex items-center flex-row gap-1">
          <Image
            src={`${botImage.src}`}
            alt="mainImage"
            width={50}
            height={50}
          />
          <a href="#" className="text-xl font-bold mb-4 md:mb-0">
            <ColourfulText text="MediAna" />
          </a>
        </section>
        <section className="shrink-0">
          {session && session.user ? (
            <>
              <div>
                <button
                  className="px-4 py-2 rounded-md border border-neutral-300 bg-transparent text-white text-sm hover:-translate-y-1 transform transition duration-200 hover:shadow-md inline-flex items-center gap-2"
                  onClick={() => {
                    signOut();
                    router.replace("/");
                  }}
                >
                  <span>Log Out</span>
                  <span>
                    <IconLogout />
                  </span>
                </button>
              </div>
            </>
          ) : (
            <>
              <Link href={"/sign-in"}>
                <button className="px-4 py-2 rounded-md border border-neutral-300 bg-transparent text-white text-sm hover:-translate-y-1 transform transition duration-200 hover:shadow-md inline-flex items-center gap-2">
                  <span>Get Started</span>{" "}
                  <span>
                    <CornerDownRight size={20} />
                  </span>
                </button>
              </Link>
            </>
          )}
        </section>
      </div>
    </nav>
  );
}

export default Navbar;

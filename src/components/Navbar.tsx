"use client";

import React, { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { User } from "next-auth";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { Separator } from "./ui/separator";
import ColourfulText from "./ui/colourful-text";
import botImage from "@/media/image/chatbot.png";
import Image from "next/image";
import { CornerDownRight, LucideCornerDownRight } from "lucide-react";

function Navbar() {
  const { data: session } = useSession();
  const user: User = session?.user as User;
  const router = useRouter();

  const [dashboard, setDashboard] = useState(true);

  return (
    <nav className="p-4 md:p-6 shadow-md bg-gray-900 text-white w-auto">
      <div className="container mx-auto flex flex-row justify-between items-center">
        <section className="flex items-center flex-row gap-1">
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
        <section>
          {session ? (
            <>
              <div>
                <button className="px-4 py-2 rounded-md border border-neutral-300 bg-transparent text-white text-sm hover:-translate-y-1 transform transition duration-200 hover:shadow-md inline-flex items-center gap-2"
                onClick={
                    ()=>{
                        signOut();
                        router.replace('/');
                    }
                }>
                    <span>Log Out</span>
                    </button>
              </div>
            </>
          ) : (
            <>
                <a href="/sign-in">
                    <button className="px-4 py-2 rounded-md border border-neutral-300 bg-transparent text-white text-sm hover:-translate-y-1 transform transition duration-200 hover:shadow-md inline-flex items-center gap-2">
                    <span>Get Started</span> <span><CornerDownRight size={20} /></span>
                    </button>
                </a>
            </>
          )}
        </section>
      </div>
    </nav>
  );
}

export default Navbar;

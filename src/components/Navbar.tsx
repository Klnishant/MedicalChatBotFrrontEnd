'use client'

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

function Navbar(){
    const {data: session} = useSession();
    const user: User = session?.user as User;
    const router = useRouter();

    const [dashboard,setDashboard] = useState(true);
    

    return (
        <nav className="p-4 md:p-6 shadow-md bg-gray-900 text-white">
            <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
                <section className="flex items-center flex-row gap-1">
                    <Image src={`${botImage.src}`} alt="mainImage" width={50} height={50} />
                    <a href="#" className="text-xl font-bold mb-4 md:mb-0">
                        <ColourfulText text="MediAna" />
                    </a>
                </section>           
            </div>
        </nav>
    );
}

export default Navbar;
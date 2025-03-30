'use client'

import Image from "next/image";
import messages from "@/messages.json";
import Autoplay from "embla-carousel-autoplay";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import docImage from "@/media/image/doc.png";
import stethoscope from "@/media/image/stethoscope.png";
import ColourfulText from "@/components/ui/colourful-text";
import { Send } from "lucide-react";

export default function Home() {
  const {data: session} = useSession();
  const router = useRouter();

  const date = new Date().getFullYear();

  return (
    <>
      <main className="flex flex-col md:flex-row items-center justify-center px-4 md:px-24 py-12 bg-gray-800 text-white">
        <section className="text-center mb-8 md:mb-12">
          <Image src={`${stethoscope.src}`} alt={""} width={600} height={600} className="absolute left-[250px] top-[150px] hidden md:block z-0"/>
          <div className="z-10">
            <h1 className="text-3xl md:text-5xl font-bold">
            <ColourfulText text="MediAna" /> AI Assistant For Your Health
            </h1>
            <p className="mt-3 md:mt-4 text-base md:text-lg">
              Get your health assistance 24/7 everywhere With MediAna
            </p>
          </div>
          {
            session ? (
              <>
                <a href="/chat">
                  <button className="relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none mt-10">
                    <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                    <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
                        Start Chat <span><Send className="ml-5" size={20} /></span>
                    </span>
                  </button>
                </a>
              </>
            ) : (
              <>
                <a href="/sign-in">
                  <button className="relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none mt-10">
                    <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                    <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
                        Start Chat <span><Send className="ml-5" size={20} /></span>
                    </span>
                  </button>
                </a>
              </>
            )
          }
        </section>
        <section className="justify-center">
          <Image src={`${docImage.src}`} alt={""} width={800} height={700}/>
        </section>
      </main>
      <footer className="text-center p-4 md:p-6 bg-gray-900 text-white">
        <p>© {date} MediAna. All rights reserved.</p>
        <p>Created With ❤️ By Nishant Kaushal</p>
      </footer>
    </>
  );
}
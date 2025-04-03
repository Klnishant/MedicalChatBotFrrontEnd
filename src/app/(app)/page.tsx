"use client";

import Image from "next/image";

import { useSession } from "next-auth/react";
import docImage from "@/media/image/doc.png";
import ColourfulText from "@/components/ui/colourful-text";
import { Send } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const { data: session } = useSession();

  const date = new Date().getFullYear();

  return (
    <>
      <main className="flex flex-col md:flex-row items-center justify-center gap-4 py-8 px-8 bg-gray-800 text-white md:shrink-0">
        <section className="text-center mb-8 md:shrink-0">
          <div className="z-10">
            <h1 className="text-3xl md:text-5xl font-bold">
              <ColourfulText text="MediAna" /> AI Assistant <br /> For Your
              Health
            </h1>
            <p className="mt-3 md:mt-4 text-base md:text-lg">
              Get your health assistance 24/7 everywhere With MediAna
            </p>
          </div>
          <Link href={`${session ? "/chat" : "/sign-in"}`}>
            <button className="relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none mt-10">
              <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
              <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
                Start Chat{" "}
                <span>
                  <Send className="ml-5" size={20} />
                </span>
              </span>
            </button>
          </Link>
        </section>
        <section className="flex justify-center shrink md:shrink-0 w-auto">
          <Image
            src={`${docImage.src}`}
            alt={""}
            width={600}
            height={600}
            className="mx-auto"
          />
        </section>
      </main>
      <footer className="text-center p-4 md:p-6 bg-gray-900 text-white h-full w-full">
        <p>© {date} MediAna. All rights reserved.</p>
        <p>Created With ❤️ By Nishant Kaushal</p>
      </footer>
    </>
  );
}

"use client";

import { apiResponse } from "@/types/apiResponse";
import axios, { AxiosError } from "axios";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { messageSchema } from "@/schema/messageSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import profile from "@/media/image/profile.png";
import botImage from "@/media/image/chatbot.png";
import { useSession } from "next-auth/react";
import { User } from "next-auth";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Image from "next/image";
import thinkingBot from "@/media/image/thinking.png";
import { useToast } from "@/components/ui/use-toast";

export default function ChatbotPage() {
  const { data: session, status } = useSession();
  const user: User = session?.user as User;
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [file, setFile] = useState<File | null>(null);

  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isloading, setIsLoading] = useState(false);
  const [username, setUsername] = useState(user?.username);

  const [chat, setChat] = useState([
    {
      sender: "bot",
      text: `hello ${
        username
      }! I am MediAna AI Image analyser health assistant. How can I help you?`,
    },
  ]);
  const [required, setRequired] = useState(false);
  const [preview, setPreview] = useState("");
  const allowedTypes = [
    "image/jpg",
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/heic",
    "image/heif",
  ];

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
  });

  const messageContent = form.watch("content");

  const toast = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event?.target?.files![0]);
    setFile(event.target.files![0]);
    setPreview(URL.createObjectURL(event.target.files![0]));
    console.log(preview);
    console.log(file?.type);
  };

  const handleSubmitMessage = async (data: z.infer<typeof messageSchema>) => {
    console.log(data);
    console.log(messageContent);
    const input = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement; // Select the file input
    console.log(input?.files![0]);

    const file = input?.files![0];
    console.log(input?.files![0]?.type);

    if (!allowedTypes.includes(file?.type)) {
      toast.toast({
        variant: "destructive",
        title: "Invalid file type",
        description: "Please select an image file.",
      });
      return;
    }

    const formData = new FormData();
    formData.append("img", file);

    console.log(formData);

    setRequired(false);
    setIsSending(true);
    const userMessage = { sender: "user", text: preview };
    setChat((prevChat) => [...prevChat, userMessage]);
    setIsLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:8000/diagnose",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setMessage("");

      const botMessage = { sender: "bot", text: response.data };
      setChat((prevChat) => [...prevChat, botMessage]);
      form.setValue("content", message);
      setIsLoading(false);

      const updateHistory = await axios.post("/api/save-history", {
        question: file?.name + " analysis",
        answer: response.data,
      });
      console.log(updateHistory);
    } catch (error) {
      const axiosError = error as AxiosError<apiResponse>;
    } finally {
      setIsSending(false);
    }
  };

  useEffect(() => {
    if ((!user || !session) && status === "unauthenticated") {
      router.replace("/");
    }
  }, [user, session]);

  return (
    <>
      <div className="flex flex-col no-scrollbar bg-gray-800 text-white justify-end  items-center w-full h-157.5">
        <div className=" bg-gray-800 p-2 h-full ">
          <Card className=" p-4 mt-2 bg-gray-800 border-t border-gray-800 text-white mx-auto max-w-4xl w-full max-h-120 h-full flex items-end">
            <CardContent className="space-y-4 overflow-y-auto max-h-118 p-2 no-scrollbar w-full">
              {chat.map((message, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex">
                    <span className="md:mr-2 font-bold w-auto h-auto flex items-start">
                      {message.sender === "bot" ? (
                        <div className="w-[40px] md:w-[60px] h-auto">
                          <img
                            src={`${botImage.src}`}
                            height="50px"
                            width="50px"
                            className="shrink"
                          />
                        </div>
                      ) : (
                        <div></div>
                      )}
                    </span>
                    {message.sender === "bot" ? (
                      <span
                        className={`md:p-3 rounded-full w-full ${"bg-transparent"}`}
                      >
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {message.text}
                        </ReactMarkdown>
                      </span>
                    ) : (
                      <div className=" ml-auto">
                        <Image
                          src={`${message.text}`}
                          alt=""
                          width={300}
                          height={300}
                          className="shrink-0 rounded-2xl"
                        />
                      </div>
                    )}
                    <span className="ml-2 font-bold">
                      {message.sender === "bot" ? (
                        <div></div>
                      ) : (
                        <div className="h-full flex items-end">
                          <img
                            src={`${profile.src}`}
                            height="40px"
                            width="40px"
                          />
                        </div>
                      )}
                    </span>
                  </div>
                </div>
              ))}
              <div>
                {isloading && (
                  <div className="flex items-center w-[70px] h-auto">
                    <img
                      src={`${thinkingBot.src}`}
                      height="60px"
                      width="60px"
                    />
                    <div>Thinking......</div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          <div className=" border-t border-gray-800 flex max-w-4xl w-full p-2 ">
            <Form {...form}>
              <form
                ref={formRef}
                encType="multipart/form-data"
                onSubmit={form.handleSubmit(handleSubmitMessage)}
                className=" flex w-full gap-4"
              >
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem className="flex-1 w-full max-w-xs">
                      <FormControl>
                        <Input
                          {...field}
                          type="file"
                          disabled={isSending}
                          onChangeCapture={handleFileChange}
                          placeholder="Type your message here."
                          className="w-full max-w-fit py-2 bg-transparent hover:bg-gray-600 hover:text-white transition-colors duration-300 ease-in-out"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex h-full items-center">
                  <button className="p-[3px] relative" disabled={isSending}>
                    <div className="absolute inset-0 bg-gradient-to-r from-[#bdc3c7] to-[#2c3e50] rounded-lg" />
                    <div className="px-3 md:px-8 py-2  bg-black rounded-[6px]  relative group transition duration-200 text-white hover:bg-transparent">
                      {isSending ? "Generating..." : "Generate"}
                    </div>
                  </button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
}

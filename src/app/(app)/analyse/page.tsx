"use client";

import { apiResponse } from "@/types/apiResponse";
import axios, { AxiosError } from "axios";
import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { messageSchema } from "@/schema/messageSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { set } from "mongoose";
import profile from "@/media/image/profile.png";
import botImage from "@/media/image/chatbot.png";
import { m } from "motion/react";
import { useSession } from "next-auth/react";
import { User } from "next-auth";
import { useRouter } from "next/navigation";
import { SidebarDemo } from "@/components/SideBar";
import { FileUpload } from "@/components/ui/file-upload";
import Inputs from "@/components/Inputs";
import ChatForm from "@/components/Chat";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
export function ChatbotPage() {
  const { data: session } = useSession();
  const user: User = session?.user as User;
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [file, setFile] = useState<File | null>(null);

  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isloading, setIsLoading] = useState(false);
  const [chat, setChat] = useState([
    {
      sender: "bot",
      text: `hello ${user?.username}! I am MediAna AI Image analyser health assistant. How can I help you?`,
    },
  ]);
  const [required, setRequired] = useState(false);

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
  });

  const messageContent = form.watch("content");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event?.target?.files[0]);
    setFile(event.target.files?.[0]);
      console.log(file);
  };
   
  const handleSubmitMessage = async (data: z.infer<typeof messageSchema>) => {
    console.log(data);
    console.log(messageContent);
    const input = document.querySelector('input[type="file"]'); // Select the file input
    console.log(input?.files[0]);

    const file = input?.files[0]
    
    
    const formData = new FormData();
    formData.append("img", file);

    console.log(formData);
    

    setRequired(false);
    setIsSending(true);
    const userMessage = { sender: "user", formData };
    
    try {
      const response = await axios.post("http://localhost:8000/diagnose", formData,{
        headers: {
            "Content-Type": "multipart/form-data",
          },
      });
      setMessage("");

      const botMessage = { sender: "bot", text: response.data };
      setChat((prevChat) => [...prevChat, botMessage]);
      form.setValue("content", message);

      const updateHistory = await axios.post("/api/save-history", {
        question: file + "analysis",
        answer: response.data,
      });
      console.log(updateHistory);
    } catch (error) {
      const axiosError = error as AxiosError<apiResponse>;
    } finally {
      setIsSending(false);
    }
  };

  //   useEffect(() => {
  //     if (!user || !session) {
  //       router.replace("/");
  //     }
  //   }, [user, session]);

  return (
    <>
      <div className="flex flex-col no-scrollbar bg-gray-800 text-white justify-end  items-center w-full h-157.5">
        <div className=" bg-gray-800 p-2 h-full ">
          <Card className=" p-4 mt-2 bg-gray-800 border-t border-gray-800 text-white mx-auto max-w-4xl w-full max-h-120 h-full">
            <CardContent className="space-y-4 overflow-y-auto max-h-118 p-2 no-scrollbar w-full">
              {chat.map((message, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex">
                    <span className="mr-2 font-bold w-auto h-auto flex items-start">
                      {message.sender === "bot" ? (
                        <div className="w-[60px] h-auto">
                          <img
                            src={`${botImage.src}`}
                            height="50px"
                            width="50px"
                          />
                        </div>
                      ) : (
                        <div></div>
                      )}
                    </span>
                    <span
                      className={`p-3 rounded-full ${
                        message.sender === "user"
                          ? "bg-gray-600 ml-auto"
                          : "bg-transparent"
                      }`}
                    >
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.text}</ReactMarkdown>
                    </span>
                    <span className="ml-2 font-bold">
                      {message.sender === "bot" ? (
                        <div></div>
                      ) : (
                        <div>
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
            </CardContent>
          </Card>
          <div className=" border-t border-gray-800 flex max-w-4xl w-full p-2 ">
            <Form {...form}>
              <form
                ref={formRef}
                encType="multipart/form-data"
                onSubmit={form.handleSubmit(handleSubmitMessage)}
                className="space-y-6 flex w-full gap-2"
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
                          onChangeCapture={handleFileChange}
                          placeholder="Type your message here."
                          className="bg-gray-800 text-white"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  disabled={isSending}
                  className="bg-gray-800  rounded-2xl px-4 py-2 hover:bg-gray-700 transition-colors duration-300 ease-in-out"
                >
                  Generate
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
}

export default function ChatPage() {
  return (
    <>
      <SidebarDemo children={<ChatbotPage />} />
    </>
  );
}

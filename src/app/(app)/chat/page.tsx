"use client";

import { apiResponse } from "@/types/apiResponse";
import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
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
import thinkingBot from "@/media/image/thinking.png";
export default function ChatbotPage() {
  const { data: session, status } = useSession();
  const user: User = session?.user as User;
  const router = useRouter();

  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isloading, setIsLoading] = useState(false);
  const [username, setUsername] = useState(user?.username);

  if (username) {
    sessionStorage.setItem("username", username as string);
  }

  const [chat, setChat] = useState([
    {
      sender: "bot",
      text: `Hello ${
        username || sessionStorage.getItem("username")
      }! I am MediAna AI health assistant. How can I help you?`,
    },
  ]);
  const [required, setRequired] = useState(false);

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
  });

  const messageContent = form.watch("content");

  const handleSubmitMessage = async (data: z.infer<typeof messageSchema>) => {
    if (!data.content) {
      setRequired(true);
      return;
    }
    setRequired(false);
    setIsSending(true);
    const userMessage = { sender: "user", text: data.content };
    setChat((prevChat) => [...prevChat, userMessage]);
    setIsLoading(true);
    try {
      const response = await axios.post("http://localhost:8000/get", {
        msg: data.content,
      });
      setMessage("");

      const botMessage = { sender: "bot", text: response.data };
      setChat((prevChat) => [...prevChat, botMessage]);
      form.setValue("content", message);
      setIsLoading(false);

      const updateHistory = await axios.post("/api/save-history", {
        question: data.content,
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
    if (status === "unauthenticated" && (!user || !session)) {
      router.replace("/");
    }
  }, [user, session]);

  return (
    <>
      <div className="flex flex-col no-scrollbar bg-gray-800 text-white justify-end  items-center w-full h-157.5">
        <div className=" bg-gray-800 p-2 h-full ">
          <Card className=" mt-2 bg-gray-800 border-t border-gray-800 text-white mx-auto max-w-4xl w-full max-h-120 h-full flex items-end">
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
                      {message.text}
                    </span>
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
          <div className="p-4 border-t border-gray-800 flex gap-2 mx-auto max-w-4xl w-full">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmitMessage)}
                className=" flex w-full gap-4"
              >
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input
                          {...field}
                          type="text"
                          disabled={isSending}
                          placeholder="Ask about your health..."
                          className="w-full border-none text-m bg-gray-600 h-15 px-4 md:h-22 placeholder:text-gray-300 rounded-4xl"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-center"></div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
}

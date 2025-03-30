"use client";

import { apiResponse } from "@/types/apiResponse";
import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
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

export default function ChatbotPage() {
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isloading, setIsLoading] = useState(false);
  const [chat, setChat] = useState([
    {
      sender: "bot",
      text: "Hello I am a MediAna AI health assistant. How can I help you?",
    },
  ]);
  const [required, setRequired] = useState(false);

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
  });

  const params = useParams<{ username: string }>();
  const username = params.username;

  const messageContent = form.watch("content");
  const handleMessageClick = (message: string) => {
    form.setValue("content", message);
  };

  const handleSubmitMessage = async (data: z.infer<typeof messageSchema>) => {
    if (!data.content) {
      setRequired(true);
      return;
    }
    setRequired(false);
    setIsSending(true);
    const userMessage = { sender: "user", text: data.content };
    setChat((prevChat) => [...prevChat, userMessage]);

    try {
      const response = await axios.post("http://localhost:8000/get", {
        msg: data.content,
      });
      setMessage("");

      const botMessage = { sender: "bot", text: response.data };
      setChat((prevChat) => [...prevChat, botMessage]);
      form.setValue("content", message);
    } catch (error) {
      const axiosError = error as AxiosError<apiResponse>;
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      <div className="flex flex-col h-157.5 no-scrollbar bg-gray-800 text-white justify-end  items-center w-full ">
        <div className="flex flex-col absolute bottom-10 w-full">
          <Card className=" p-4 mt-10 bg-gray-800 border-t border-gray-800 text-white mx-auto max-w-4xl w-full">
            <CardContent className="space-y-4 overflow-y-auto max-h-90 no-scrollbar w-full">
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
          <div className="p-4 border-t border-gray-800 flex gap-2 mx-auto max-w-4xl w-full">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmitMessage)}
                className="space-y-6 flex w-full gap-2"
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
                          placeholder="Ask about your health..."
                          className="w-full border-none text-m bg-gray-600 h-22 placeholder:text-gray-300 rounded-4xl"
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

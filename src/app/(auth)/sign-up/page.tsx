"use client";

import { apiResponse } from "@/types/apiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import * as z from "zod";

import { Form } from "@/components/ui/form";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { signUpSchema } from "@/schema/signUpSchema";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import ColourfulText from "@/components/ui/colourful-text";

export default function signUpForm() {
  const [username, setUserName] = useState("");
  const [userMessage, setUserMessage] = useState("");
  const [isCheckUserName, setIsCheckUserName] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    const checkUserNameUnique = async () => {
      if (username) {
        setIsCheckUserName(true);
        setUserMessage("");

        try {
          const response = await axios.get<apiResponse>(
            `/api/check-username-unique?username=${username}`
          );
          setUserMessage(response.data.message);
        } catch (error) {
          const axiosError = error as AxiosError<apiResponse>;
          setUserMessage(
            axiosError.response?.data.message ?? "Error checking username"
          );
        } finally {
          setIsCheckUserName(false);
        }
      }
    };
    checkUserNameUnique();
  }, [username]);

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true);

    try {
      const response = await axios.post(`/api/sign-up`, data);

      toast({
        title: "success",
        description: response?.data.message,
      });

      router.replace(`/verify/${username}`);
    } catch (error) {
      const axiosError = error as AxiosError<apiResponse>;

      let errorMessage = axiosError.response?.data.message;
      ("there was a problem with your sign up please try again");

      toast({
        title: "sign-up failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 rounded-lg bg-gray-800 backdrop-blur-4xl backdrop-opacity-1 border border-gray-700 shadow-gray-900/10 shadow-xl text-white">
        <div className="text-center">
          <h1 className="text-4xl mb-6 font-extrabold tracking-tight lg:text-5xl">
            Join <ColourfulText text="MediAna" /> AI Today
          </h1>
          <p className="mb-4">Sign up to start your health care journey</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="username"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        setUserName(e.target.value);
                      }}
                      className="border border-gray-300 bg-transparent w-full"
                    />
                  </FormControl>
                  {isCheckUserName && <Loader2 className="animate-spin" />}
                  {!isCheckUserName && userMessage && (
                    <p
                      className={`text-sm ${
                        userMessage === "username is unique"
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {userMessage}
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      name="email"
                      className="border border-gray-300 bg-transparent w-full"
                    />
                  </FormControl>
                  <p className="text-gray-400 text-sm">
                    We will send you verification code
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      name="password"
                      type="password"
                      className="border border-gray-300 bg-transparent w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please Wait
                </>
              ) : (
                "Sign Up"
              )}
            </Button>
          </form>
        </Form>
        <div className="text-center mt-4">
          <p>
            Already a member{" "}
            <Link
              href={"/sign-in"}
              className="text-blue-600 hover:text-blue-800"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

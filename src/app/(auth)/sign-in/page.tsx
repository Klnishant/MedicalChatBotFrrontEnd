"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { signInSchema } from "@/schema/signInSchema";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ColourfulText from "@/components/ui/colourful-text";

export default function signInForm() {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    try {
      const response = await signIn("credentials", {
        redirect: false,
        identifier: data.identifier,
        password: data.password,
      });

      if (response?.error) {
        if (response.error === "credentialsSignIn") {
          toast({
            title: "Login failed",
            description: "invalid username or password",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Error",
            description: response?.error,
            variant: "destructive",
          });
        }
      }

      if (response?.url) {
        router.replace("/chat");
      }
    } catch (error: any) {
      toast({
        title: "Error occured while log in",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 rounded-lg bg-gray-800 backdrop-blur-4xl backdrop-opacity-1 border border-gray-700 shadow-gray-900/10 shadow-xl text-white">
        <div className="text-center">
          <h1 className="text-4xl mb-6 font-extrabold tracking-tight lg:text-5xl">
            Welcome Back to <ColourfulText text="MediAna" /> AI
          </h1>
          <p className="mb-4">Sign in to continue your health conversations</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="identifier"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="border border-gray-300 bg-transparent w-full"
                    />
                  </FormControl>
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
                      type="password"
                      className="border border-gray-300 bg-transparent w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              Sign In
            </Button>
          </form>
        </Form>
        <div className="text-center mt-4">
          <p>
            Not a member yet?{" "}
            <Link
              href={"/sign-up"}
              className="text-blue-600 hover:text-blue-800"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

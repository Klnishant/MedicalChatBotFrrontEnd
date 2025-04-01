"use client";

import { useRef } from "react";
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ChatForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const form = useForm({
    defaultValues: { content: "" },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]; // Get the first file
    if (file) {
      console.log("Selected file:", file);
    }
  };

  const handleSubmitMessage = async (data: any) => {
    console.log("Form submitted with:", data);
  };

  return (
    <div className="border-t border-gray-800 flex max-w-4xl w-full relative bottom-0">
      <Form {...form}>
        <form
          ref={formRef}
          onSubmit={form.handleSubmit(handleSubmitMessage)}
          encType="multipart/form-data"
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
                    onChange={handleFileChange}
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
            className="bg-gray-800 rounded-2xl px-4 py-2 hover:bg-gray-700 transition-colors duration-300 ease-in-out"
          >
            Generate
          </Button>
        </form>
      </Form>
    </div>
  );
}

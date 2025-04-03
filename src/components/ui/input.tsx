import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      autoComplete="off"
      data-slot="input"
      className={cn(
        "file:text-gray-400 placeholder:text-gray-500 selection:bg-primary selection:text-neutral-300 bg-input/30 border-input flex h-12 justify-center items-center  rounded-md border px-1 py-1 shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:px-4 file:h-7 file:border-0 file:bg-transparent file:text-m file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      )}
      {...props}
    />
  )
}

export { Input }

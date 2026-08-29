import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex min-h-20 w-full resize-none rounded-xl border border-[#E8DDCA] bg-white px-3.5 py-2.5 text-sm text-[#171717] shadow-2xs transition-[color,box-shadow,border-color] outline-none placeholder:text-muted-foreground focus:border-[#B18A3A] focus-visible:ring-1 focus-visible:ring-[#B18A3A] disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }

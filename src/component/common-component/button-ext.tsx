import * as React from "react"

import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"
import { Oval } from "react-loader-spinner"
import { VariantProps } from "class-variance-authority"
import { cn } from "./utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
  loadingColor?: string
  loadingSecondaryColor?: string
}
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-[#39569E] hover:bg-[#39569E]/90", // #39569E
        destructive:"bg-[#F05656] hover:bg-[#F05656]/90", // #F05656
        outline:"border border-input bg-background",
        secondary:"bg-[#F6F6F7] hover:bg-[#F6F6F7]/80", //#F6F6F7
        ghost: "hover:bg-gray-400",
        tertiary: "bg-[#8CD2C6] hover:bg-[#8CD2C6]/80", //#8CD2C6
        quaternary:"bg-[#C876C0] hover:bg-[#C876C0]/80", //#C876C0
        quinary: "bg-[#DA59A9] hover:bg-[#DA59A9]/80", //#DA59A9
        senary: "bg-[#EFBD33] hover:bg-[#EFBD33]/80", //#EFBD33
        septenary:"bg-[#95C970] hover:bg-[#95C970]/80", //#95C970
        octal: "bg-[#EA9629] hover:bg-[#EA9629]/80", //#EA9629
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

const ButtonExt = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      loading = false,
      loadingColor = "#ffffff",
      loadingSecondaryColor = "#ffffff",
      children,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button"

    return (
      <Comp
        disabled={loading}
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {loading ? (
          <Oval
            color={loadingColor}
            secondaryColor={loadingSecondaryColor}
            strokeWidth={4}
          />
        ) : (
          children
        )}
      </Comp>
    )
  },
)
ButtonExt.displayName = "ButtonExt"

export { ButtonExt, buttonVariants }

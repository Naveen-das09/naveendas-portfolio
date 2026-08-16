import Link from "next/link";
import type { ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonStyles = cva(
  "inline-flex items-center justify-center gap-2 rounded-full text-sm font-medium transition-colors duration-200 focus-visible:outline-cyan disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-warm text-background hover:bg-[#ffc57a] px-5 py-2.5 shadow-[0_0_24px_-6px_var(--accent-warm)]",
        outline:
          "border border-border-strong text-foreground hover:border-cyan hover:text-cyan px-5 py-2.5",
        ghost: "text-foreground-muted hover:text-cyan px-3 py-2",
      },
    },
    defaultVariants: { variant: "primary" },
  },
);

interface ButtonProps extends VariantProps<typeof buttonStyles> {
  href?: string;
  children: ReactNode;
  className?: string;
  external?: boolean;
  onClick?: () => void;
  type?: "button" | "submit";
}

export function Button({
  href,
  children,
  className,
  variant,
  external,
  onClick,
  type = "button",
}: ButtonProps) {
  const classes = cn(buttonStyles({ variant }), className);

  if (href) {
    if (external) {
      return (
        <a href={href} target="_blank" rel="noreferrer noopener" className={classes}>
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={classes}>
      {children}
    </button>
  );
}

import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({
  className,
  href = "/",
}: {
  className?: string;
  href?: string | null;
}) {
  const content = (
    <span className={cn("flex items-center gap-2 font-semibold", className)}>
      <span className="brand-gradient flex size-8 items-center justify-center rounded-lg text-white shadow-sm">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="size-5"
          aria-hidden="true"
        >
          <path
            d="M4 16.5V7.5a1.5 1.5 0 0 1 1.5-1.5h5l2 2.5h6A1.5 1.5 0 0 1 21 10v6.5A1.5 1.5 0 0 1 19.5 18h-14A1.5 1.5 0 0 1 4 16.5Z"
            fill="currentColor"
            opacity="0.9"
          />
          <circle cx="12.5" cy="12.5" r="2.4" fill="white" />
        </svg>
      </span>
      <span className="text-lg tracking-tight">
        Portfolio<span className="brand-text-gradient">UGC</span>
      </span>
    </span>
  );

  if (href === null) return content;
  return (
    <Link href={href} className="inline-flex">
      {content}
    </Link>
  );
}

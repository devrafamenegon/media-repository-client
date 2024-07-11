"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from 'next/image';
import LogoDark from "@/public/logo_dark.svg";
import LogoLight from "@/public/logo_light.svg";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const [isMounted, setIsMounted] = useState(false);

  const { theme } = useTheme();

  useEffect(() => {
    setIsMounted(true)
  }, []);

  if (!isMounted) return null;
  
  return (
    <nav className={cn("flex items-center space-x-4 lg:space-x-6", className)}>
      <Link
        href={'/'}
      >
        <Image 
          height="30"
          alt="Logo"
          src={theme === 'light' ? LogoDark : LogoLight}
        />
      </Link>
      
    </nav>
  )
}
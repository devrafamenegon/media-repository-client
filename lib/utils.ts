import { Media } from "@/types";
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const chunkMedias = (array: Media[], size: number) => {
  const chunkedMedias = [];
  for (let i = 0; i < array?.length; i += size) {
    chunkedMedias.push(array.slice(i, i + size));
  }
  return chunkedMedias;
}

import { PutBlobResult } from "@vercel/blob";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function uploadVercel(file: File) {
  const response = await fetch(
    `/api/posts/upload?filename=${file?.name}`,
    {
      method: 'POST',
      body: file,
    },
  );
  const newBlob = (await response.json()) as PutBlobResult;
  return newBlob.url;
}

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind CSS classes safely, resolving conflicts.
 * Used by every shadcn/ui component.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

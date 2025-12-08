import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export const METADATA = {
  name: "Wallet Connect",
  description: "A simple wallet connection interface for Base Mini Apps",
  bannerImageUrl: 'https://connect-wallet-tan.vercel.app/splash.png',
  iconImageUrl: 'https://connect-wallet-tan.vercel.app/icon.png',
  homeUrl: process.env.NEXT_PUBLIC_URL ?? "https://connect-wallet-tan.vercel.app",
  splashBackgroundColor: "#000000"
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

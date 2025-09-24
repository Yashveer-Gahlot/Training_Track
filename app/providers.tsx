"use client";
import { UserProvider } from "@/providers/UserProvider";
export default function Providers({ children }: { children: React.ReactNode }) {
  return <UserProvider>{children}</UserProvider>;
}
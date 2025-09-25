// app/providers.tsx

'use client';

import ThemeProvider from "@/components/ThemeProvider";
import { UserProvider } from '@/providers/UserProvider';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <UserProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>
    </UserProvider>
  );
}

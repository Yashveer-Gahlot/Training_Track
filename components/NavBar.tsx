// components/NavBar.tsx
'use client';

import React from 'react';
import { ThemeToggle } from './ThemeToggle';
import LoginButton from './LoginButton';
import Link from 'next/link';

const NavBar = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          
          {/* Left Side: Logo + Navigation Links */}
          <div className="flex items-center space-x-8">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-xl font-bold text-foreground">
                Enigma
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link
                href="/"
                className="text-sm font-medium text-foreground/60 transition-colors hover:text-foreground"
              >
                Home
              </Link>
              <Link
                href="/training"
                className="text-sm font-medium text-foreground/60 transition-colors hover:text-foreground"
              >
                Training
              </Link>
              <Link
                href="/statistics"
                className="text-sm font-medium text-foreground/60 transition-colors hover:text-foreground"
              >
                Statistics
              </Link>
              <Link
                href="/upsolve"
                className="text-sm font-medium text-foreground/60 transition-colors hover:text-foreground"
              >
                Upsolve
              </Link>
            </nav>
          </div>

          {/* Right Side: Login + Theme Toggle */}
          <div className="flex items-center space-x-4">
            <LoginButton />
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
};

export default NavBar;

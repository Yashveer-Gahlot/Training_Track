// src/components/Navbar.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import useUser from "@/providers/userProvider";
import UserIndicator from "./UserIndicator";
import LoginDialog from "./LoginDialog";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const { user } = useUser();
  const [showLogin, setShowLogin] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-gray-900">
              Training Tracker
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-blue-600 transition-colors">
              Home
            </Link>
            <Link href="/training" className="text-gray-700 hover:text-blue-600 transition-colors">
              Training
            </Link>
            <Link href="/statistics" className="text-gray-700 hover:text-blue-600 transition-colors">
              Statistics
            </Link>
            <Link href="/upsolve" className="text-gray-700 hover:text-blue-600 transition-colors">
              Upsolve
            </Link>
          </div>

          {/* User Section */}
          <div className="flex items-center">
            {user ? (
              <UserIndicator />
            ) : (
              <Button onClick={() => setShowLogin(true)} variant="default">
                Login
              </Button>
            )}
          </div>
        </div>
      </div>

      <LoginDialog open={showLogin} onOpenChange={setShowLogin} />
    </nav>
  );
};

export default Navbar;

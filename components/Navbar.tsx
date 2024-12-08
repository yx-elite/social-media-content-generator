"use client";

import Link from "next/link";
import {
  SignInButton,
  SignOutButton,
  UserButton,
  SignedIn,
  SignedOut,
  useAuth,
  SignUpButton,
} from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { Zap, Menu, X } from "lucide-react";

const navbarItems = [
  {
    id: 1,
    label: "Features",
    href: "/features",
  },
  {
    id: 2,
    label: "Pricing",
    href: "/pricing",
  },
  {
    id: 3,
    label: "Docs",
    href: "/docs",
  },
];

const Navbar = () => {
  const { userId } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${isScrolled ? "bg-gray-900/80 backdrop-blur-md" : "bg-transparent"}`}
    >
      <nav className="container mx-auto px-4 py-4 sm:px-8 sm:py-6">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Zap className="h-8 w-8 text-blue-500" />
              <span className="text-xl font-semibold">SocialSpark</span>
            </Link>
          </div>
          <button
            className="text-white focus:outline-none sm:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
          <div
            className={`w-full sm:w-auto ${isMenuOpen ? "block" : "hidden"} mt-4 sm:mt-0 sm:block`}
          >
            <div className="mt-4 flex flex-col space-y-2 sm:mt-0 sm:flex-row sm:items-center sm:space-x-8 sm:space-y-0">
              {/* Navbar Items */}
              {navbarItems.map(({ id, label, href }) => (
                <Link
                  href={href}
                  key={id}
                  className="group relative py-2 text-sm text-gray-300 transition-colors hover:text-white sm:py-0"
                >
                  {label}
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 scale-x-0 transform bg-blue-500 transition-all duration-300 group-hover:scale-x-100"></span>
                </Link>
              ))}

              {/* Dashboard Link */}
              {userId && (
                <Link
                  href="/dashboard"
                  className="group relative py-2 text-sm text-gray-300 transition-colors hover:text-white sm:py-0"
                >
                  Dashboard
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 scale-x-0 transform bg-blue-500 transition-all duration-300 group-hover:scale-x-100"></span>
                </Link>
              )}

              {/* Render when user is signed out */}
              <SignedOut>
                <div className="flex flex-col items-center space-y-4 sm:mt-0 sm:w-auto sm:flex-row sm:space-x-8 sm:space-y-0">
                  <SignInButton>
                    <button className="ml-0 mt-4 w-full rounded-md bg-white px-4 py-2 text-sm font-medium text-blue-600 transition-colors hover:bg-gray-300 sm:ml-8 sm:mt-0 sm:w-auto">
                      Sign In
                    </button>
                  </SignInButton>
                  <SignUpButton>
                    <button className="w-full rounded-md bg-blue-700 px-4 py-2 text-sm font-medium text-gray-300 transition-colors duration-300 hover:bg-blue-600 hover:text-white sm:w-auto">
                      Sign Up
                    </button>
                  </SignUpButton>
                </div>
              </SignedOut>

              {/* Render when user is signed in */}
              <SignedIn>
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: "h-8 w-8",
                    },
                  }}
                />
              </SignedIn>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;

"use client";

import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";
import { Button } from "./ui/button";
import { LayoutDashboardIcon, PenBox } from "lucide-react";
import { useEffect, useState } from "react";

// Note: checkUser is called in a server wrapper — header is now client for scroll shadow
const Header = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`fixed top-0 w-full z-50 border-b bg-[#0a0d14]/95 backdrop-blur-md transition-all duration-300 ${
        scrolled ? "border-[#1e2d45] header-scrolled" : "border-transparent"
      }`}
    >
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.png"
            alt="Floww logo"
            width={180}
            height={60}
            className="h-14 w-auto object-contain"
          />
        </Link>

        <div className="flex items-center space-x-3">
          <SignedIn>
            <Link href="/dashboard">
              <Button
                variant="ghost"
                className="text-slate-400 hover:text-[#c9a96e] hover:bg-[#1a2235] gap-2 transition-colors duration-200"
              >
                <LayoutDashboardIcon size={16} />
                <span className="hidden md:inline">Dashboard</span>
              </Button>
            </Link>

            <Link href="/transaction/create">
              <Button className="gap-2 bg-[#c9a96e] hover:bg-[#a07840] text-[#0a0d14] font-semibold border-0 transition-all duration-200 hover:scale-[1.03]">
                <PenBox size={16} />
                <span className="hidden md:inline">Add Transaction</span>
              </Button>
            </Link>
          </SignedIn>

          <SignedOut>
            <SignInButton forceRedirectUrl="/dashboard">
              <Button
                variant="outline"
                className="border-[#1e2d45] text-slate-300 hover:border-[#c9a96e] hover:text-[#c9a96e] bg-transparent transition-colors duration-200"
              >
                Login
              </Button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <UserButton appearance={{
                variables: {
                  colorBackground: "#111827",
                  colorText: "#f1f5f9",
                  colorTextSecondary: "#64748b",
                  colorPrimary: "#c9a96e",
                  colorNeutral: "#1e2d45",
                  borderRadius: "0.75rem",
                },
                elements: {
                  avatarBox: { width: "36px", height: "36px" },
                  userButtonPopoverCard: { backgroundColor: "#111827", border: "1px solid #1e2d45", boxShadow: "0 0 40px rgba(0,0,0,0.8)" },
                  userButtonPopoverActionButton: { color: "#cbd5e1" },
                  userButtonPopoverActionButton__manageAccount: { color: "#cbd5e1" },
                  userButtonPopoverActionButton__signOut: { color: "#cbd5e1" },
                  userButtonPopoverFooter: { display: "none" },
                  userPreviewMainIdentifier: { color: "#f1f5f9", fontWeight: "600" },
                  userPreviewSecondaryIdentifier: { color: "#64748b" },
                }
              }} />
          </SignedIn>
        </div>
      </nav>
    </div>
  );
};

export default Header;
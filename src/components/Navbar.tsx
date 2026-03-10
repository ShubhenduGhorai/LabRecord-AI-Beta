"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Beaker, Menu, X } from "lucide-react";
import { WaitlistModal } from "@/components/WaitlistModal";

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-8">
        <Link href="/" className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
          <Beaker className="h-6 w-6 text-indigo-600" />
          <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-600">
            LabRecord AI
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
          <Link href={isHome ? "#features" : "/#features"} className="hover:text-foreground transition-colors">Features</Link>
          <Link href={isHome ? "#how-it-works" : "/#how-it-works"} className="hover:text-foreground transition-colors">How It Works</Link>
          <Link href={isHome ? "#demo" : "/#demo"} className="hover:text-foreground transition-colors">Demo</Link>
          <Link href={isHome ? "#pricing" : "/#pricing"} className="hover:text-foreground transition-colors">Pricing</Link>
          <Link href={isHome ? "#faq" : "/#faq"} className="hover:text-foreground transition-colors">FAQ</Link>
          <Link href="/docs" className="hover:text-foreground transition-colors">Docs</Link>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <Link href="/auth/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Log in
          </Link>
          <WaitlistModal>
            <Button variant="outline" className="hidden lg:flex">
              Join Waitlist
            </Button>
          </WaitlistModal>
          <Link href="/auth/signup">
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow-md shadow-indigo-500/20 transition-all">
              Get Started
            </Button>
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center">
          <Button variant="ghost" className="p-2 h-10 w-10" onClick={toggleMobileMenu} aria-label="Toggle menu">
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t bg-background/95 backdrop-blur-sm px-4 py-4 space-y-4 shadow-lg pb-6 absolute w-full left-0 top-16">
          <nav className="flex flex-col space-y-4 text-sm font-medium text-muted-foreground">
            <Link href={isHome ? "#features" : "/#features"} onClick={closeMobileMenu} className="hover:text-foreground transition-colors block py-3 min-h-[44px] flex flex-col justify-center">Features</Link>
            <Link href={isHome ? "#how-it-works" : "/#how-it-works"} onClick={closeMobileMenu} className="hover:text-foreground transition-colors block py-3 min-h-[44px] flex flex-col justify-center">How It Works</Link>
            <Link href={isHome ? "#demo" : "/#demo"} onClick={closeMobileMenu} className="hover:text-foreground transition-colors block py-3 min-h-[44px] flex flex-col justify-center">Demo</Link>
            <Link href={isHome ? "#pricing" : "/#pricing"} onClick={closeMobileMenu} className="hover:text-foreground transition-colors block py-3 min-h-[44px] flex flex-col justify-center">Pricing</Link>
            <Link href={isHome ? "#faq" : "/#faq"} onClick={closeMobileMenu} className="hover:text-foreground transition-colors block py-3 min-h-[44px] flex flex-col justify-center">FAQ</Link>
            <Link href="/docs" onClick={closeMobileMenu} className="hover:text-foreground transition-colors block py-3 min-h-[44px] flex flex-col justify-center">Docs</Link>
          </nav>
          <div className="flex flex-col space-y-3 pt-4 border-t">
            <Link href="/auth/login" onClick={closeMobileMenu} className="text-center py-3 min-h-[44px] flex flex-col justify-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Log in
            </Link>
            <WaitlistModal>
              <Button variant="outline" className="w-full justify-center min-h-[44px]">
                Join Waitlist
              </Button>
            </WaitlistModal>
            <Link href="/auth/signup" onClick={closeMobileMenu} className="w-full">
              <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow-md min-h-[44px]">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

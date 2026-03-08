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
        <div className="flex items-center gap-2">
          <Beaker className="h-6 w-6 text-indigo-600" />
          <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-600">
            LabRecord AI
          </span>
        </div>
        
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
          <Link href={isHome ? "#features" : "/#features"} className="hover:text-foreground transition-colors">Features</Link>
          <Link href={isHome ? "#how-it-works" : "/#how-it-works"} className="hover:text-foreground transition-colors">How It Works</Link>
          <Link href={isHome ? "#demo" : "/#demo"} className="hover:text-foreground transition-colors">Demo</Link>
          <Link href={isHome ? "#pricing" : "/#pricing"} className="hover:text-foreground transition-colors">Pricing</Link>
          <Link href={isHome ? "#faq" : "/#faq"} className="hover:text-foreground transition-colors">FAQ</Link>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Login
          </Link>
          <WaitlistModal>
            <Button variant="outline" className="hidden lg:flex">
              Join Waitlist
            </Button>
          </WaitlistModal>
          <Link href="/signup">
            <Button className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white hover:opacity-90 transition-opacity">
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
            <Link href={isHome ? "#features" : "/#features"} onClick={closeMobileMenu} className="hover:text-foreground transition-colors block py-2">Features</Link>
            <Link href={isHome ? "#how-it-works" : "/#how-it-works"} onClick={closeMobileMenu} className="hover:text-foreground transition-colors block py-2">How It Works</Link>
            <Link href={isHome ? "#demo" : "/#demo"} onClick={closeMobileMenu} className="hover:text-foreground transition-colors block py-2">Demo</Link>
            <Link href={isHome ? "#pricing" : "/#pricing"} onClick={closeMobileMenu} className="hover:text-foreground transition-colors block py-2">Pricing</Link>
            <Link href={isHome ? "#faq" : "/#faq"} onClick={closeMobileMenu} className="hover:text-foreground transition-colors block py-2">FAQ</Link>
          </nav>
          <div className="flex flex-col space-y-3 pt-4 border-t">
            <Link href="/login" onClick={closeMobileMenu} className="text-center py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Login
            </Link>
            <WaitlistModal>
              <Button variant="outline" className="w-full justify-center">
                Join Waitlist
              </Button>
            </WaitlistModal>
            <Link href="/signup" onClick={closeMobileMenu} className="w-full">
              <Button className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white hover:opacity-90 transition-opacity">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

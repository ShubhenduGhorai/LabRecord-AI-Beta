"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createSupabaseClient } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Beaker } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const supabase = createSupabaseClient();
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
        },
      });

      if (signUpError) throw signUpError;
      
      // If sign up is successful, push to dashboard
      // Note: Supabase might require email verification depending on settings
      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "An error occurred during sign up");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message || "Failed to authenticate with Google");
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      <div className="flex flex-col justify-center px-8 sm:px-16 md:px-24 bg-background z-10">
        <div className="w-full max-w-md mx-auto space-y-8">
          <Link href="/" className="flex items-center gap-2 mb-12">
            <Beaker className="h-8 w-8 text-indigo-600" />
            <span className="text-2xl font-bold tracking-tight">LabRecord AI</span>
          </Link>
          
          <div className="space-y-3">
            <h1 className="text-3xl font-bold tracking-tight">Create an account</h1>
            <p className="text-muted-foreground">Automation for your lab reports starts here.</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="h-11 border-border/60 focus:border-indigo-500"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11 border-border/60 focus:border-indigo-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="h-11 border-border/60 focus:border-indigo-500"
              />
            </div>

            {error && (
              <div className="text-sm font-medium text-red-500 bg-red-50 p-3 rounded-md border border-red-100">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow-md shadow-indigo-500/20 transition-all font-semibold"
              disabled={loading}
            >
              {loading ? "Creating account..." : "Create Account"}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border/60" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <Button 
            variant="outline" 
            className="w-full h-11 font-medium bg-white hover:bg-zinc-50 border-border/60" 
            onClick={handleGoogleLogin}
          >
            <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
              <path d="M1 1h22v22H1z" fill="none" />
            </svg>
            Google
          </Button>

          <p className="text-center text-sm text-muted-foreground mt-8">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors">
              Login
            </Link>
          </p>
        </div>
      </div>
      
      <div className="hidden md:flex flex-col bg-slate-50 border-l justify-center items-center relative overflow-hidden">
        <div className="absolute inset-0 bg-indigo-600/5 backdrop-blur-3xl z-0" />
        <div className="absolute w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[100px] mix-blend-multiply top-0 right-0" />
        <div className="absolute w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px] mix-blend-multiply bottom-0 left-0" />
        
        <div className="max-w-md text-center z-10 px-8 relative">
          <div className="bg-white/60 p-8 rounded-2xl border shadow-xl backdrop-blur-md mb-8">
            <h3 className="text-3xl font-extrabold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-blue-700">
              Stop formatting. <br/> Start shipping.
            </h3>
            <p className="text-slate-600 text-lg leading-relaxed">
              Join thousands of engineering students who save 4+ hours every week on boring lab report formatting using LabRecord AI.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

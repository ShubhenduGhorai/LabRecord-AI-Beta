import { AlertCircle, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface ErrorFallbackProps {
  error: string | null;
  reset: () => void;
  title?: string;
  description?: string;
}

export function ErrorFallback({ error, reset, title = "Process Interrupted", description = "Something went wrong while processing your request." }: ErrorFallbackProps) {
  if (!error) return null;

  return (
    <div className="flex items-center justify-center p-4 min-h-[400px]">
      <Card className="max-w-md w-full border-red-100 shadow-xl shadow-red-50/50 overflow-hidden">
        <div className="h-2 bg-red-500 w-full" />
        <CardHeader className="text-center pb-2">
          <div className="mx-auto bg-red-50 w-12 h-12 rounded-full flex items-center justify-center mb-4">
            <AlertCircle className="h-6 w-6 text-red-600" />
          </div>
          <CardTitle className="text-xl font-bold text-slate-900">{title}</CardTitle>
          <CardDescription className="text-slate-500">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent className="px-6 py-4 bg-slate-50/50 rounded-lg mx-6 mb-2 border border-slate-100">
          <p className="text-sm font-mono text-red-600 break-words text-center">
            {error}
          </p>
        </CardContent>
        <CardFooter className="flex gap-3 pt-4">
          <Button 
            variant="outline" 
            className="flex-1 gap-2" 
            onClick={() => window.location.href = "/dashboard"}
          >
            <Home className="h-4 w-4" />
            Dashboard
          </Button>
          <Button 
            className="flex-1 gap-2 bg-indigo-600 hover:bg-indigo-700" 
            onClick={reset}
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

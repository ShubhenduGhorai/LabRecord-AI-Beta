"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BadgeHelp, Play, AlertCircle, Sparkles, MessageSquare } from "lucide-react";
import { ErrorFallback } from "@/components/ErrorFallback";

type VivaQuestion = {
  question: string;
  answer: string;
};

export default function VivaPrepPage() {
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState<VivaQuestion[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setError(null);
    if (!title.trim()) {
      setError("Please enter an experiment title.");
      return;
    }

    setIsGenerating(true);
    setQuestions([]);

    try {
      const res = await fetch('/api/viva-prep', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ experiment_title: title })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to generate viva questions.");
      }

      setQuestions(data.questions);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  if (error && questions.length === 0 && !isGenerating) {
    return <ErrorFallback error={error} reset={() => setError(null)} />;
  }

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto space-y-8 w-full">
      <Card className="border-amber-100 shadow-sm bg-gradient-to-br from-amber-50/50 to-white">
        <CardHeader className="pb-4 border-b border-amber-50/50">
          <div className="flex gap-4 items-start">
            <div className="p-2 bg-amber-100 rounded-lg w-fit">
              <BadgeHelp className="h-8 w-8 text-amber-600" />
            </div>
            <div>
              <CardTitle className="text-3xl font-bold">Viva Preparation</CardTitle>
              <CardDescription className="text-lg mt-1">
                Train for your defense using AI-generated, discipline-specific question generation.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-8 space-y-8">

          {/* Input Section */}
          <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
            <div className="space-y-4 max-w-xl mx-auto">
              <div className="space-y-2 text-center">
                <label className="text-sm font-semibold text-slate-700">What experiment are you preparing for?</label>
                <Input
                  placeholder="e.g. Young's Modulus of a Wire"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="h-12 text-center text-lg shadow-inner"
                  onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                />
              </div>

              {error && (
                <div className="flex justify-center items-start gap-2 p-3 text-sm text-red-600 bg-red-50 rounded-md border border-red-100">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <p>{error}</p>
                </div>
              )}

              <Button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full h-12 text-base font-semibold bg-amber-500 hover:bg-amber-600 text-white"
              >
                {isGenerating ? (
                  <>
                    <Sparkles className="h-4 w-4 mr-2 animate-pulse fill-current" /> Generating Questions...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2 fill-current" /> Generate Mock Viva
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Output Section */}
          {questions.length > 0 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h3 className="text-xl font-bold text-slate-800 border-b pb-2 flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-amber-500" /> Suggested Questions
              </h3>
              <div className="grid gap-4">
                {questions.map((q, idx) => (
                  <Card key={idx} className="bg-white border-amber-100/50 shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2 bg-slate-50/50 rounded-t-xl">
                      <div className="flex gap-3">
                        <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-amber-100 text-amber-700 font-bold text-sm">
                          Q{idx + 1}
                        </span>
                        <CardTitle className="text-base text-slate-800 leading-relaxed font-semibold">
                          {q.question}
                        </CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-4 text-slate-600">
                      <div className="flex gap-3">
                        <span className="flex-shrink-0 font-semibold text-slate-400 text-sm mt-0.5">Ans:</span>
                        <p className="text-sm leading-relaxed">{q.answer}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

        </CardContent>
      </Card>
    </div>
  );
}

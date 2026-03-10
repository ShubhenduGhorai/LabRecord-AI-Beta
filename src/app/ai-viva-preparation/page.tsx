import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, BookOpen, Brain, Microscope, Sparkles } from 'lucide-react';

export const metadata: Metadata = {
    title: "AI Viva Preparation Tool for Lab Exams | LabRecord AI",
    description: "Generate potential viva questions and answers based on your specific lab experiment results.",
    keywords: ["AI viva preparation", "lab exam questions", "viva prep tool", "engineering viva", "science lab exam"],
    alternates: {
        canonical: 'https://labrecord.cloud/ai-viva-preparation',
    },
    openGraph: {
        title: "AI Viva Preparation Tool for Lab Exams",
        description: "Generate potential viva questions and answers based on your specific lab experiment results.",
        url: "https://labrecord.cloud/ai-viva-preparation",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "AI Viva Preparation Tool",
        description: "Generate potential viva questions and answers based on your specific lab experiment results.",
    },
};

export default function AIVivaPreparation() {
    return (
        <div className="flex flex-col min-h-screen">
            <section className="bg-indigo-50 py-20 px-6 sm:px-12 text-center border-b border-indigo-100">
                <div className="max-w-4xl mx-auto space-y-6">
                    <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
                        <span className="text-fuchsia-600">AI</span> Viva Preparation Tool
                    </h1>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                        Never be caught off guard by an examiner again. Automatically generate practice viva questions based on your exact lab experiment parameters and results.
                    </p>
                    <div className="pt-6">
                        <Link href="/auth/signup">
                            <Button size="lg" className="bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-semibold h-14 px-8 rounded-full shadow-lg shadow-fuchsia-200">
                                Generate Viva Questions <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            <section className="py-20 px-6 sm:px-12 bg-white">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center space-y-6 mb-16">
                        <h2 className="text-3xl font-bold text-slate-900">How It Predicts Your Questions</h2>
                        <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                            Our AI engine deeply analyzes the aim, theoretical background, and final conclusion of your submitted experiment data. By evaluating potential errors and standard scientific principles, it produces highly probable external examiner viva questions.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="text-center space-y-4 p-6 hover:bg-slate-50 rounded-2xl transition">
                            <div className="w-16 h-16 mx-auto bg-fuchsia-100 text-fuchsia-600 rounded-full flex items-center justify-center">
                                <BookOpen className="w-8 h-8" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900">Theory Review</h3>
                            <p className="text-sm text-slate-600">Validates your understanding of core physical and chemical principles.</p>
                        </div>

                        <div className="text-center space-y-4 p-6 hover:bg-slate-50 rounded-2xl transition">
                            <div className="w-16 h-16 mx-auto bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                                <Microscope className="w-8 h-8" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900">Methodology</h3>
                            <p className="text-sm text-slate-600">Questions probing why specific scientific apparatus or methods were chosen.</p>
                        </div>

                        <div className="text-center space-y-4 p-6 hover:bg-slate-50 rounded-2xl transition">
                            <div className="w-16 h-16 mx-auto bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
                                <Sparkles className="w-8 h-8" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900">Result Analysis</h3>
                            <p className="text-sm text-slate-600">Justify anomalous data points, calculation logic, and result deviations.</p>
                        </div>

                        <div className="text-center space-y-4 p-6 hover:bg-slate-50 rounded-2xl transition">
                            <div className="w-16 h-16 mx-auto bg-amber-100 text-amber-600 rounded-full flex items-center justify-center">
                                <Brain className="w-8 h-8" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900">Model Answers</h3>
                            <p className="text-sm text-slate-600">Not just questions! Provide detailed model answers to help you study efficiently.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-20 px-6 sm:px-12 bg-slate-50 border-t border-slate-200">
                <div className="max-w-3xl mx-auto space-y-8">
                    <h2 className="text-2xl font-bold text-center text-slate-900">Example Generated Questions</h2>
                    <div className="space-y-4">
                        <div className="p-6 bg-white border border-slate-200 rounded-xl">
                            <p className="font-semibold text-fuchsia-900">Q: Why do we use phenolphthalein as an indicator instead of methyl orange in this specific acid-base titration?</p>
                            <div className="mt-4 text-sm text-slate-600 bg-slate-50 p-4 border border-slate-100 rounded-lg">
                                <span className="font-bold">AI Suggested Answer:</span> Phenolphthalein is suitable for strong acid-strong base titrations because its pH range (8.2-10.0) covers the steep change in pH at the equivalence point better than methyl orange.
                            </div>
                        </div>
                        <div className="p-6 bg-white border border-slate-200 rounded-xl">
                            <p className="font-semibold text-fuchsia-900">Q: From your plotted graph, why does the voltage curve flatten out at higher resistance values?</p>
                            <div className="mt-4 text-sm text-slate-600 bg-slate-50 p-4 border border-slate-100 rounded-lg">
                                <span className="font-bold">AI Suggested Answer:</span> The flattening indicates the circuit approaches its open-circuit voltage limits, demonstrating the non-ideal internal resistance characteristics of the tested battery.
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-24 px-6 sm:px-12 bg-slate-900 text-center relative overflow-hidden">
                <div className="max-w-3xl mx-auto space-y-8 relative z-10">
                    <BookOpen className="w-16 h-16 mx-auto text-fuchsia-400" />
                    <h2 className="text-3xl md:text-4xl font-bold text-white">Ace your next lab evaluation.</h2>
                    <Link href="/auth/signup">
                        <Button size="lg" className="bg-fuchsia-500 hover:bg-fuchsia-600 text-white font-bold h-14 px-8 rounded-full">
                            Get Practice Questions
                        </Button>
                    </Link>
                    <div className="pt-12 mt-12 border-t border-slate-800 flex justify-center gap-6 text-sm">
                        <Link href="/" className="text-slate-400 hover:text-white">Home</Link>
                        <Link href="/ai-lab-report-generator" className="text-slate-400 hover:text-white">Report Generator</Link>
                    </div>
                </div>
            </section>
        </div>
    );
}

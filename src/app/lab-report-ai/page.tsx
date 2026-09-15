import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle, Clock, BrainCircuit } from 'lucide-react';

export const metadata: Metadata = {
    title: "AI Lab Report Generator for Students | LabRecord AI",
    description: "Generate lab reports automatically using AI. Perfect for engineering, pharmacy and science students.",
    keywords: ["lab record generator", "engineering lab record", "lab report generator", "lab record AI"],
    alternates: {
        canonical: 'https://labrecord.cloud/lab-report-ai',
    },
    openGraph: {
        title: "AI Lab Report Generator for Students | LabRecord AI",
        description: "Generate lab reports automatically using AI. Perfect for engineering, pharmacy and science students.",
        url: "https://labrecord.cloud/lab-report-ai",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "AI Lab Report Generator for Students",
        description: "Generate lab reports automatically using AI.",
    },
};

export default function LabReportAIPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <section className="bg-slate-50 py-20 px-6 sm:px-12 text-center border-b border-slate-200">
                <div className="max-w-4xl mx-auto space-y-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold mb-4">
                        <SparklesIcon className="w-4 h-4" /> Powered by Advanced AI
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
                        AI Lab <span className="text-blue-600">Report</span> Generator
                    </h1>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                        The smartest way for science, engineering, and pharmacy students to draft comprehensive lab reports automatically.
                    </p>
                    <div className="pt-6">
                        <Link href="/dashboard">
                            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold h-14 px-8 rounded-full shadow-lg shadow-blue-200">
                                Write My Report <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            <section className="py-20 px-6 sm:px-12 bg-white">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center space-y-4 mb-16">
                        <h2 className="text-3xl font-bold text-slate-900">Why Use Our AI Generator?</h2>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                            Stop stressing over formatting and focus on your actual findings.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="text-center space-y-4 p-6">
                            <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                <Clock className="w-6 h-6 text-blue-600" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900">Save 5+ Hours</h3>
                            <p className="text-slate-600">Turn hours of manual drafting into seconds of automated generation.</p>
                        </div>
                        <div className="text-center space-y-4 p-6">
                            <div className="mx-auto w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                                <CheckCircle className="w-6 h-6 text-emerald-600" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900">Zero Errors</h3>
                            <p className="text-slate-600">Eliminate formatting mistakes and calculation errors in observation tables.</p>
                        </div>
                        <div className="text-center space-y-4 p-6">
                            <div className="mx-auto w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                                <BrainCircuit className="w-6 h-6 text-indigo-600" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900">Smart Analysis</h3>
                            <p className="text-slate-600">Our AI understands experimental data to write coherent conclusions and theories.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-20 px-6 sm:px-12 bg-slate-50 border-y border-slate-200">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">How It Works</h2>

                    <div className="space-y-8">
                        <div className="flex gap-6 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                            <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg">1</div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">Provide Your Input</h3>
                                <p className="text-slate-600">Enter the title of your experiment and your raw data values into our simple dashboard.</p>
                            </div>
                        </div>
                        <div className="flex gap-6 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                            <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg">2</div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">AI Processing</h3>
                                <p className="text-slate-600">Our engine calculates the results, structures the tables, plots the graphs, and writes the theory.</p>
                            </div>
                        </div>
                        <div className="flex gap-6 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                            <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg">3</div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">Download PDF</h3>
                                <p className="text-slate-600">Review your generated report and export it instantly as a perfectly formatted PDF document.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-24 px-6 sm:px-12 bg-slate-900 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/40 via-slate-900 to-slate-900 pointer-events-none" />
                <div className="max-w-3xl mx-auto space-y-8 relative z-10">
                    <h2 className="text-3xl md:text-4xl font-bold text-white">Experience effortless lab reporting.</h2>
                    <Link href="/dashboard">
                        <Button size="lg" className="bg-white hover:bg-slate-100 text-slate-900 font-bold h-14 px-8 rounded-full mt-4">
                            Get Started for Free
                        </Button>
                    </Link>

                    <div className="pt-12 mt-12 border-t border-slate-800 flex flex-wrap justify-center gap-6 text-sm">
                        <Link href="/" className="text-slate-400 hover:text-white transition-colors">Home</Link>
                        <Link href="/engineering-lab-record-generator" className="text-slate-400 hover:text-white transition-colors">Engineering Lab Records</Link>
                        <Link href="/pharmacy-lab-record-generator" className="text-slate-400 hover:text-white transition-colors">Pharmacy Lab Records</Link>
                    </div>
                </div>
            </section>
        </div>
    );
}

function SparklesIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
            <path d="M5 3v4" />
            <path d="M19 17v4" />
            <path d="M3 5h4" />
            <path d="M17 19h4" />
        </svg>
    );
}

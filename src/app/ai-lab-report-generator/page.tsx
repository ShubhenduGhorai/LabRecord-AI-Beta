import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, FileText, CheckCircle, Zap } from 'lucide-react';

export const metadata: Metadata = {
    title: "AI Lab Report Generator for Students | LabRecord AI",
    description: "Generate lab reports automatically including aim, theory, procedure, calculations and conclusion.",
    keywords: ["AI lab report generator", "write lab report online", "automatic lab report", "engineering lab report generator", "science lab report generator"],
    alternates: {
        canonical: 'https://labrecord.cloud/ai-lab-report-generator',
    },
    openGraph: {
        title: "AI Lab Report Generator for Students",
        description: "Generate lab reports automatically including aim, theory, procedure, calculations and conclusion.",
        url: "https://labrecord.cloud/ai-lab-report-generator",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "AI Lab Report Generator",
        description: "Generate lab reports automatically including aim, theory, procedure, calculations and conclusion.",
    },
};

export default function AILabReportGenerator() {
    return (
        <div className="flex flex-col min-h-screen">
            <section className="bg-indigo-50 py-20 px-6 sm:px-12 text-center border-b border-indigo-100">
                <div className="max-w-4xl mx-auto space-y-6">
                    <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
                        AI Lab <span className="text-indigo-600">Report</span> Writer
                    </h1>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                        Automate the tedious process of writing lab documentation. Generate complete, academically structured lab reports from your raw data in seconds.
                    </p>
                    <div className="pt-6">
                        <Link href="/dashboard">
                            <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold h-14 px-8 rounded-full shadow-lg shadow-indigo-200">
                                Write My Report Automatically <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            <section className="py-20 px-6 sm:px-12 bg-white">
                <div className="max-w-5xl mx-auto space-y-16">
                    <div className="text-center space-y-6">
                        <h2 className="text-3xl font-bold text-slate-900">End-to-End Report Automation</h2>
                        <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                            Our AI engine understands your experiment context and parameters, intelligently generating every required section of a standard laboratory report so you can submit your work flawlessly and on time.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="flex gap-4 p-6 bg-slate-50 border border-slate-100 rounded-2xl">
                            <CheckCircle className="w-6 h-6 text-indigo-600 flex-shrink-0" />
                            <div>
                                <h3 className="text-lg font-bold text-slate-900">Aim Generation</h3>
                                <p className="text-slate-600">Instantly drafts a clear, concise objective statement defining the purpose of your experiment.</p>
                            </div>
                        </div>

                        <div className="flex gap-4 p-6 bg-slate-50 border border-slate-100 rounded-2xl">
                            <CheckCircle className="w-6 h-6 text-indigo-600 flex-shrink-0" />
                            <div>
                                <h3 className="text-lg font-bold text-slate-900">Theory Framework</h3>
                                <p className="text-slate-600">Automatically pulls in relevant academic theory, formulas, and principles backing your work.</p>
                            </div>
                        </div>

                        <div className="flex gap-4 p-6 bg-slate-50 border border-slate-100 rounded-2xl">
                            <CheckCircle className="w-6 h-6 text-indigo-600 flex-shrink-0" />
                            <div>
                                <h3 className="text-lg font-bold text-slate-900">Structured Procedure</h3>
                                <p className="text-slate-600">Breaks down your experiment into a readable, step-by-step methodology section.</p>
                            </div>
                        </div>

                        <div className="flex gap-4 p-6 bg-slate-50 border border-slate-100 rounded-2xl">
                            <CheckCircle className="w-6 h-6 text-indigo-600 flex-shrink-0" />
                            <div>
                                <h3 className="text-lg font-bold text-slate-900">Automated Calculations</h3>
                                <p className="text-slate-600">Populates observation tables and computes all necessary final values without manual math.</p>
                            </div>
                        </div>

                        <div className="flex gap-4 p-6 bg-slate-50 border border-slate-100 rounded-2xl md:col-span-2">
                            <Zap className="w-6 h-6 text-amber-500 flex-shrink-0" />
                            <div>
                                <h3 className="text-lg font-bold text-slate-900">Intelligent Conclusion</h3>
                                <p className="text-slate-600">Summarizes your findings, analyzes potential errors, and determines if the aim was achieved effectively.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-24 px-6 sm:px-12 bg-slate-900 text-center relative overflow-hidden">
                <div className="max-w-3xl mx-auto space-y-8 relative z-10">
                    <FileText className="w-16 h-16 mx-auto text-indigo-400" />
                    <h2 className="text-3xl md:text-4xl font-bold text-white">Let AI handle the writing.</h2>
                    <Link href="/dashboard">
                        <Button size="lg" className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold h-14 px-8 rounded-full">
                            Generate Your Full Report
                        </Button>
                    </Link>
                    <div className="pt-12 mt-12 border-t border-slate-800 flex justify-center gap-6 text-sm">
                        <Link href="/" className="text-slate-400 hover:text-white">Home</Link>
                        <Link href="/ai-lab-data-analysis" className="text-slate-400 hover:text-white">Data Analysis</Link>
                        <Link href="/ai-viva-preparation" className="text-slate-400 hover:text-white">Viva Prep</Link>
                    </div>
                </div>
            </section>
        </div>
    );
}

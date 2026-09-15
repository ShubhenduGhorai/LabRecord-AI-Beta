import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Calculator, Activity, Sigma, ShieldAlert } from 'lucide-react';

export const metadata: Metadata = {
    title: "AI Lab Data Analysis Tool | LabRecord AI",
    description: "Automatically calculate mean, standard deviation, regression, and experimental error using AI. A complete data analysis tool for lab reports.",
    keywords: ["lab data analysis tool", "calculate mean online", "lab report regression", "experimental error calculator", "AI lab tool"],
    alternates: {
        canonical: 'https://labrecord.cloud/ai-lab-data-analysis',
    },
    openGraph: {
        title: "AI Lab Data Analysis Tool | LabRecord AI",
        description: "Automatically calculate mean, standard deviation, regression, and experimental error using AI.",
        url: "https://labrecord.cloud/ai-lab-data-analysis",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "AI Lab Data Analysis Tool",
        description: "Automatically calculate mean, standard deviation, regression, and experimental error using AI.",
    },
};

export default function AILabDataAnalysis() {
    return (
        <div className="flex flex-col min-h-screen">
            <section className="bg-slate-50 py-20 px-6 sm:px-12 text-center border-b border-slate-200">
                <div className="max-w-4xl mx-auto space-y-6">
                    <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
                        <span className="text-blue-600">AI</span> Lab Data Analysis Tool
                    </h1>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                        Stop struggling with complex formulas. Automatically calculate mean, standard deviation, linear regression, and experimental error instantly with our advanced AI data analytics engine.
                    </p>
                    <div className="pt-6">
                        <Link href="/dashboard">
                            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold h-14 px-8 rounded-full shadow-lg shadow-blue-200">
                                Analyze Your Lab Data <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            <section className="py-20 px-6 sm:px-12 bg-white">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center space-y-6 mb-16">
                        <h2 className="text-3xl font-bold text-slate-900">Comprehensive Statistical Calculations</h2>
                        <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                            Whether you are an engineering, science, or medical student, accurate data analysis is critical for your lab reports. Our AI tool ingests your raw experimental readings and executes all necessary statistical calculations with absolute precision, providing you with ready-to-use results for your final documentation.
                        </p>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-8">
                        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 flex gap-4">
                            <div className="mt-1 bg-white p-2 rounded-lg shadow-sm h-fit">
                                <Calculator className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">Mean Calculation</h3>
                                <p className="text-slate-600">Instantly compute averages from large datasets of experimental trials.</p>
                            </div>
                        </div>

                        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 flex gap-4">
                            <div className="mt-1 bg-white p-2 rounded-lg shadow-sm h-fit">
                                <Sigma className="w-6 h-6 text-indigo-600" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">Standard Deviation</h3>
                                <p className="text-slate-600">Accurately determine the variance and standard deviation of your readings to quantify data spread.</p>
                            </div>
                        </div>

                        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 flex gap-4">
                            <div className="mt-1 bg-white p-2 rounded-lg shadow-sm h-fit">
                                <Activity className="w-6 h-6 text-emerald-600" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">Regression Analysis</h3>
                                <p className="text-slate-600">Perform linear regression to find lines of best fit, slopes, and y-intercepts automatically.</p>
                            </div>
                        </div>

                        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 flex gap-4">
                            <div className="mt-1 bg-white p-2 rounded-lg shadow-sm h-fit">
                                <ShieldAlert className="w-6 h-6 text-rose-600" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">Experimental Error</h3>
                                <p className="text-slate-600">Calculate absolute and percentage errors by comparing your experimental yields against theoretical values.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-24 px-6 sm:px-12 bg-slate-900 text-center text-white relative overflow-hidden">
                <div className="max-w-3xl mx-auto space-y-8 relative z-10">
                    <h2 className="text-3xl md:text-4xl font-bold">Simplify Your Result Documentation</h2>
                    <Link href="/dashboard">
                        <Button size="lg" className="bg-white hover:bg-slate-100 text-slate-900 font-bold h-14 px-8 rounded-full">
                            Start Analyzing Data For Free
                        </Button>
                    </Link>
                    <div className="pt-12 mt-12 border-t border-slate-800 flex justify-center gap-6 text-sm">
                        <Link href="/" className="text-slate-400 hover:text-white">Home</Link>
                        <Link href="/lab-graph-generator" className="text-slate-400 hover:text-white">Graph Generator</Link>
                        <Link href="/ai-lab-report-generator" className="text-slate-400 hover:text-white">Report Generator</Link>
                    </div>
                </div>
            </section>
        </div>
    );
}

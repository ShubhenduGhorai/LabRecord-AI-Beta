import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Pill, Table, FileSpreadsheet, ShieldCheck } from 'lucide-react';

export const metadata: Metadata = {
    title: "Pharmacy Lab Record Generator | LabRecord AI",
    description: "AI tool for pharmacy students to generate lab record books automatically with tables and formatted reports.",
    keywords: ["lab record generator", "pharmacy lab record", "lab report generator", "lab record AI"],
    alternates: {
        canonical: 'https://labrecord.cloud/pharmacy-lab-record-generator',
    },
    openGraph: {
        title: "Pharmacy Lab Record Generator | LabRecord AI",
        description: "AI tool for pharmacy students to generate lab record books automatically with tables and formatted reports.",
        url: "https://labrecord.cloud/pharmacy-lab-record-generator",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Pharmacy Lab Record Generator",
        description: "AI tool for pharmacy students to generate lab records automatically.",
    },
};

export default function PharmacyLabRecordGenerator() {
    return (
        <div className="flex flex-col min-h-screen">
            <section className="bg-indigo-50 py-20 px-6 sm:px-12 text-center border-b border-indigo-100">
                <div className="max-w-4xl mx-auto space-y-6">
                    <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
                        AI <span className="text-emerald-600">Pharmacy</span> Lab Record Generator
                    </h1>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                        Create detailed, accurately formatted pharmacy lab record books instantly with our specialized AI writing tool.
                    </p>
                    <div className="pt-6">
                        <Link href="/dashboard">
                            <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold h-14 px-8 rounded-full shadow-lg shadow-emerald-200">
                                Start Generating <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            <section className="py-20 px-6 sm:px-12 bg-white">
                <div className="max-w-5xl mx-auto space-y-16">
                    <div className="text-center space-y-6">
                        <h2 className="text-3xl font-bold text-slate-900">Pharmacy Lab Documentation is Complex</h2>
                        <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                            Pharmacy students handle complex formulations, titrations, and strict procedural documentation. Manually writing out the theory, procedure, observation tables, and precise conclusion calculations for every experiment is tedious and prone to formatting errors.
                        </p>
                    </div>

                    <div className="bg-slate-50 p-8 sm:p-12 rounded-3xl border border-slate-100 text-center space-y-6">
                        <h2 className="text-2xl font-bold text-emerald-950">The Benefits of Automation</h2>
                        <p className="text-lg text-slate-700 max-w-2xl mx-auto">
                            LabRecord AI automates the heavy lifting. By providing just the basic experimental parameters, our AI constructs the complete record. This ensures you maintain standard formatting, accurate table layouts, and structurally sound documentation without spending hours writing.
                        </p>
                    </div>
                </div>
            </section>

            <section className="py-20 px-6 sm:px-12 bg-white border-t border-slate-100">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">Features Designed for Pharmacy</h2>

                    <div className="grid sm:grid-cols-2 gap-8">
                        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 flex gap-4">
                            <div className="mt-1 bg-white p-2 rounded-lg shadow-sm h-fit">
                                <Table className="w-6 h-6 text-emerald-600" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">Automated Data Tables</h3>
                                <p className="text-slate-600">Instantly generate perfectly formatted observation and calculation tables for titrations and assays.</p>
                            </div>
                        </div>

                        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 flex gap-4">
                            <div className="mt-1 bg-white p-2 rounded-lg shadow-sm h-fit">
                                <FileSpreadsheet className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">Detailed Formatting</h3>
                                <p className="text-slate-600">Strict adherence to academic structures, including Aim, Principle, Procedure, Observation, and Result.</p>
                            </div>
                        </div>

                        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 flex gap-4">
                            <div className="mt-1 bg-white p-2 rounded-lg shadow-sm h-fit">
                                <Pill className="w-6 h-6 text-purple-600" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">Formulation Focused</h3>
                                <p className="text-slate-600">Specialized structural support for pharmaceutics and medicinal chemistry experiments.</p>
                            </div>
                        </div>

                        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 flex gap-4">
                            <div className="mt-1 bg-white p-2 rounded-lg shadow-sm h-fit">
                                <ShieldCheck className="w-6 h-6 text-indigo-600" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">Instant Print Readiness</h3>
                                <p className="text-slate-600">Export as a clean PDF ready to be printed and submitted for evaluation immediately.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-24 px-6 sm:px-12 bg-slate-900 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-900/30 via-slate-900 to-slate-900 pointer-events-none" />
                <div className="max-w-3xl mx-auto space-y-8 relative z-10">
                    <h2 className="text-3xl md:text-4xl font-bold text-white">Streamline your pharmacy labs today.</h2>
                    <Link href="/dashboard">
                        <Button size="lg" className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold h-14 px-8 rounded-full mt-4">
                            Generate Your First Record
                        </Button>
                    </Link>

                    <div className="pt-12 mt-12 border-t border-slate-800 flex flex-wrap justify-center gap-6 text-sm">
                        <Link href="/" className="text-slate-400 hover:text-white transition-colors">Home</Link>
                        <Link href="/engineering-lab-record-generator" className="text-slate-400 hover:text-white transition-colors">Engineering Lab Records</Link>
                        <Link href="/lab-report-ai" className="text-slate-400 hover:text-white transition-colors">AI Lab Reports</Link>
                    </div>
                </div>
            </section>
        </div>
    );
}

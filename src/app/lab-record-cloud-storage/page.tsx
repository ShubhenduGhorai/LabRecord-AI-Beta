import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Cloud, Database, Lock, FolderOpen } from 'lucide-react';

export const metadata: Metadata = {
    title: "Cloud Storage for Lab Records | LabRecord AI",
    description: "Save and organize all your lab experiments in one secure cloud dashboard.",
    keywords: ["lab record cloud storage", "save lab reports online", "student lab database", "experiment tracking software", "secure lab record storage"],
    alternates: {
        canonical: 'https://labrecord.cloud/lab-record-cloud-storage',
    },
    openGraph: {
        title: "Cloud Storage for Lab Records",
        description: "Save and organize all your lab experiments in one secure cloud dashboard.",
        url: "https://labrecord.cloud/lab-record-cloud-storage",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Cloud Storage for Lab Records",
        description: "Save and organize all your lab experiments in one secure cloud dashboard.",
    },
};

export default function CloudStoragePage() {
    return (
        <div className="flex flex-col min-h-screen">
            <section className="bg-slate-50 py-20 px-6 sm:px-12 text-center border-b border-slate-200">
                <div className="max-w-4xl mx-auto space-y-6">
                    <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
                        Cloud Storage for <span className="text-sky-600">Lab Records</span>
                    </h1>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                        Never lose an experiment again. Save, organize, and instantly access all your formatted lab records in one centralized, secure dashboard.
                    </p>
                    <div className="pt-6">
                        <Link href="/dashboard">
                            <Button size="lg" className="bg-sky-600 hover:bg-sky-700 text-white font-semibold h-14 px-8 rounded-full shadow-lg shadow-sky-200">
                                Start Storing Records <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            <section className="py-20 px-6 sm:px-12 bg-white">
                <div className="max-w-5xl mx-auto space-y-16">
                    <div className="text-center space-y-6">
                        <h2 className="text-3xl font-bold text-slate-900">The Ultimate Student Database</h2>
                        <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                            Keeping track of physical lab manuals and scattered word documents across semesters is a nightmare for engineering and medical students. LabRecord AI provides a structured cloud vault designed specifically to house your scientific experiments.
                        </p>
                    </div>

                    <div className="grid sm:grid-cols-3 gap-8 text-center max-w-4xl mx-auto">
                        <div className="space-y-4">
                            <div className="w-16 h-16 mx-auto bg-sky-100 text-sky-600 rounded-full flex items-center justify-center">
                                <FolderOpen className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900">Semester Organization</h3>
                            <p className="text-slate-600 text-sm">Tag and separate your records by subject, semester, or laboratory module for immediate retrieval.</p>
                        </div>

                        <div className="space-y-4">
                            <div className="w-16 h-16 mx-auto bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
                                <Database className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900">Automated Sync</h3>
                            <p className="text-slate-600 text-sm">Every report you generate using our AI tools is automatically stored and indexed in your vault.</p>
                        </div>

                        <div className="space-y-4">
                            <div className="w-16 h-16 mx-auto bg-slate-100 text-slate-600 rounded-full flex items-center justify-center">
                                <Lock className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900">Bank-Level Security</h3>
                            <p className="text-slate-600 text-sm">Rest easy knowing your academic work is protected by enterprise-grade encryption and secure authentication.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-24 px-6 sm:px-12 bg-slate-900 text-center relative overflow-hidden">
                <div className="max-w-3xl mx-auto space-y-8 relative z-10">
                    <Cloud className="w-16 h-16 mx-auto text-sky-400" />
                    <h2 className="text-3xl md:text-4xl font-bold text-white">Consolidate your academic workflow.</h2>
                    <Link href="/dashboard">
                        <Button size="lg" className="bg-sky-500 hover:bg-sky-600 text-white font-bold h-14 px-8 rounded-full mt-4">
                            Create Your Cloud Vault
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

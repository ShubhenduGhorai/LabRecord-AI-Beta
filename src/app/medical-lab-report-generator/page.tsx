import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Stethoscope, TestTube, FileHeart, ShieldPlus, HeartPulse } from 'lucide-react';

export const metadata: Metadata = {
    title: "Medical Lab Report Generator | LabRecord AI",
    description: "Specifically tailored AI lab report generator for medical, nursing, and clinical students. Automate clinical pathology, anatomy, and physiology reports.",
    keywords: ["medical lab report generator", "clinical lab report AI", "anatomy lab record", "physiology experiment generator", "nursing lab manual"],
    alternates: {
        canonical: 'https://labrecord.cloud/medical-lab-report-generator',
    },
    openGraph: {
        title: "Medical Lab Report Generator",
        description: "Tailored AI lab report generator for medical and clinical students.",
        url: "https://labrecord.cloud/medical-lab-report-generator",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Medical Lab Report Generator",
        description: "Tailored AI lab report generator for medical and clinical students.",
    },
};

export default function MedicalLabReportGenerator() {
    return (
        <div className="flex flex-col min-h-screen">
            <section className="bg-slate-50 py-20 px-6 sm:px-12 text-center border-b border-slate-200">
                <div className="max-w-4xl mx-auto space-y-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100 text-rose-700 text-sm font-semibold mb-4">
                        <Stethoscope className="w-4 h-4" /> Built for Medical Students
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
                        <span className="text-rose-600">Medical</span> Lab Report Generator
                    </h1>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                        Stop struggling with formatting intricate clinical pathology results, histology drawings, and physiology tables. Let our AI draft your medical lab records in standard format.
                    </p>
                    <div className="pt-6">
                        <Link href="/dashboard">
                            <Button size="lg" className="bg-rose-600 hover:bg-rose-700 text-white font-semibold h-14 px-8 rounded-full shadow-lg shadow-rose-200">
                                Generate Clinical Report <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            <section className="py-20 px-6 sm:px-12 bg-white">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">Designed for Medical Disciplines</h2>

                    <div className="grid sm:grid-cols-2 gap-8">
                        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 flex gap-4">
                            <div className="mt-1 bg-white p-2 rounded-lg shadow-sm h-fit">
                                <HeartPulse className="w-6 h-6 text-rose-600" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">Physiology</h3>
                                <p className="text-slate-600">Blood pressure arrays, ECG interpretation tables, respiratory capacity math, and muscle twitch data analysis.</p>
                            </div>
                        </div>

                        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 flex gap-4">
                            <div className="mt-1 bg-white p-2 rounded-lg shadow-sm h-fit">
                                <TestTube className="w-6 h-6 text-indigo-600" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">Clinical Pathology</h3>
                                <p className="text-slate-600">Format blood smear differentials, urinalysis chemical breakdown tables, and hematology indices flawlessly.</p>
                            </div>
                        </div>

                        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 flex gap-4">
                            <div className="mt-1 bg-white p-2 rounded-lg shadow-sm h-fit">
                                <ShieldPlus className="w-6 h-6 text-emerald-600" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">Pharmacology</h3>
                                <p className="text-slate-600">Dose-response curve generation, pharmacokinetics tables, and automated LD50/ED50 result structuring.</p>
                            </div>
                        </div>

                        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 flex gap-4">
                            <div className="mt-1 bg-white p-2 rounded-lg shadow-sm h-fit">
                                <FileHeart className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">Anatomy & Histology</h3>
                                <p className="text-slate-600">Organize identification tags, tissue layer descriptions, and structural theory into readable academic paragraphs.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-24 px-6 sm:px-12 bg-slate-900 text-center relative overflow-hidden">
                <div className="max-w-3xl mx-auto space-y-8 relative z-10">
                    <Stethoscope className="w-16 h-16 mx-auto text-rose-400" />
                    <h2 className="text-3xl md:text-4xl font-bold text-white">Streamline your medical documentations.</h2>
                    <Link href="/dashboard">
                        <Button size="lg" className="bg-rose-500 hover:bg-rose-600 text-white font-bold h-14 px-8 rounded-full mt-4">
                            Create My Clinical Report
                        </Button>
                    </Link>
                    <div className="pt-12 mt-12 border-t border-slate-800 flex justify-center gap-6 text-sm">
                        <Link href="/" className="text-slate-400 hover:text-white">Home</Link>
                        <Link href="/pharmacy-lab-record-generator" className="text-slate-400 hover:text-white">Pharmacy Labs</Link>
                    </div>
                </div>
            </section>
        </div>
    );
}

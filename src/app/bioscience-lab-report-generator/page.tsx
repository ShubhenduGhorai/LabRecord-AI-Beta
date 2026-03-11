import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Dna, Leaf, Bug, Fingerprint, DatabaseZap } from 'lucide-react';

export const metadata: Metadata = {
    title: "Bioscience Lab Report Generator | LabRecord AI",
    description: "Specifically tailored AI lab report generator for biology and bioscience students. Automate genetics, microbiology, and botany reports.",
    keywords: ["bioscience lab report generator", "biology lab report AI", "genetics lab record", "microbiology experiment generator", "botany lab manual"],
    alternates: {
        canonical: 'https://labrecord.cloud/bioscience-lab-report-generator',
    },
    openGraph: {
        title: "Bioscience Lab Report Generator",
        description: "Tailored AI lab report generator for biology and bioscience students.",
        url: "https://labrecord.cloud/bioscience-lab-report-generator",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Bioscience Lab Report Generator",
        description: "Tailored AI lab report generator for biology and bioscience students.",
    },
};

export default function BioscienceLabReportGenerator() {
    return (
        <div className="flex flex-col min-h-screen">
            <section className="bg-slate-50 py-20 px-6 sm:px-12 text-center border-b border-slate-200">
                <div className="max-w-4xl mx-auto space-y-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-sm font-semibold mb-4">
                        <Dna className="w-4 h-4" /> Built for Biology Students
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
                        <span className="text-emerald-600">Bioscience</span> Lab Report Generator
                    </h1>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                        Stop struggling with formatting intricate microbiology observations, genetic inheritance grids, and botany tables. Let our AI draft your bioscience lab records in standard format.
                    </p>
                    <div className="pt-6">
                        <Link href="/dashboard">
                            <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold h-14 px-8 rounded-full shadow-lg shadow-emerald-200">
                                Generate Bio Report <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            <section className="py-20 px-6 sm:px-12 bg-white">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">Designed for Biological Sciences</h2>

                    <div className="grid sm:grid-cols-2 gap-8">
                        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 flex gap-4">
                            <div className="mt-1 bg-white p-2 rounded-lg shadow-sm h-fit">
                                <Dna className="w-6 h-6 text-emerald-600" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">Genetics & Molecular Biology</h3>
                                <p className="text-slate-600">Punnett square probability calculations, DNA sequencing error logs, and PCR amplification methodology structuring.</p>
                            </div>
                        </div>

                        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 flex gap-4">
                            <div className="mt-1 bg-white p-2 rounded-lg shadow-sm h-fit">
                                <Bug className="w-6 h-6 text-indigo-600" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">Microbiology</h3>
                                <p className="text-slate-600">Format bacterial colony counting, gram-stain observation tables, and pathogenic incubation results flawlessly.</p>
                            </div>
                        </div>

                        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 flex gap-4">
                            <div className="mt-1 bg-white p-2 rounded-lg shadow-sm h-fit">
                                <Leaf className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">Botany & Zoology</h3>
                                <p className="text-slate-600">Specimen classification hierarchies, photosynthetic rate graphs, and dissection procedural logs generated instantly.</p>
                            </div>
                        </div>

                        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 flex gap-4">
                            <div className="mt-1 bg-white p-2 rounded-lg shadow-sm h-fit">
                                <DatabaseZap className="w-6 h-6 text-orange-600" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">Biochemistry</h3>
                                <p className="text-slate-600">Protein assay spectrophotometry plotting, enzyme kinetics math, and macromolecule breakdown tables.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-24 px-6 sm:px-12 bg-slate-900 text-center relative overflow-hidden">
                <div className="max-w-3xl mx-auto space-y-8 relative z-10">
                    <Fingerprint className="w-16 h-16 mx-auto text-emerald-400" />
                    <h2 className="text-3xl md:text-4xl font-bold text-white">Streamline your biological documentation.</h2>
                    <Link href="/dashboard">
                        <Button size="lg" className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold h-14 px-8 rounded-full mt-4">
                            Create My Bio Report
                        </Button>
                    </Link>
                    <div className="pt-12 mt-12 border-t border-slate-800 flex justify-center gap-6 text-sm">
                        <Link href="/" className="text-slate-400 hover:text-white">Home</Link>
                        <Link href="/medical-lab-report-generator" className="text-slate-400 hover:text-white">Medical Labs</Link>
                    </div>
                </div>
            </section>
        </div>
    );
}

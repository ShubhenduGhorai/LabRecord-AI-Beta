import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Text, Download, ListChecks, FileDigit } from 'lucide-react';

export const metadata: Metadata = {
    title: "Research Paper Formatter | IEEE Format Generator | LabRecord AI",
    description: "Export lab reports and research papers in exact IEEE, APA, or custom academic formats automatically.",
    keywords: ["research paper formatter", "IEEE format generator", "APA lab report", "academic paper format tool", "lab report export PDF"],
    alternates: {
        canonical: 'https://labrecord.cloud/research-paper-formatter',
    },
    openGraph: {
        title: "Research Paper Formatter | IEEE Format Generator",
        description: "Export lab reports and research papers in exact IEEE, APA, or custom academic formats automatically.",
        url: "https://labrecord.cloud/research-paper-formatter",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Research Paper Formatter",
        description: "Export lab reports and research papers in exact IEEE, APA, or custom academic formats automatically.",
    },
};

export default function ResearchPaperFormatter() {
    return (
        <div className="flex flex-col min-h-screen">
            <section className="bg-slate-50 py-20 px-6 sm:px-12 text-center border-b border-slate-200">
                <div className="max-w-4xl mx-auto space-y-6">
                    <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
                        Research <span className="text-purple-600">Paper Formatter</span>
                    </h1>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                        Stop fighting with word processors. Instantly export your generated lab reports and research findings into strict IEEE, APA, or standard academic PDF formats.
                    </p>
                    <div className="pt-6">
                        <Link href="/dashboard">
                            <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white font-semibold h-14 px-8 rounded-full shadow-lg shadow-purple-200">
                                Format Your Paper <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            <section className="py-20 px-6 sm:px-12 bg-white">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center space-y-6 mb-16">
                        <h2 className="text-3xl font-bold text-slate-900">Flawless Academic Formatting</h2>
                        <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                            Getting the margins, references, citation styles, and two-column layouts exactly right is exhausting. The LabRecord Formatter handles the typesetting for you, guaranteeing your submission matches the exact requirements of your university or journal.
                        </p>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-8">
                        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 flex gap-4">
                            <div className="mt-1 bg-white p-2 rounded-lg shadow-sm h-fit">
                                <FileDigit className="w-6 h-6 text-purple-600" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">IEEE Specification</h3>
                                <p className="text-slate-600">Automatically convert your text into the classic two-column IEEE format required by engineering journals.</p>
                            </div>
                        </div>

                        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 flex gap-4">
                            <div className="mt-1 bg-white p-2 rounded-lg shadow-sm h-fit">
                                <Text className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">APA & MLA Styles</h3>
                                <p className="text-slate-600">Perfectly indented paragraphs, properly hanging reference lists, and automated title pages.</p>
                            </div>
                        </div>

                        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 flex gap-4">
                            <div className="mt-1 bg-white p-2 rounded-lg shadow-sm h-fit">
                                <ListChecks className="w-6 h-6 text-emerald-600" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">Reference Automation</h3>
                                <p className="text-slate-600">Input your sources and let the engine handle the complex inline citations and bibliography generation automatically.</p>
                            </div>
                        </div>

                        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 flex gap-4">
                            <div className="mt-1 bg-white p-2 rounded-lg shadow-sm h-fit">
                                <Download className="w-6 h-6 text-indigo-600" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">High-Fidelity PDF Export</h3>
                                <p className="text-slate-600">Generate a locked, print-ready PDF that preserves your equations, tables, and graphs without breaking across pages.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-24 px-6 sm:px-12 bg-slate-900 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/30 via-slate-900 to-slate-900 pointer-events-none" />
                <div className="max-w-3xl mx-auto space-y-8 relative z-10">
                    <ListChecks className="w-16 h-16 mx-auto text-purple-400" />
                    <h2 className="text-3xl md:text-4xl font-bold text-white">Focus on research, not margins.</h2>
                    <Link href="/dashboard">
                        <Button size="lg" className="bg-purple-500 hover:bg-purple-600 text-white font-bold h-14 px-8 rounded-full">
                            Format Paper For Free
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

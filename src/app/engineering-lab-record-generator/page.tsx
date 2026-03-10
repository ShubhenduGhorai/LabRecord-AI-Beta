import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle, FileText, Settings, BarChart } from 'lucide-react';

export const metadata: Metadata = {
    title: "Engineering Lab Record Generator | LabRecord AI",
    description: "Generate engineering lab record books automatically using AI. Save hours writing lab records manually.",
    keywords: ["lab record generator", "engineering lab record", "lab report generator", "lab record AI"],
    alternates: {
        canonical: 'https://labrecord.cloud/engineering-lab-record-generator',
    },
    openGraph: {
        title: "Engineering Lab Record Generator | LabRecord AI",
        description: "Generate engineering lab record books automatically using AI. Save hours writing lab records manually.",
        url: "https://labrecord.cloud/engineering-lab-record-generator",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Engineering Lab Record Generator",
        description: "Generate engineering lab records automatically using AI.",
    },
};

export default function EngineeringLabRecordGenerator() {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <section className="bg-slate-50 py-20 px-6 sm:px-12 text-center border-b border-slate-200">
                <div className="max-w-4xl mx-auto space-y-6">
                    <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
                        AI <span className="text-indigo-600">Engineering</span> Lab Record Generator
                    </h1>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                        Create formatted engineering lab record books instantly. Stop wasting hours compiling graphs and observation tables manually.
                    </p>
                    <div className="pt-6">
                        <Link href="/auth/signup">
                            <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold h-14 px-8 rounded-full shadow-lg shadow-indigo-200">
                                Generate Your Record Book <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Problem Section */}
            <section className="py-20 px-6 sm:px-12 bg-white">
                <div className="max-w-5xl mx-auto text-center space-y-8">
                    <h2 className="text-3xl font-bold text-slate-900">The Problem with Manual Lab Records</h2>
                    <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
                        Engineering students spend countless hours writing record books manually. From painstakingly drawing observation tables to calculating recurring formulas and plotting graphs by hand, the documentation process often takes longer than the actual experiment. This tedious work takes away valuable time that could be spent understanding core engineering concepts.
                    </p>
                </div>
            </section>

            {/* Solution Section */}
            <section className="py-20 px-6 sm:px-12 bg-indigo-50 border-y border-indigo-100">
                <div className="max-w-5xl mx-auto text-center space-y-8">
                    <h2 className="text-3xl font-bold text-indigo-950">The LabRecord AI Solution</h2>
                    <p className="text-lg text-indigo-900/80 max-w-3xl mx-auto leading-relaxed">
                        LabRecord AI transforms this grueling process. By simply inputting your raw experimental data, our advanced AI engine generates your complete engineering lab record instantly. It performs the necessary statistical analysis, creates accurate graphs, and structures the entire document according to standard academic formats.
                    </p>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 px-6 sm:px-12 bg-white">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">Powerful Features Built for Engineering</h2>

                    <div className="grid sm:grid-cols-2 gap-8">
                        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 flex gap-4">
                            <div className="mt-1 bg-white p-2 rounded-lg shadow-sm h-fit">
                                <Settings className="w-6 h-6 text-indigo-600" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">Observation Table Generator</h3>
                                <p className="text-slate-600">Automatically format and calculate derived values for your observation tables based on your raw inputs.</p>
                            </div>
                        </div>

                        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 flex gap-4">
                            <div className="mt-1 bg-white p-2 rounded-lg shadow-sm h-fit">
                                <BarChart className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">Automatic Graphs</h3>
                                <p className="text-slate-600">Generate high-quality, perfectly scaled engineering graphs, complete with regression lines and labelled axes.</p>
                            </div>
                        </div>

                        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 flex gap-4">
                            <div className="mt-1 bg-white p-2 rounded-lg shadow-sm h-fit">
                                <FileText className="w-6 h-6 text-emerald-600" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">Printable PDF Format</h3>
                                <p className="text-slate-600">Export your generated record instantly to a pre-formatted, print-ready PDF document adhering to academic standards.</p>
                            </div>
                        </div>

                        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 flex gap-4">
                            <div className="mt-1 bg-white p-2 rounded-lg shadow-sm h-fit">
                                <CheckCircle className="w-6 h-6 text-amber-600" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">Semester Record Generation</h3>
                                <p className="text-slate-600">Compile multiple experiments into a complete, indexed semester lab record book with a single click.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Internal Linking & CTA Section */}
            <section className="py-24 px-6 sm:px-12 bg-slate-900 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-900/40 via-slate-900 to-slate-900 pointer-events-none" />
                <div className="max-w-3xl mx-auto space-y-8 relative z-10">
                    <h2 className="text-3xl md:text-4xl font-bold text-white">Ready to automate your engineering labs?</h2>
                    <p className="text-xl text-slate-300">
                        Join thousands of engineering students saving time on documentation.
                    </p>
                    <Link href="/auth/signup">
                        <Button size="lg" className="bg-white hover:bg-slate-100 text-slate-900 font-bold h-14 px-8 rounded-full">
                            Generate Your Record Book Now
                        </Button>
                    </Link>

                    <div className="pt-12 mt-12 border-t border-slate-800 flex flex-wrap justify-center gap-6 text-sm">
                        <Link href="/" className="text-slate-400 hover:text-white transition-colors">Home</Link>
                        <Link href="/pharmacy-lab-record-generator" className="text-slate-400 hover:text-white transition-colors">Pharmacy Lab Records</Link>
                        <Link href="/lab-report-ai" className="text-slate-400 hover:text-white transition-colors">AI Lab Reports</Link>
                    </div>
                </div>
            </section>
        </div>
    );
}

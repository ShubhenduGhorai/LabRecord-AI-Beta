import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, BarChart3, LineChart, UploadCloud, Download } from 'lucide-react';

export const metadata: Metadata = {
    title: "Lab Graph Generator | LabRecord AI",
    description: "Generate professional lab graphs from CSV or Excel data instantly. Perfect for science and engineering lab reports.",
    keywords: ["lab graph generator", "generate lab graphs online", "science graph maker", "plot csv data online", "engineering graph software"],
    alternates: {
        canonical: 'https://labrecord.cloud/lab-graph-generator',
    },
    openGraph: {
        title: "Lab Graph Generator | LabRecord AI",
        description: "Generate professional lab graphs from CSV or Excel data instantly.",
        url: "https://labrecord.cloud/lab-graph-generator",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Lab Graph Generator",
        description: "Generate professional lab graphs from CSV or Excel data instantly.",
    },
};

export default function LabGraphGenerator() {
    return (
        <div className="flex flex-col min-h-screen">
            <section className="bg-slate-50 py-20 px-6 sm:px-12 text-center border-b border-slate-200">
                <div className="max-w-4xl mx-auto space-y-6">
                    <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
                        Lab <span className="text-emerald-600">Graph Generator</span>
                    </h1>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                        Transform your raw CSV and Excel data into perfectly scaled, professional scientific graphs in seconds. Ready to plug right into your lab reports.
                    </p>
                    <div className="pt-6">
                        <Link href="/auth/signup">
                            <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold h-14 px-8 rounded-full shadow-lg shadow-emerald-200">
                                Create a Graph <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            <section className="py-20 px-6 sm:px-12 bg-white">
                <div className="max-w-5xl mx-auto">
                    <div className="grid md:grid-cols-3 gap-8 text-center">

                        <div className="space-y-4 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                            <div className="w-16 h-16 mx-auto bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center">
                                <UploadCloud className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900">1. Upload CSV or Excel</h3>
                            <p className="text-slate-600">Securely drop your raw experimental data spreadsheet directly into our engine.</p>
                        </div>

                        <div className="space-y-4 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                            <div className="w-16 h-16 mx-auto bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center">
                                <LineChart className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900">2. Automatic Generation</h3>
                            <p className="text-slate-600">The AI intelligently scales axes, labels units, and plots precision data points and trendlines.</p>
                        </div>

                        <div className="space-y-4 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                            <div className="w-16 h-16 mx-auto bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center">
                                <Download className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900">3. Export for Reports</h3>
                            <p className="text-slate-600">Download high-resolution image files to embed straight into your lab record books or research papers.</p>
                        </div>

                    </div>
                </div>
            </section>

            <section className="py-24 px-6 sm:px-12 bg-slate-900 text-center text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-900/30 via-slate-900 to-slate-900 pointer-events-none" />
                <div className="max-w-3xl mx-auto space-y-8 relative z-10">
                    <BarChart3 className="w-16 h-16 mx-auto text-emerald-400" />
                    <h2 className="text-3xl md:text-4xl font-bold">Stop plotting points by hand.</h2>
                    <Link href="/auth/signup">
                        <Button size="lg" className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold h-14 px-8 rounded-full">
                            Start Graphing Free
                        </Button>
                    </Link>
                    <div className="pt-12 mt-12 border-t border-slate-800 flex justify-center gap-6 text-sm">
                        <Link href="/" className="text-slate-400 hover:text-white">Home</Link>
                        <Link href="/ai-lab-data-analysis" className="text-slate-400 hover:text-white">Data Analysis</Link>
                    </div>
                </div>
            </section>
        </div>
    );
}

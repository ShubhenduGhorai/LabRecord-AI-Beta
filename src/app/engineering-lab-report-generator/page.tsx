import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Wrench, HardHat, Cog, ShieldCheck, Zap } from 'lucide-react';

export const metadata: Metadata = {
    title: "Engineering Lab Report Generator | LabRecord AI",
    description: "Specifically tailored AI lab report generator for engineering students. Automate mechanical, civil, electrical, and software engineering lab documentation.",
    keywords: ["engineering lab report generator", "civil lab report", "mechanical lab report format", "electrical engineering lab record", "BTech lab manual AI"],
    alternates: {
        canonical: 'https://labrecord.cloud/engineering-lab-report-generator',
    },
    openGraph: {
        title: "Engineering Lab Report Generator",
        description: "Tailored AI lab report generator for engineering students.",
        url: "https://labrecord.cloud/engineering-lab-report-generator",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Engineering Lab Report Generator",
        description: "Tailored AI lab report generator for engineering students.",
    },
};

export default function EngineeringLabReportGenerator() {
    return (
        <div className="flex flex-col min-h-screen">
            <section className="bg-slate-50 py-20 px-6 sm:px-12 text-center border-b border-slate-200">
                <div className="max-w-4xl mx-auto space-y-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-sm font-semibold mb-4">
                        <HardHat className="w-4 h-4" /> Built for Engineering Students
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
                        <span className="text-orange-600">Engineering</span> Lab Report Generator
                    </h1>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                        Stop wasting hours formatting structural test results, mechanical readings, and electrical circuit graphs. Our AI generates complete engineering reports instantly.
                    </p>
                    <div className="pt-6">
                        <Link href="/auth/signup">
                            <Button size="lg" className="bg-orange-600 hover:bg-orange-700 text-white font-semibold h-14 px-8 rounded-full shadow-lg shadow-orange-200">
                                Generate Engineering Report <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            <section className="py-20 px-6 sm:px-12 bg-white">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">Solve Multi-Disciplinary Lab Requirements</h2>

                    <div className="grid sm:grid-cols-2 gap-8">
                        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 flex gap-4">
                            <div className="mt-1 bg-white p-2 rounded-lg shadow-sm h-fit">
                                <Cog className="w-6 h-6 text-orange-600" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">Mechanical Engineering</h3>
                                <p className="text-slate-600">Thermodynamics datasets, tensile strength graphing, and fluid mechanics derivations calculated flawlessly.</p>
                            </div>
                        </div>

                        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 flex gap-4">
                            <div className="mt-1 bg-white p-2 rounded-lg shadow-sm h-fit">
                                <Zap className="w-6 h-6 text-yellow-600" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">Electrical & Electronics</h3>
                                <p className="text-slate-600">Circuit theorem validations, breadboard readings, component analysis, and precise V-I characteristic line graphs.</p>
                            </div>
                        </div>

                        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 flex gap-4">
                            <div className="mt-1 bg-white p-2 rounded-lg shadow-sm h-fit">
                                <ShieldCheck className="w-6 h-6 text-emerald-600" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">Civil Engineering</h3>
                                <p className="text-slate-600">Material testing tables, concrete slump values, surveying data compilation, and stress-strain curve generation.</p>
                            </div>
                        </div>

                        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 flex gap-4">
                            <div className="mt-1 bg-white p-2 rounded-lg shadow-sm h-fit">
                                <Wrench className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">Computer Science</h3>
                                <p className="text-slate-600">Algorithm time-complexity plotting, software execution time comparisons, and formatted code-output tables.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-24 px-6 sm:px-12 bg-slate-900 text-center relative overflow-hidden">
                <div className="max-w-3xl mx-auto space-y-8 relative z-10">
                    <Cog className="w-16 h-16 mx-auto text-orange-400" />
                    <h2 className="text-3xl md:text-4xl font-bold text-white">Focus on the engineering, not the formatting.</h2>
                    <Link href="/auth/signup">
                        <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white font-bold h-14 px-8 rounded-full mt-4">
                            Create My First Engineering Report
                        </Button>
                    </Link>
                    <div className="pt-12 mt-12 border-t border-slate-800 flex justify-center gap-6 text-sm">
                        <Link href="/" className="text-slate-400 hover:text-white">Home</Link>
                        <Link href="/ai-lab-data-analysis" className="text-slate-400 hover:text-white">Data Analysis Engine</Link>
                    </div>
                </div>
            </section>
        </div>
    );
}

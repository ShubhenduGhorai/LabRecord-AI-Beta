import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Microscope, Atom, FlaskConical, Binary, CheckCircle } from 'lucide-react';

export const metadata: Metadata = {
    title: "Science Lab Report Generator | LabRecord AI",
    description: "Generate physics, chemistry, and general science lab reports instantly using our AI scientific writing assistant.",
    keywords: ["science lab report generator", "physics lab record", "chemistry practical report AI", "scientific report writer", "high school science lab AI"],
    alternates: {
        canonical: 'https://labrecord.cloud/science-lab-report-generator',
    },
    openGraph: {
        title: "Science Lab Report Generator",
        description: "Generate physics, chemistry, and general science lab reports instantly using our AI scientific writing assistant.",
        url: "https://labrecord.cloud/science-lab-report-generator",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Science Lab Report Generator",
        description: "Generate physics, chemistry, and general science lab reports instantly using our AI scientific writing assistant.",
    },
};

export default function ScienceLabReportGenerator() {
    return (
        <div className="flex flex-col min-h-screen">
            <section className="bg-slate-50 py-20 px-6 sm:px-12 text-center border-b border-slate-200">
                <div className="max-w-4xl mx-auto space-y-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-100 text-cyan-700 text-sm font-semibold mb-4">
                        <Atom className="w-4 h-4" /> Built for Science Students
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
                        <span className="text-cyan-600">Science</span> Lab Report Generator
                    </h1>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                        From high school chemistry to advanced university physics. Automate your calculations, chemical equations, and physics formulas instantly into a fully formatted report.
                    </p>
                    <div className="pt-6">
                        <Link href="/auth/signup">
                            <Button size="lg" className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold h-14 px-8 rounded-full shadow-lg shadow-cyan-200">
                                Generate Science Report <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            <section className="py-20 px-6 sm:px-12 bg-white">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">Automate Every Scientific Discipline</h2>

                    <div className="grid sm:grid-cols-2 gap-8">
                        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 flex gap-4">
                            <div className="mt-1 bg-white p-2 rounded-lg shadow-sm h-fit">
                                <FlaskConical className="w-6 h-6 text-indigo-600" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">Chemistry Applications</h3>
                                <p className="text-slate-600">Titration curves, molarity derivations, thermodynamics equations, and organic synthesis procedural formatting.</p>
                            </div>
                        </div>

                        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 flex gap-4">
                            <div className="mt-1 bg-white p-2 rounded-lg shadow-sm h-fit">
                                <Binary className="w-6 h-6 text-amber-500" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">Physics Formulas</h3>
                                <p className="text-slate-600">Kinematics trajectory plotting, optics focal length arrays, electromagnetism data tracking, and percentage error calculation.</p>
                            </div>
                        </div>

                        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 flex gap-4">
                            <div className="mt-1 bg-white p-2 rounded-lg shadow-sm h-fit">
                                <Microscope className="w-6 h-6 text-emerald-600" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">Earth Science</h3>
                                <p className="text-slate-600">Soil analysis tables, meteorological data averaging, and geological mapping theoretical generation.</p>
                            </div>
                        </div>

                        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 flex gap-4">
                            <div className="mt-1 bg-white p-2 rounded-lg shadow-sm h-fit">
                                <CheckCircle className="w-6 h-6 text-sky-600" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">General Sciences</h3>
                                <p className="text-slate-600">Perfectly balanced Aim, Hypothesis, Materials, Methods, Results, and Conclusion sections every single time.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-24 px-6 sm:px-12 bg-slate-900 text-center relative overflow-hidden">
                <div className="max-w-3xl mx-auto space-y-8 relative z-10">
                    <Atom className="w-16 h-16 mx-auto text-cyan-400" />
                    <h2 className="text-3xl md:text-4xl font-bold text-white">Turn scattered data into a polished PDF.</h2>
                    <Link href="/auth/signup">
                        <Button size="lg" className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold h-14 px-8 rounded-full mt-4">
                            Format Your Results
                        </Button>
                    </Link>
                    <div className="pt-12 mt-12 border-t border-slate-800 flex justify-center gap-6 text-sm">
                        <Link href="/" className="text-slate-400 hover:text-white">Home</Link>
                        <Link href="/engineering-lab-report-generator" className="text-slate-400 hover:text-white">Engineering</Link>
                    </div>
                </div>
            </section>
        </div>
    );
}

import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "About LabRecord AI | Mission & Vision",
    description: "Learn about the mission behind LabRecord AI - automating lab reporting for engineers and science students.",
    alternates: {
        canonical: "/about",
    },
};

export default function AboutPage() {
    return (
        <div className="max-w-4xl mx-auto py-20 px-6">
            <h1 className="text-4xl font-bold tracking-tight mb-6 text-slate-900">About LabRecord AI</h1>
            <div className="prose prose-slate max-w-none text-lg leading-relaxed text-slate-700">
                <p>
                    LabRecord AI is built by engineers, for engineers. We understand the pain of spending hours configuring and writing up laboratory experiments, and our goal is to streamline the reporting process so students can focus on the underlying concepts instead of the formatting.
                </p>
            </div>
        </div>
    );
}

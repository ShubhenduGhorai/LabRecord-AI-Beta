import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Terms of Service | LabRecord AI",
    description: "Read the terms and conditions for using LabRecord AI services.",
    alternates: {
        canonical: "/terms-of-service",
    },
};

export default function TermsOfService() {
    return (
        <div className="max-w-4xl mx-auto py-20 px-6">
            <h1 className="text-4xl font-bold tracking-tight mb-6 text-slate-900">Terms of Service</h1>
            <div className="prose prose-slate max-w-none text-lg leading-relaxed text-slate-700 space-y-4">
                <p>By using LabRecord AI, you agree to these Terms of Service.</p>
                <h2 className="text-2xl font-bold mt-8 mb-4">Acceptable Use</h2>
                <p>Do not abuse our AI generation infrastructure. Our system restricts bots, automated mass-generation scaling scripts, and denial-of-service testing techniques.</p>
                <h2 className="text-2xl font-bold mt-8 mb-4">Account Limitations</h2>
                <p>Free tier users are subject to specific quotas that may dynamically shift based on platform loads or commercial factors. Continued generation requires an active premium subscription.</p>
            </div>
        </div>
    );
}

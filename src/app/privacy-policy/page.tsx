import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Privacy Policy | LabRecord AI",
    description: "Our commitment to protecting your data and privacy while using LabRecord AI.",
    alternates: {
        canonical: "/privacy-policy",
    },
};

export default function PrivacyPolicy() {
    return (
        <div className="max-w-4xl mx-auto py-20 px-6">
            <h1 className="text-4xl font-bold tracking-tight mb-6 text-slate-900">Privacy Policy</h1>
            <div className="prose prose-slate max-w-none text-lg leading-relaxed text-slate-700 space-y-4">
                <p>This page explains how LabRecord AI collects and uses data.</p>
                <h2 className="text-2xl font-bold mt-8 mb-4">Data Collection</h2>
                <p>We automatically collect information using cookies and tracking technologies to analyze site traffic and user interactions. We also collect the basic profile records provided via authentication frameworks.</p>
                <h2 className="text-2xl font-bold mt-8 mb-4">Your Privacy</h2>
                <p>Your uploaded laboratory reports and datasets remain strictly yours. We do not use user generation prompts to train foundational AI models.</p>
            </div>
        </div>
    );
}

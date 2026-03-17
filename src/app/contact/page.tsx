import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Contact LabRecord AI | Support & Inquiries",
    description: "Got questions? Reach out to the LabRecord AI team for support, feedback, or partnership inquiries.",
    alternates: {
        canonical: "/contact",
    },
};

export default function ContactPage() {
    return (
        <div className="max-w-4xl mx-auto py-20 px-6">
            <h1 className="text-4xl font-bold tracking-tight mb-6 text-slate-900">Contact Us</h1>
            <div className="prose prose-slate max-w-none text-lg leading-relaxed text-slate-700">
                <p>Have questions, issues, or want to discuss enterprise pricing? We're here to help.</p>
                <p className="mt-4">
                    Email us directly at <strong>support@labrecord.cloud</strong>
                </p>
            </div>
        </div>
    );
}

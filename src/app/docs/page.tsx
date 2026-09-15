export default function DocsPage() {
    return (
        <div className="max-w-4xl mx-auto py-20 px-6">
            <h1 className="text-4xl font-bold tracking-tight mb-8 text-slate-900">Documentation</h1>
            <div className="prose prose-slate max-w-none text-lg leading-relaxed text-slate-700 space-y-8">

                <section>
                    <h2 className="text-2xl font-bold mb-3">Getting Started</h2>
                    <p>Welcome to LabRecord AI! Getting started is easy. After signing up, navigate to your dashboard where you can see all your recent experiments or create a new one utilizing any of our available AI tools.</p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold mb-3">How to Generate a Lab Report</h2>
                    <ol className="list-decimal pl-6 space-y-2">
                        <li>Open the <strong>Data Analysis</strong> tool or navigate directly to the <strong>Lab Report Generator</strong>.</li>
                        <li>Paste your raw experimental readings (X, Y) pairs.</li>
                        <li>Click "Analyze" to run the regression and fetch statistical data automatically.</li>
                        <li>Verify the plotted graph in the interactive console.</li>
                        <li>Click "Generate AI Report" to let our LLMs draft your comprehensive sections.</li>
                        <li>Click "Download PDF" to finalize and push the experiment to the cloud bucket!</li>
                    </ol>
                </section>

                <section>
                    <h2 className="text-2xl font-bold mb-3">Pricing Explanation</h2>
                    <ul className="list-disc pl-6 space-y-2">
                        <li><strong>Free Tier</strong>: Capped at exactly 3 report generations lifetime. Basic statistical tools allowed.</li>
                        <li><strong>Student Pro ($9/mo)</strong>: Unlimited reports, priority support, and advanced graphing APIs.</li>
                        <li><strong>Research ($99/yr)</strong>: Premium processing queue, complex export formatting, and advanced viva prepping sequences.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-bold mb-3">FAQ</h2>
                    <div className="space-y-4 mt-4">
                        <div>
                            <strong className="text-slate-900 block">Is my data secure?</strong>
                            <p>Yes, uploads are sent securely over HTTPS and handled via dedicated Supabase storage vaults guarded by strict PostgREST RLS constraints.</p>
                        </div>
                        <div>
                            <strong className="text-slate-900 block">Can I export to Word?</strong>
                            <p>Presently, LabRecord AI exports finalized, print-ready PDF files exclusively to maintain deterministic formatting.</p>
                        </div>
                    </div>
                </section>

            </div>
        </div>
    );
}

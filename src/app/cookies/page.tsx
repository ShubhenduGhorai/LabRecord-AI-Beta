export default function CookiesPage() {
    return (
        <div className="max-w-4xl mx-auto py-20 px-6">
            <h1 className="text-4xl font-bold tracking-tight mb-6 text-slate-900">Cookies Policy</h1>
            <div className="prose prose-slate max-w-none text-lg leading-relaxed text-slate-700 space-y-6">
                <div>
                    <h2 className="text-2xl font-bold mb-2">What are cookies?</h2>
                    <p>Cookies are small text files that are stored on your device when you visit our website. They help us remember your preferences, keep you logged in securely, and understand how you interact with our tools.</p>
                </div>

                <div>
                    <h2 className="text-2xl font-bold mb-2">How LabRecord AI uses cookies</h2>
                    <p>We utilize cookies strictly to ensure platform security, stability, and a seamless user experience. We minimize usage of third-party trackers where possible.</p>
                </div>

                <div>
                    <h2 className="text-2xl font-bold mb-2">Authentication Cookies</h2>
                    <p>Essential cookies are used directly by Supabase to maintain your session states securely across our application router boundaries. Without these, you wouldn't be able to log in or access your private reports.</p>
                </div>

                <div>
                    <h2 className="text-2xl font-bold mb-2">Analytics Cookies</h2>
                    <p>We utilize analytics cookies to track generalized engagement. This helps us decide which features (e.g. Viva Prep vs Data Analysis) we should focus on upgrading next.</p>
                </div>

                <div>
                    <h2 className="text-2xl font-bold mb-2">How you can disable cookies</h2>
                    <p>You can adjust your browser settings to completely block cookies at any time, but be aware that crucial application state (like logins and Stripe sessions) will break if essential cookies are disabled.</p>
                </div>
            </div>
        </div>
    );
}

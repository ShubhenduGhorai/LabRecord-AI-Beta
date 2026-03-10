"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export function CookieConsent() {
    const [show, setShow] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem("cookieConsent");
        if (!consent) {
            setShow(true);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem("cookieConsent", "accepted");
        setShow(false);
    };

    const handleDecline = () => {
        localStorage.setItem("cookieConsent", "declined");
        setShow(false);
    };

    if (!show) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 p-4 z-50 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
            <p className="text-sm text-slate-600 dark:text-slate-400">
                We use cookies to improve your experience. By using our website you agree to our cookie policy.
            </p>
            <div className="flex gap-3 shrink-0 w-full sm:w-auto">
                <Button variant="outline" className="flex-1 sm:flex-none" onClick={handleDecline}>Decline</Button>
                <Button className="flex-1 sm:flex-none bg-indigo-600 hover:bg-indigo-700 text-white" onClick={handleAccept}>Accept</Button>
            </div>
        </div>
    );
}

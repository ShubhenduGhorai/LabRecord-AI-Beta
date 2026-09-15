import { Metadata } from "next";
import PricingPage from "./page";

export const metadata: Metadata = {
    title: "LabRecord AI Pricing | Affordable Plans for Students",
    description: "Choose the right plan for your lab reporting needs. Start for free or unlock unlimited reports.",
    alternates: {
        canonical: "/pricing",
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}

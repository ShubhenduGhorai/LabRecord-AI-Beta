import { Hero } from "@/components/Hero";
import { SocialProof } from "@/components/SocialProof";
import { Features } from "@/components/Features";
import { HowItWorks } from "@/components/HowItWorks";
import { DemoPreview } from "@/components/DemoPreview";
import { Pricing } from "@/components/Pricing";
import { Testimonials } from "@/components/Testimonials";
import { FAQ } from "@/components/FAQ";
import { FinalCTA } from "@/components/FinalCTA";

export const revalidate = 0; // Ensures the page always fetches fresh data on every request

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      <Hero />
      <SocialProof />
      <section id="features"><Features /></section>
      <section id="how-it-works"><HowItWorks /></section>
      <section id="demo"><DemoPreview /></section>
      <section id="pricing"><Pricing /></section>
      <Testimonials />
      <section id="faq"><FAQ /></section>
      <FinalCTA />
    </div>
  );
}

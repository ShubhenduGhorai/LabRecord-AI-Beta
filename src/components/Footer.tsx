import Link from "next/link";
import { Beaker } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 md:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Beaker className="h-6 w-6 text-indigo-600" />
              <span className="text-xl font-bold tracking-tight">LabRecord AI</span>
            </div>
            <p className="text-muted-foreground mb-4 max-w-sm">
              AI tools for modern engineering and science students. Stop spending hours on lab reports and focus on learning.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-foreground">Generators</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/engineering-lab-report-generator" className="hover:text-foreground transition-colors">Engineering Reports</Link></li>
              <li><Link href="/medical-lab-report-generator" className="hover:text-foreground transition-colors">Medical Reports</Link></li>
              <li><Link href="/science-lab-report-generator" className="hover:text-foreground transition-colors">Science Reports</Link></li>
              <li><Link href="/bioscience-lab-report-generator" className="hover:text-foreground transition-colors">Bioscience Reports</Link></li>
              <li><Link href="/pharmacy-lab-record-generator" className="hover:text-foreground transition-colors">Pharmacy Records</Link></li>
              <li><Link href="/lab-report-ai" className="hover:text-foreground transition-colors">AI Lab Reports</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-foreground">AI Tools</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/ai-lab-data-analysis" className="hover:text-foreground transition-colors">Data Analysis Tool</Link></li>
              <li><Link href="/lab-graph-generator" className="hover:text-foreground transition-colors">Graph Generator</Link></li>
              <li><Link href="/ai-viva-preparation" className="hover:text-foreground transition-colors">Viva Preparation</Link></li>
              <li><Link href="/research-paper-formatter" className="hover:text-foreground transition-colors">Paper Formatter</Link></li>
              <li><Link href="/lab-record-cloud-storage" className="hover:text-foreground transition-colors">Cloud Storage</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-foreground">Company</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/#features" className="hover:text-foreground transition-colors">Features</Link></li>
              <li><Link href="/pricing" className="hover:text-foreground transition-colors">Pricing</Link></li>
              <li><Link href="/docs" className="hover:text-foreground transition-colors">Docs</Link></li>
              <li><Link href="/contact" className="hover:text-foreground transition-colors">Contact</Link></li>
              <li><Link href="/privacy-policy" className="hover:text-foreground transition-colors">Privacy</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© {new Date().getFullYear()} LabRecord AI. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/terms-of-service" className="hover:text-foreground transition-colors">Terms of Service</Link>
            <Link href="/privacy-policy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
            <Link href="/cookies" className="hover:text-foreground transition-colors">Cookies Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

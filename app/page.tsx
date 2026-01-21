import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  ShieldCheck,
  TrendingDown,
  Globe,
  Activity,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* --- Navigation --- */}
      <header className="border-b border-neutral-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center text-white">
              <Activity size={18} />
            </div>
            <span className="font-serif text-2xl font-bold text-neutral-900 tracking-tight">
              Easemed
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button
                variant="ghost"
                className="font-medium text-neutral-600 hover:text-neutral-900"
              >
                Log in
              </Button>
            </Link>
            <Link href="/login">
              <Button className="bg-teal-600 hover:bg-teal-700 text-white shadow-lg shadow-teal-600/20">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* --- Hero Section --- */}
        <section className="relative py-24 lg:py-32 overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-teal-50 via-neutral-50 to-white opacity-70"></div>

          <div className="container mx-auto px-6 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-100 text-teal-700 text-sm font-medium mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
              </span>
              v1.0 Now Live for Hospitals
            </div>

            <h1 className="font-serif text-5xl md:text-7xl font-bold text-neutral-900 mb-6 tracking-tight leading-[1.1]">
              The Operating System for <br className="hidden md:block" />
              <span className="text-teal-700">Medical Procurement</span>
            </h1>

            <p className="text-lg md:text-xl text-neutral-500 max-w-2xl mx-auto mb-10 leading-relaxed">
              Connect with verified global vendors, automate compliance checks,
              and calculate true landed costs. Modernizing the hospital supply
              chain, one RFQ at a time.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/login">
                <Button
                  size="lg"
                  className="h-12 px-8 text-lg bg-teal-900 hover:bg-teal-800 text-white rounded-full"
                >
                  Start Sourcing <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 px-8 text-lg rounded-full border-neutral-300 text-neutral-600 hover:bg-neutral-50"
                >
                  View Demo
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* --- Value Props --- */}
        <section className="py-24 bg-white border-t border-neutral-100">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-3 gap-12">
              {/* Feature 1 */}
              <div className="group space-y-4">
                <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 mb-4 group-hover:scale-110 transition-transform">
                  <Globe className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-neutral-900">
                  Global Sourcing
                </h3>
                <p className="text-neutral-500 leading-relaxed">
                  Access a tiered network of 2,400+ verified pharmaceutical
                  vendors across Europe and Asia.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="group space-y-4">
                <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 mb-4 group-hover:scale-110 transition-transform">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-neutral-900">
                  Auto-Compliance
                </h3>
                <p className="text-neutral-500 leading-relaxed">
                  Every vendor is automatically vetted against FDA, EMA, and
                  local import regulations before bidding.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="group space-y-4">
                <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 mb-4 group-hover:scale-110 transition-transform">
                  <TrendingDown className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-neutral-900">
                  Landed Cost Logic
                </h3>
                <p className="text-neutral-500 leading-relaxed">
                  We calculate duties, logistics, and risk margins upfront, so
                  the price you see is the price you pay.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* --- Social Proof / Stats --- */}
        <section className="py-20 bg-neutral-50">
          <div className="container mx-auto px-6 text-center">
            <h2 className="font-serif text-3xl font-bold text-neutral-900 mb-12">
              Trusted by modern healthcare networks
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 opacity-60 grayscale">
              {/* Placeholders for logos */}
              <div className="flex items-center justify-center font-bold text-xl text-neutral-400">
                APOLLO HOSPITALS
              </div>
              <div className="flex items-center justify-center font-bold text-xl text-neutral-400">
                FORTIS HEALTH
              </div>
              <div className="flex items-center justify-center font-bold text-xl text-neutral-400">
                MAX HEALTHCARE
              </div>
              <div className="flex items-center justify-center font-bold text-xl text-neutral-400">
                MANIPAL
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* --- Footer --- */}
      <footer className="py-8 border-t border-neutral-200 bg-white">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-sm text-neutral-500">
          <p>© 2024 Easemed Procurement Systems. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-neutral-900">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-neutral-900">
              Terms of Service
            </a>
            <a href="#" className="hover:text-neutral-900">
              Vendor Support
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

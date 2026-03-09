"use client";

import HeroSection from "@/components/hero";
import { featuresData, howItWorksData, statsData } from "@/data/landing";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

function RevealSection({ children, className = "", id = "" }) {
  const ref = useScrollReveal();
  return (
    <section ref={ref} className={className} id={id}>
      {children}
    </section>
  );
}

export default function Home() {
  return (
    <div className="mt-24 md:mt-40">
      <HeroSection />

      {/* Stats */}
      <RevealSection className="py-12 md:py-20 border-y border-[#1e2d45] bg-[#0d1117]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {statsData.map((stat, i) => (
              <div key={i} className="text-center">
                <div
                  className="stat-value text-4xl font-bold text-[#c9a96e] mb-2"
                  style={{ animationDelay: `${i * 0.12}s` }}
                >
                  {stat.value}
                </div>
                <div
                  className="fade-in text-slate-500 text-sm uppercase tracking-widest"
                  style={{ transitionDelay: `${0.1 + i * 0.12}s` }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </RevealSection>

      {/* Features */}
      <RevealSection className="py-16 md:py-24 bg-[#0a0d14]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 md:mb-16">
            <p className="fade-in text-[#c9a96e] text-sm font-semibold uppercase tracking-widest mb-3">Features</p>
            <span className="section-line" />
            <h2 className="fade-up text-3xl md:text-4xl font-bold text-white mb-4 delay-100">
              Everything you need, nothing you don&apos;t
            </h2>
            <p className="fade-up text-slate-500 max-w-xl mx-auto delay-200">
              Built around the features that actually move the needle on your financial health.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {featuresData.map((feature, i) => (
              <div
                key={i}
                className="fade-up card-hover p-5 md:p-6 rounded-xl bg-[#111827] border border-[#1e2d45] group"
                style={{ transitionDelay: `${0.1 + i * 0.08}s` }}
              >
                <div className="w-11 h-11 rounded-lg bg-[#1a2235] border border-[#1e2d45] flex items-center justify-center mb-4 md:mb-5 group-hover:border-[#c9a96e]/40 transition-colors duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </RevealSection>

      {/* How It Works */}
      <RevealSection id="how-it-works" className="py-16 md:py-24 bg-[#0d1117] border-y border-[#1e2d45]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 md:mb-16">
            <p className="fade-in text-[#c9a96e] text-sm font-semibold uppercase tracking-widest mb-3">Process</p>
            <span className="section-line" />
            <h2 className="fade-up text-3xl md:text-4xl font-bold text-white mb-4 delay-100">
              How Floww works
            </h2>
            <p className="fade-up text-slate-500 max-w-xl mx-auto delay-200">
              From sign-up to your first AI insight in under 5 minutes.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-8 left-1/3 right-1/3 h-px bg-gradient-to-r from-transparent via-[#1e2d45] to-transparent" />
            {howItWorksData.map((step, i) => (
              <div
                key={i}
                className="fade-up text-center relative"
                style={{ transitionDelay: `${0.1 + i * 0.15}s` }}
              >
                <div className="w-16 h-16 bg-[#111827] border-2 border-[#c9a96e]/40 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(201,169,110,0.1)] transition-all duration-300 hover:shadow-[0_0_30px_rgba(201,169,110,0.25)] hover:border-[#c9a96e]/70">
                  {step.icon}
                </div>
                <h3 className="text-white font-semibold text-lg mb-3">{step.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </RevealSection>

      {/* CTA */}
      <RevealSection className="py-20 md:py-28 bg-[#0d1117] border-t border-[#1e2d45] relative overflow-hidden">
        <div className="orb orb-gold w-[700px] h-[400px] top-[-50px] left-1/2 -translate-x-1/2" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-2xl mx-auto">
            <p className="fade-in text-[#c9a96e] text-sm font-semibold uppercase tracking-widest mb-4">Get Started</p>
            <h2 className="fade-up text-3xl md:text-5xl font-bold text-white mb-6 leading-tight delay-100">
              Ready to get your<br />money in flow?
            </h2>
            <p className="fade-up text-slate-500 mb-10 text-base md:text-lg delay-200">
              Free to start. No credit card needed. Your finances, finally under control.
            </p>
            <div className="fade-up delay-300 px-4 sm:px-0">
              <Link href="/dashboard">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-[#c9a96e] hover:bg-[#a07840] text-[#0a0d14] font-bold px-10 py-6 text-base gap-2 btn-gold-pulse"
                >
                  Start Tracking Free <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </RevealSection>
    </div>
  );
}
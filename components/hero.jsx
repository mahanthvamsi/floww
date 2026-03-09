"use client";
import Link from "next/link";
import { Button } from "./ui/button";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, ShieldCheck, TrendingUp, Sparkles } from "lucide-react";

const HeroSection = () => {
  const imageRef = useRef();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const el = imageRef.current;
    if (!el) return;
    const handleScroll = () => {
      el.classList.toggle("scrolled", window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="pb-12 md:pb-20 px-4 relative overflow-hidden">
      {/* Ambient orbs */}
      <div className="orb orb-gold w-[300px] h-[300px] md:w-[600px] md:h-[600px] top-[-60px] left-[-60px]" />
      <div className="orb orb-blue w-[250px] h-[250px] md:w-[500px] md:h-[500px] top-[80px] right-[-40px]" />

      <div className="container mx-auto text-center relative z-10">

        {/* Badge */}
        <div
          className="inline-flex items-center gap-2 bg-[#111827] border border-[#c9a96e]/30 text-[#c9a96e] text-xs md:text-sm font-medium px-3 py-1.5 md:px-4 rounded-full mb-6 md:mb-8 shadow-[0_0_20px_rgba(201,169,110,0.08)]"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 0.6s ease, transform 0.6s ease",
            transitionDelay: "0.05s",
          }}
        >
          <Sparkles className="w-3 h-3 md:w-3.5 md:h-3.5 flex-shrink-0" />
          AI-Powered Financial Intelligence
        </div>

        {/* Headline */}
        <h1
          className="text-4xl sm:text-6xl md:text-8xl lg:text-[105px] pb-4 md:pb-6 gradient-title leading-[1.1]"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.7s ease, transform 0.7s ease",
            transitionDelay: "0.15s",
          }}
        >
          Your Money, <br className="hidden sm:block" />
          Finally in Flow.
        </h1>

        {/* Subtext */}
        <p
          className="text-base md:text-xl text-slate-500 mb-8 md:mb-10 max-w-2xl mx-auto leading-relaxed px-2"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.7s ease, transform 0.7s ease",
            transitionDelay: "0.28s",
          }}
        >
          Floww connects your accounts, scans your receipts, and uses AI to give you
          clear insights into where your money goes.
        </p>

        {/* CTAs */}
        <div
          className="flex flex-col sm:flex-row justify-center gap-3 mb-8 md:mb-6 px-4 sm:px-0"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.7s ease, transform 0.7s ease",
            transitionDelay: "0.38s",
          }}
        >
          <Link href="/dashboard" className="w-full sm:w-auto">
            <Button size="lg" className="w-full sm:w-auto px-8 bg-[#c9a96e] hover:bg-[#a07840] text-[#0a0d14] font-bold border-0 gap-2 btn-gold-pulse">
              Start Tracking Free <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link href="#how-it-works" className="w-full sm:w-auto">
            <Button size="lg" variant="outline" className="w-full sm:w-auto px-8 border-[#1e2d45] text-slate-400 hover:border-[#c9a96e]/40 hover:text-[#c9a96e] bg-transparent">
              See How It Works
            </Button>
          </Link>
        </div>

        {/* Trust badges */}
        <div
          className="flex flex-wrap items-center justify-center gap-4 md:gap-6 text-xs text-slate-600 mb-10 md:mb-16"
          style={{
            opacity: mounted ? 1 : 0,
            transition: "opacity 0.7s ease",
            transitionDelay: "0.48s",
          }}
        >
          <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-[#c9a96e]/60" /> End-to-end secure</span>
          <span className="flex items-center gap-1.5"><TrendingUp className="w-3.5 h-3.5 text-[#c9a96e]/60" /> Real-time insights</span>
          <span className="flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5 text-[#c9a96e]/60" /> AI receipt scanning</span>
        </div>

        {/* 
          Single banner — shown on ALL screen sizes.
          On mobile: flat, no 3D wrapper.
          On desktop: wrapped in 3D tilt container.
        */}
        <div
          style={{
            opacity: mounted ? 1 : 0,
            transition: "opacity 0.8s ease",
            transitionDelay: "0.55s",
          }}
        >
          {/* Mobile — simple flat image */}
          {/* <div className="block md:hidden rounded-xl overflow-hidden border border-[#1e2d45] shadow-[0_0_40px_rgba(0,0,0,0.8)]">
            <Image
              src="/banner.jpg"
              alt="Floww Dashboard Preview"
              width={1280}
              height={720}
              className="w-full h-auto"
              priority
            />
          </div> */}

          {/* Desktop — 3D tilt */}
          <div className="hidden md:block hero-image-wrapper">
            <div ref={imageRef} className="hero-image">
              <Image
                src="/banner.jpg"
                alt="Floww Dashboard Preview"
                width={1280}
                height={720}
                className="rounded-xl shadow-[0_0_80px_rgba(0,0,0,0.8)] border border-[#1e2d45] mx-auto"
                priority
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default HeroSection;
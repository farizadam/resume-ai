import Link from "next/link";
import Image from "next/image";
import { Sparkles, ArrowRight, CheckCircle2, FileText, Zap, MessageSquare } from "lucide-react";

export default async function Home() {
  return (
    <div className="flex min-h-screen flex-col font-sans overflow-x-hidden bg-space-950">
      <main className="flex-1">
        
        {/* --- HERO SECTION --- */}
        <section className="relative px-6 py-20 md:py-32 lg:px-12 min-h-[90vh] flex items-center overflow-hidden">
          {/* Background Ambient Glow */}
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-ai-primary/10 rounded-full blur-[120px] pointer-events-none -translate-y-1/2 translate-x-1/3"></div>
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none translate-y-1/3 -translate-x-1/3"></div>

          <div className="relative z-10 mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Left: Copy & CTA */}
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-ai-primary/10 border border-ai-primary/20 text-ai-primary text-sm font-semibold mb-6">
                <Sparkles className="w-4 h-4" />
                <span>The Future of Resume Building</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white leading-[1.05] mb-6">
                Land your dream job with an AI recruiter.
              </h1>
              <p className="text-lg md:text-xl text-text-secondary leading-relaxed mb-10 font-medium max-w-lg">
                Stop staring at a blank page. Let our AI interview you, extract your best achievements, and automatically build an ATS-beating resume in under 5 minutes.
              </p>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <Link
                  href="/interview"
                  className="group flex items-center justify-center w-full sm:w-auto rounded-full bg-white px-8 py-4 text-base font-extrabold text-space-950 transition-all hover:bg-slate-200 hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.15)]"
                >
                  Start Free Interview
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
                <a
                  href="#how-it-works"
                  className="flex items-center justify-center w-full sm:w-auto rounded-full px-8 py-4 text-base font-bold text-white transition-all hover:bg-white/5 border border-transparent hover:border-glass-border"
                >
                  See How it Works
                </a>
              </div>
            </div>

            {/* Right: AI Visual */}
            <div className="relative h-[500px] w-full hidden md:flex items-center justify-center perspective-1000">
              
              {/* Main Image */}
              <div className="relative w-full max-w-[450px] aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border border-glass-border transform rotate-y-[-5deg] rotate-x-[2deg]">
                <Image 
                  src="/images/hero.png" 
                  alt="Professional using AI resume builder" 
                  fill 
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-space-950/80 via-transparent to-transparent"></div>
              </div>

              {/* Floating Badge 1 */}
              <div className="absolute -left-12 top-32 bg-surface/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-glass-border p-4 flex items-center gap-4 animate-float-slow">
                <div className="bg-emerald-500/20 p-2.5 rounded-xl text-emerald-400">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-extrabold text-white">ATS Match: 99%</p>
                  <p className="text-xs text-text-muted mt-0.5">Optimized for Google</p>
                </div>
              </div>

              {/* Floating Badge 2 */}
              <div className="absolute -right-8 bottom-24 bg-surface/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-glass-border p-4 flex items-center gap-4 animate-float-delayed">
                 <div className="bg-ai-primary/20 p-2.5 rounded-xl text-ai-primary">
                  <Zap className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-extrabold text-white">Resume Built</p>
                  <p className="text-xs text-text-muted mt-0.5">Time: 4 mins 12 secs</p>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* --- HOW IT WORKS SECTION --- */}
        <section id="how-it-works" className="bg-[#0B1220] py-24 px-6 lg:px-12 relative border-y border-glass-border">
          <div className="absolute inset-0 z-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px]"></div>

          <div className="relative z-10 mx-auto max-w-7xl">
            <div className="text-center max-w-3xl mx-auto mb-20">
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-6 text-white">
                How does it work?
              </h2>
              <p className="text-lg md:text-xl text-text-muted">
                We replaced clunky form fields and generic templates with a fluid, intelligent workflow designed to highlight your true value.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-16 lg:gap-32">
              
              {/* Step 1 */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="order-2 lg:order-1 relative p-8 bg-space-900 border border-glass-border rounded-3xl shadow-2xl">
                  <div className="flex gap-4 max-w-[85%] mb-4">
                    <div className="w-8 h-8 rounded-full bg-ai-primary/20 text-ai-primary flex items-center justify-center shrink-0 border border-ai-primary/30">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div className="bg-surface border border-glass-border p-4 rounded-2xl rounded-tl-none text-sm text-white shadow-sm">
                      What was your most impactful project at your last role? Let's focus on the metrics.
                    </div>
                  </div>
                  <div className="flex gap-4 max-w-[85%] ml-auto">
                    <div className="bg-white text-space-950 p-4 rounded-2xl rounded-tr-none text-sm font-medium shadow-sm">
                      I led the frontend migration to React, which reduced our page load times by 40% and increased conversions.
                    </div>
                  </div>
                </div>
                <div className="order-1 lg:order-2">
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-white font-black text-xl mb-6">1</div>
                  <h3 className="text-3xl font-extrabold text-white mb-4">The AI Interview</h3>
                  <p className="text-text-secondary text-lg leading-relaxed">
                    Skip the blank page anxiety. Our intelligent conversational agent asks you targeted, probing questions about your background to extract your most impressive accomplishments and metrics.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <div className="w-12 h-12 bg-ai-primary/20 text-ai-primary rounded-2xl flex items-center justify-center font-black text-xl mb-6">2</div>
                  <h3 className="text-3xl font-extrabold text-white mb-4">ATS Optimization</h3>
                  <p className="text-text-secondary text-lg leading-relaxed">
                    Applicant Tracking Systems reject 75% of resumes. Our AI automatically parses your conversational answers, injects missing industry keywords, and rewrites your bullets using high-impact action verbs.
                  </p>
                </div>
                <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl shadow-ai-primary/20 border border-glass-border">
                  <Image 
                    src="/images/ats.png" 
                    alt="ATS Dashboard Visualization" 
                    fill 
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Step 3 */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="order-2 lg:order-1 relative bg-surface border border-glass-border rounded-3xl p-10 flex flex-col justify-center shadow-xl">
                  <div className="w-full h-12 bg-white rounded-lg flex items-center justify-center gap-2 text-space-950 font-bold text-lg shadow-md mb-6 hover:scale-[1.02] transition-transform cursor-pointer">
                    <FileText className="w-5 h-5" /> Download PDF
                  </div>
                  <div className="flex items-center justify-between px-4 py-3 bg-space-900 border border-glass-border rounded-lg text-sm text-text-muted">
                    <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Perfect formatting</span>
                    <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> 1-Click Export</span>
                  </div>
                </div>
                <div className="order-1 lg:order-2">
                  <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center font-black text-xl mb-6">3</div>
                  <h3 className="text-3xl font-extrabold text-white mb-4">Ready to Export</h3>
                  <p className="text-text-secondary text-lg leading-relaxed">
                    Once your profile is generated, you can jump into our live editor to tweak the results. When you're happy, export it to a beautifully formatted, pixel-perfect PDF with just one click.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* --- BOTTOM CTA --- */}
        <section className="py-24 px-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-ai-primary/10 pointer-events-none"></div>
          <div className="relative z-10 max-w-4xl mx-auto text-center bg-surface border border-glass-border rounded-[3rem] p-12 lg:p-20 shadow-2xl shadow-ai-primary/5">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">
              Stop getting rejected by robots.
            </h2>
            <p className="text-xl text-text-secondary mb-10 max-w-2xl mx-auto">
              Join the professionals who use AI to build resumes that land interviews. Start your free consultation now.
            </p>
            <Link
              href="/interview"
              className="inline-flex items-center justify-center rounded-full bg-white px-10 py-5 text-lg font-black text-space-950 transition-all hover:bg-slate-200 hover:scale-105 shadow-xl"
            >
              Start Free AI Interview
              <ArrowRight className="ml-2 h-6 w-6" />
            </Link>
          </div>
        </section>

      </main>

      {/* --- FOOTER --- */}
      <footer className="bg-space-950 py-10 px-6 lg:px-12 border-t border-glass-border text-white">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xl font-extrabold tracking-tighter text-white">
              Resume <span className="text-text-muted">AI.</span>
            </span>
          </div>
          <p className="text-sm font-medium text-text-disabled">
            © {new Date().getFullYear()} Resume AI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

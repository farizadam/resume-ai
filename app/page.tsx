import Link from "next/link";
import { Sparkles, ArrowRight, CheckCircle2, MessageSquare, FileText, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col font-sans">
      {/* Navbar */}
      <header className="sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b border-border-default bg-surface/80 backdrop-blur-md px-6 md:px-12">
        <div className="flex items-center gap-2">
          <Link href="/" className="text-xl font-extrabold tracking-tighter text-navy-900">
            Resume AI.
          </Link>
        </div>
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/resume" className="text-sm font-medium text-text-muted transition-colors hover:text-navy-900">
            Builder
          </Link>
          <Link href="/interview" className="text-sm font-medium text-text-muted transition-colors hover:text-navy-900">
            AI Chat
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <Link
            href="/resume"
            className="rounded-full bg-navy-900 px-5 py-2 text-sm font-semibold text-white transition-transform hover:scale-105 active:scale-95"
          >
            Start Building
          </Link>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-background px-6 py-20 md:py-32 lg:px-12 min-h-[90vh] flex items-center">
          {/* Subtle Grid Texture overlay */}
          <div className="absolute inset-0 z-0 bg-[radial-gradient(#CBD5E1_1px,transparent_1px)] [background-size:24px_24px] opacity-30"></div>
          <div className="absolute top-0 right-0 -mr-48 -mt-48 w-96 h-96 rounded-full bg-blue-bg blur-3xl opacity-60"></div>

          <div className="relative z-10 mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Left Column: Typography & CTAs */}
            <div className="max-w-xl">
              <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-navy-900 leading-[1.05] mb-6">
                Precision engineering <br className="hidden md:block" />for your career.
              </h1>
              <p className="text-lg md:text-xl text-text-secondary leading-relaxed mb-10 font-medium max-w-lg">
                Create a polished resume manually, or let our AI interview you about your experience to build it for you—all in one structured workspace.
              </p>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <Link
                  href="/resume"
                  className="rounded-full bg-navy-600 px-8 py-4 text-base font-bold text-white transition-all hover:bg-[#1D4ED8] hover:shadow-lg hover:shadow-navy-600/20"
                >
                  Start Building
                </Link>
                <Link
                  href="/interview"
                  className="group flex items-center text-base font-semibold text-navy-900 transition-colors hover:text-navy-600"
                >
                  Build with AI 
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>

            {/* Right Column: Signature Visual Element */}
            <div className="relative h-[500px] w-full hidden md:flex items-center justify-center perspective-1000">

              {/* Base Document Mockup */}
              <div className="absolute w-[320px] h-[450px] bg-white rounded-xl shadow-2xl border border-border-default transform rotate-y-[-10deg] rotate-x-[5deg] rotate-z-[2deg] p-6 flex flex-col gap-4">
                <div className="w-1/3 h-6 bg-surface-secondary rounded"></div>
                <div className="w-full h-px bg-border-light my-2"></div>
                <div className="w-3/4 h-3 bg-surface-secondary rounded"></div>
                <div className="w-full h-3 bg-surface-secondary rounded"></div>
                <div className="w-5/6 h-3 bg-surface-secondary rounded"></div>

                <div className="w-1/4 h-4 bg-surface-secondary rounded mt-4"></div>
                <div className="w-full h-3 bg-surface-secondary rounded"></div>
                <div className="w-4/5 h-3 bg-surface-secondary rounded"></div>
                <div className="w-full h-3 bg-surface-secondary rounded"></div>

                <div className="w-1/4 h-4 bg-surface-secondary rounded mt-4"></div>
                <div className="w-full h-3 bg-surface-secondary rounded"></div>
                <div className="w-[90%] h-3 bg-[#BFDBFE] rounded"></div>
                <div className="w-full h-3 bg-surface-secondary rounded"></div>
              </div>

              {/* Floating AI Annotation (Left) */}
              <div className="absolute -left-12 top-24 bg-white rounded-lg shadow-xl border border-[#BBF7D0] p-3 flex items-center gap-3 animate-float-slow">
                <div className="bg-[#F0FDF4] p-1.5 rounded-md text-[#16A34A]">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-navy-900">ATS Match: 94%</p>
                  <p className="text-[10px] text-text-muted">Strong action verbs detected</p>
                </div>
              </div>

              {/* Floating Chat Bubble (Right) */}
              <div className="absolute -right-8 bottom-32 bg-ai-primary text-white rounded-2xl rounded-br-none shadow-xl shadow-navy-600/20 p-4 max-w-[220px] animate-float-delayed">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-4 w-4 text-[#BFDBFE]" />
                  <span className="text-xs font-bold text-[#EFF6FF]">AI Interviewer</span>
                </div>
                <p className="text-sm font-medium leading-tight">
                  "What was your biggest achievement in your last role? I'll turn it into a bullet point."
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* Features / Dark Block Section */}
        <section className="bg-[#0B1220] text-white pt-20 pb-16 px-6 lg:px-12 relative overflow-hidden">
          {/* Diagonal grid texture overlay */}
          <div className="absolute inset-0 z-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:32px_32px]"></div>

          <div className="relative z-10 mx-auto max-w-7xl flex flex-col gap-6">
            <div className="mb-8 max-w-2xl">
              <h2 className="text-4xl font-extrabold tracking-tighter mb-4 text-white">
                Everything required to stand out.
              </h2>
              <p className="text-lg text-text-disabled">
                We replaced generic templates and generic advice with purpose-built tools that actually move the needle for your career.
              </p>
            </div>

            {/* Top Row: Hero Feature */}
            <div className="relative bg-navy-900 border border-navy-800 rounded-[2rem] p-10 lg:p-14 flex flex-col lg:flex-row items-center gap-12 overflow-hidden shadow-2xl">
              {/* Targeted radial glow */}
              <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[600px] h-[600px] bg-navy-600/20 rounded-[100%] blur-[100px] pointer-events-none"></div>

              <div className="relative z-10 lg:w-1/2 flex flex-col items-start">
                <h3 className="text-4xl lg:text-5xl font-black tracking-tighter text-white leading-[1.1] mb-4">
                  Build your resume through conversation.
                </h3>
                <p className="text-lg text-text-disabled leading-relaxed mb-6">
                  Don't stare at a blank page. Our AI assistant will interview you about your work history and automatically draft professional resume bullet points based on your answers.
                </p>
                <Link href="/interview" className="text-ai-primary font-bold hover:text-white transition-colors flex items-center gap-2">
                  Try the AI chat <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              {/* Custom Visual: Chat Snippet */}
              <div className="relative z-10 lg:w-1/2 w-full flex justify-end perspective-1000">
                <div className="w-full max-w-[400px] bg-navy-950 rounded-2xl border border-navy-800 shadow-2xl p-5 flex flex-col gap-4 transform rotate-y-[-5deg] rotate-x-[2deg]">
                  {/* AI Message */}
                  <div className="self-start flex gap-3 max-w-[85%]">
                    <div className="w-8 h-8 rounded-full bg-navy-800 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-4 h-4 text-ai-primary" />
                    </div>
                    <div className="bg-navy-800/50 border border-navy-800 rounded-2xl rounded-tl-none p-3 text-sm text-white/90">
                      Tell me about your last role at Acme Corp. What were your main responsibilities?
                    </div>
                  </div>
                  {/* User Message */}
                  <div className="self-end bg-ai-primary text-white rounded-2xl rounded-tr-none p-3 text-sm max-w-[80%] shadow-lg shadow-ai-primary/20">
                    I led a team of 5 engineers to migrate our backend to AWS, resulting in a 30% cost reduction.
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Row: 2 Supporting Features */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Supporting Feature 1 */}
              <div className="bg-[#0F172A] border border-navy-800 rounded-[2rem] p-8 lg:p-10 flex flex-col h-full group hover:border-navy-700 transition-colors">
                <div className="mb-10 w-full bg-navy-950 rounded-xl border border-navy-800 p-6 shadow-inner font-mono text-sm flex flex-col gap-2 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-error"></div>
                  <p className="text-text-disabled line-through opacity-50 ml-3">Responsible for increasing sales by a lot.</p>
                  <div className="absolute bottom-0 left-0 w-1 h-1/2 bg-success"></div>
                  <p className="text-success ml-3 bg-success/10 py-1 px-2 rounded">Spearheaded Q3 sales strategy, driving a 42% YoY revenue increase.</p>
                </div>
                <div className="mt-auto">
                  <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">Resume Builder</h3>
                  <p className="text-text-disabled leading-relaxed text-sm">
                    Shape a polished resume and preview the result in real-time. Build your draft in a clean, structured environment.
                  </p>
                </div>
              </div>

              {/* Supporting Feature 2 */}
              <div className="bg-[#0F172A] border border-navy-800 rounded-[2rem] p-8 lg:p-10 flex flex-col h-full group hover:border-navy-700 transition-colors">
                <div className="mb-10 w-full flex justify-center items-center h-32">
                  <div className="relative flex items-center justify-center w-28 h-28">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                      <path className="text-navy-800" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                      <path className="text-success drop-shadow-[0_0_8px_rgba(22,163,74,0.5)]" strokeDasharray="98, 100" strokeWidth="3" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    </svg>
                    <div className="absolute text-xl font-bold text-white">98%</div>
                  </div>
                </div>
                <div className="mt-auto">
                  <h3 className="text-xl font-semibold text-white mb-2 tracking-wide">PDF Export</h3>
                  <p className="text-text-disabled leading-relaxed text-sm">
                    Generate a ready-to-share PDF layout from your draft. Ensure your resume is perfectly formatted for sharing and printing.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-navy-950 py-12 px-6 lg:px-12 border-t border-navy-900 text-white">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-xl font-black tracking-tighter">Resume AI.</span>
          </div>
          <p className="text-sm font-medium text-text-disabled">
            © {new Date().getFullYear()} Resume AI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

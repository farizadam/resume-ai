import Link from "next/link";

const features = [
  {
    title: "Interview practice",
    description: "Chat with an AI interviewer and prepare your answers.",
    href: "/interview",
  },
  {
    title: "Resume builder",
    description: "Shape a polished resume and preview the result.",
    href: "/resume",
  },
  {
    title: "PDF export",
    description: "Generate a ready-to-share layout from your draft.",
    href: "/api/pdf",
  },
];

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center px-6 py-16">
      <section className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm sm:p-12">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-zinc-500">
          Resume AI
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl">
          Prepare for interviews and build a stronger resume.
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-zinc-600">
          This workspace now includes dedicated interview, resume, and PDF routes so you can expand the experience in a structured way.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {features.map((feature) => (
            <Link
              key={feature.title}
              href={feature.href}
              className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5 transition hover:border-zinc-400 hover:bg-white"
            >
              <h2 className="text-lg font-semibold text-zinc-900">{feature.title}</h2>
              <p className="mt-2 text-sm text-zinc-600">{feature.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}

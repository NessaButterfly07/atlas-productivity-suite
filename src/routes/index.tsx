import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sparkles, FileText, Search, ListChecks, ArrowRight, Zap, Shield, Clock } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-border/50 bg-background/70 backdrop-blur-lg">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2 font-bold text-lg">
            <span className="grid h-8 w-8 place-items-center rounded-lg" style={{ background: "var(--gradient-primary)" }}>
              <Sparkles className="h-4 w-4 text-white" />
            </span>
            AI Productivity
          </Link>
          <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition">Features</a>
            <a href="#testimonials" className="hover:text-foreground transition">Testimonials</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link to="/auth"><Button variant="ghost" size="sm">Sign in</Button></Link>
            <Link to="/auth"><Button size="sm">Get started</Button></Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-30 pointer-events-none"
          style={{ background: "var(--gradient-hero)" }}
        />
        <div className="relative mx-auto max-w-7xl px-6 py-24 md:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur">
              <Sparkles className="h-3 w-3" />
              Powered by Lovable AI
            </div>
            <h1 className="mt-6 text-4xl font-bold tracking-tight md:text-6xl">
              Work Smarter with{" "}
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-primary)" }}>
                AI Productivity Assistant
              </span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground md:text-xl">
              Summarize meetings, research topics, and generate task plans — all in a single AI-powered workspace.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link to="/auth">
                <Button size="lg" className="gap-2">
                  Start free <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <a href="#features">
                <Button size="lg" variant="outline">See features</Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-7xl px-6 py-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold">Three AI tools. One workspace.</h2>
          <p className="mt-3 text-muted-foreground">Everything you need to move faster at work.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { icon: FileText, title: "Meeting Notes Summarizer", desc: "Turn raw notes into executive summaries, decisions, and action items in seconds." },
            { icon: Search, title: "AI Research Assistant", desc: "Ask any question — get structured overviews, key facts, and follow-ups." },
            { icon: ListChecks, title: "AI Task Planner", desc: "Enter a goal — get a prioritized plan with deadlines and daily workflow." },
          ].map((f) => (
            <Card key={f.title} className="p-6 transition hover:-translate-y-1" style={{ boxShadow: "var(--shadow-soft)" }}>
              <div className="grid h-11 w-11 place-items-center rounded-xl" style={{ background: "var(--gradient-primary)" }}>
                <f.icon className="h-5 w-5 text-white" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section className="border-y border-border/60 bg-muted/30">
        <div className="mx-auto max-w-7xl px-6 py-16 grid gap-8 md:grid-cols-3">
          {[
            { icon: Zap, title: "Fast", desc: "Get results in seconds." },
            { icon: Shield, title: "Private", desc: "Your data stays in your account." },
            { icon: Clock, title: "Save hours", desc: "Automate the busywork." },
          ].map((b) => (
            <div key={b.title} className="flex items-start gap-4">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-accent text-accent-foreground">
                <b.icon className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-semibold">{b.title}</h4>
                <p className="text-sm text-muted-foreground">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="mx-auto max-w-7xl px-6 py-20">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-14">Loved by productive teams</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { q: "Cut my meeting recap time by 90%. Game-changer.", n: "Priya S.", r: "Product Manager" },
            { q: "My daily go-to for planning weekly sprints.", n: "Marcus T.", r: "Engineering Lead" },
            { q: "The research tool is like a senior analyst on call.", n: "Elena R.", r: "Strategy Consultant" },
          ].map((t) => (
            <Card key={t.n} className="p-6">
              <p className="text-sm leading-relaxed">"{t.q}"</p>
              <div className="mt-4 text-sm">
                <div className="font-semibold">{t.n}</div>
                <div className="text-muted-foreground">{t.r}</div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-4xl px-6 py-20 text-center">
        <Card className="p-10" style={{ background: "var(--gradient-hero)" }}>
          <h2 className="text-3xl font-bold text-white">Ready to work smarter?</h2>
          <p className="mt-3 text-white/90">Join thousands using AI Productivity Assistant every day.</p>
          <Link to="/auth" className="inline-block mt-6">
            <Button size="lg" variant="secondary">Get started free</Button>
          </Link>
        </Card>
      </section>

      <footer className="border-t border-border/60 py-10 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} AI Productivity Assistant. Built with Lovable.
      </footer>
    </div>
  );
}

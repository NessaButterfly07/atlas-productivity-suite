import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Search, ListChecks, TrendingUp, Clock, CheckCircle2, ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { format } from "date-fns";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — AI Productivity" }] }),
  component: Dashboard,
});

function Dashboard() {
  const { data: stats } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const [tasks, meetings, research] = await Promise.all([
        supabase.from("tasks").select("id, completed, deadline, title, created_at").order("created_at", { ascending: false }),
        supabase.from("meeting_summaries").select("id, title, created_at").order("created_at", { ascending: false }).limit(5),
        supabase.from("research_history").select("id, topic, created_at").order("created_at", { ascending: false }).limit(5),
      ]);
      const allTasks = tasks.data ?? [];
      const done = allTasks.filter((t) => t.completed).length;
      return {
        totalTasks: allTasks.length,
        doneTasks: done,
        upcoming: allTasks.filter((t) => !t.completed && t.deadline).slice(0, 5),
        meetings: meetings.data ?? [],
        research: research.data ?? [],
        activity: [
          ...(meetings.data ?? []).map((m) => ({ type: "Meeting", title: m.title, at: m.created_at })),
          ...(research.data ?? []).map((r) => ({ type: "Research", title: r.topic, at: r.created_at })),
          ...allTasks.slice(0, 3).map((t) => ({ type: "Task", title: t.title, at: t.created_at })),
        ].sort((a, b) => (a.at < b.at ? 1 : -1)).slice(0, 6),
      };
    },
  });

  const cards = [
    { label: "Meetings summarized", value: stats?.meetings.length ?? 0, icon: FileText },
    { label: "Research queries", value: stats?.research.length ?? 0, icon: Search },
    { label: "Total tasks", value: stats?.totalTasks ?? 0, icon: ListChecks },
    { label: "Completed", value: stats?.doneTasks ?? 0, icon: CheckCircle2 },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <PageHeader title="Welcome back" description="Your AI productivity hub — pick a tool below to get started." icon={TrendingUp} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {cards.map((c) => (
          <Card key={c.label} className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{c.label}</span>
              <c.icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="mt-2 text-3xl font-bold">{c.value}</div>
          </Card>
        ))}
      </div>

      <h2 className="text-lg font-semibold mb-3">Quick actions</h2>
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        {[
          { to: "/meetings" as const, title: "Summarize meeting", desc: "Paste notes → structured summary.", icon: FileText },
          { to: "/research" as const, title: "Research a topic", desc: "Ask anything, get a briefing.", icon: Search },
          { to: "/tasks" as const, title: "Plan a project", desc: "Turn a goal into a task plan.", icon: ListChecks },
        ].map((q) => (
          <Link key={q.to} to={q.to}>
            <Card className="p-5 h-full transition hover:-translate-y-0.5 hover:shadow-lg cursor-pointer">
              <div className="grid h-10 w-10 place-items-center rounded-xl" style={{ background: "var(--gradient-primary)" }}>
                <q.icon className="h-5 w-5 text-white" />
              </div>
              <h3 className="mt-3 font-semibold flex items-center gap-1">{q.title} <ArrowRight className="h-3.5 w-3.5" /></h3>
              <p className="text-sm text-muted-foreground mt-1">{q.desc}</p>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-5">
          <h3 className="font-semibold mb-4 flex items-center gap-2"><Clock className="h-4 w-4" /> Upcoming deadlines</h3>
          {stats?.upcoming.length ? (
            <ul className="space-y-3">
              {stats.upcoming.map((t) => (
                <li key={t.id} className="flex items-center justify-between text-sm">
                  <span className="truncate pr-2">{t.title}</span>
                  <Badge variant="secondary">{t.deadline && format(new Date(t.deadline), "MMM d")}</Badge>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">No upcoming deadlines. Plan a project to add some.</p>
          )}
        </Card>
        <Card className="p-5">
          <h3 className="font-semibold mb-4 flex items-center gap-2"><TrendingUp className="h-4 w-4" /> Recent activity</h3>
          {stats?.activity.length ? (
            <ul className="space-y-3">
              {stats.activity.map((a, i) => (
                <li key={i} className="flex items-center justify-between text-sm">
                  <div className="min-w-0 pr-2">
                    <Badge variant="outline" className="mr-2">{a.type}</Badge>
                    <span className="truncate">{a.title}</span>
                  </div>
                  <span className="text-xs text-muted-foreground shrink-0">{format(new Date(a.at), "MMM d")}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">No activity yet.</p>
          )}
        </Card>
      </div>
    </div>
  );
}
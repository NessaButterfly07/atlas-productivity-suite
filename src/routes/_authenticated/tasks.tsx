import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { generateTaskPlan } from "@/lib/ai.functions";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { PageHeader } from "@/components/page-header";
import { ResponsibleAI } from "@/components/responsible-ai";
import { ListChecks, Sparkles, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

export const Route = createFileRoute("/_authenticated/tasks")({
  head: () => ({ meta: [{ title: "AI Task Planner" }] }),
  component: Tasks,
});

const priorityColor: Record<string, string> = {
  high: "bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/30",
  medium: "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30",
  low: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30",
};

function Tasks() {
  const [goal, setGoal] = useState("");
  const [deadline, setDeadline] = useState("");
  const [plan, setPlan] = useState<string | null>(null);
  const qc = useQueryClient();
  const call = useServerFn(generateTaskPlan);

  const tasks = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => (await supabase.from("tasks").select("*").order("order_index").order("created_at", { ascending: false })).data ?? [],
  });

  const mutation = useMutation({
    mutationFn: async () => call({ data: { goal, deadline: deadline || undefined } }),
    onSuccess: (res) => {
      setPlan(res.plan);
      toast.success(`Generated ${res.taskCount} tasks`);
      qc.invalidateQueries({ queryKey: ["tasks"] });
      qc.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  async function toggle(id: string, completed: boolean) {
    const { error } = await supabase.from("tasks").update({ completed: !completed }).eq("id", id);
    if (error) toast.error(error.message);
    else qc.invalidateQueries({ queryKey: ["tasks"] });
  }

  async function remove(id: string) {
    const { error } = await supabase.from("tasks").delete().eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("Deleted"); qc.invalidateQueries({ queryKey: ["tasks"] }); }
  }

  const grouped = (tasks.data ?? []).reduce((acc: Record<string, typeof tasks.data>, t) => {
    (acc[t.project_goal] ||= [] as unknown as typeof tasks.data)!.push(t);
    return acc;
  }, {});

  return (
    <div className="max-w-6xl mx-auto">
      <PageHeader title="AI Task Planner" description="Turn a goal into a structured, prioritized plan." icon={ListChecks} />

      <Card className="p-5 mb-6">
        <div className="grid gap-3 md:grid-cols-[1fr_200px_auto] md:items-end">
          <div>
            <Label htmlFor="goal">Project goal</Label>
            <Input id="goal" value={goal} onChange={(e) => setGoal(e.target.value)} placeholder="Launch a new marketing website" />
          </div>
          <div>
            <Label htmlFor="deadline">Target date (optional)</Label>
            <Input id="deadline" type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
          </div>
          <Button onClick={() => mutation.mutate()} disabled={mutation.isPending || goal.trim().length < 3} className="gap-2">
            {mutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            Generate Plan
          </Button>
        </div>
      </Card>

      {plan && (
        <Card className="p-5 mb-6">
          <h3 className="font-semibold mb-3">AI-generated plan</h3>
          <div className="prose prose-sm max-w-none whitespace-pre-wrap text-sm leading-relaxed">{plan}</div>
        </Card>
      )}

      <div className="space-y-6">
        {Object.entries(grouped).length === 0 && !mutation.isPending && (
          <Card className="p-10 text-center text-muted-foreground">No tasks yet. Generate a plan above to get started.</Card>
        )}
        {Object.entries(grouped).map(([g, ts]) => (
          <Card key={g} className="p-5">
            <h3 className="font-semibold mb-4">{g}</h3>
            <ul className="divide-y divide-border">
              {ts!.map((t) => (
                <li key={t.id} className="py-3 flex items-start gap-3">
                  <Checkbox checked={t.completed} onCheckedChange={() => toggle(t.id, t.completed)} className="mt-1" />
                  <div className="flex-1 min-w-0">
                    <div className={`font-medium ${t.completed ? "line-through text-muted-foreground" : ""}`}>{t.title}</div>
                    {t.description && <div className="text-sm text-muted-foreground mt-0.5">{t.description}</div>}
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Badge variant="outline" className={priorityColor[t.priority] ?? ""}>{t.priority}</Badge>
                      {t.deadline && <Badge variant="secondary">Due {format(new Date(t.deadline), "MMM d")}</Badge>}
                    </div>
                  </div>
                  <Button size="icon" variant="ghost" onClick={() => remove(t.id)} aria-label="Delete">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>

      <ResponsibleAI />
    </div>
  );
}
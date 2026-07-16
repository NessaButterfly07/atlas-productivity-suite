import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { runResearch } from "@/lib/ai.functions";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/page-header";
import { ResponsibleAI } from "@/components/responsible-ai";
import { Search, Sparkles, Loader2, Copy, Download } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

export const Route = createFileRoute("/_authenticated/research")({
  head: () => ({ meta: [{ title: "AI Research Assistant" }] }),
  component: Research,
});

function Research() {
  const [topic, setTopic] = useState("");
  const [response, setResponse] = useState<string | null>(null);
  const qc = useQueryClient();
  const call = useServerFn(runResearch);

  const history = useQuery({
    queryKey: ["research-recent"],
    queryFn: async () => (await supabase.from("research_history").select("*").order("created_at", { ascending: false }).limit(5)).data ?? [],
  });

  const mutation = useMutation({
    mutationFn: async () => call({ data: { topic } }),
    onSuccess: (row) => {
      setResponse(row.response);
      toast.success("Research ready");
      qc.invalidateQueries({ queryKey: ["research-recent"] });
      qc.invalidateQueries({ queryKey: ["research-history"] });
      qc.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  function copy() {
    if (!response) return;
    navigator.clipboard.writeText(response);
    toast.success("Copied");
  }

  function downloadNotes() {
    if (!response) return;
    const blob = new Blob([`# ${topic}\n\n${response}`], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `research-${Date.now()}.md`; a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="max-w-6xl mx-auto">
      <PageHeader title="AI Research Assistant" description="Ask a question or research topic. Get a structured briefing." icon={Search} />

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <Card className="p-5">
            <h2 className="font-semibold mb-4">Ask a question</h2>
            <Textarea value={topic} onChange={(e) => setTopic(e.target.value)} rows={4} placeholder="e.g. What are the tradeoffs of serverless vs traditional cloud architectures?" />
            <div className="mt-3 flex justify-end">
              <Button onClick={() => mutation.mutate()} disabled={mutation.isPending || topic.trim().length < 3} className="gap-2">
                {mutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                Generate Research
              </Button>
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold">Response</h2>
              {response && (
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={copy}><Copy className="h-3.5 w-3.5 mr-1" /> Copy</Button>
                  <Button size="sm" variant="outline" onClick={downloadNotes}><Download className="h-3.5 w-3.5 mr-1" /> Download</Button>
                </div>
              )}
            </div>
            {mutation.isPending && <div className="flex items-center gap-2 text-sm text-muted-foreground py-8"><Loader2 className="h-4 w-4 animate-spin" /> Researching…</div>}
            {!mutation.isPending && !response && <div className="text-sm text-muted-foreground py-12 text-center border border-dashed rounded-lg">Ask a question to see the AI briefing.</div>}
            {response && <div className="prose prose-sm max-w-none whitespace-pre-wrap text-sm leading-relaxed">{response}</div>}
          </Card>

          <ResponsibleAI />
        </div>

        <Card className="p-5 h-fit">
          <h3 className="font-semibold mb-3">Recent searches</h3>
          {history.data?.length ? (
            <ul className="space-y-2">
              {history.data.map((r) => (
                <li key={r.id}>
                  <button className="text-left w-full text-sm hover:bg-accent rounded p-2 -mx-2 transition" onClick={() => { setTopic(r.topic); setResponse(r.response); }}>
                    <div className="font-medium truncate">{r.topic}</div>
                    <div className="text-xs text-muted-foreground">{format(new Date(r.created_at), "MMM d, HH:mm")}</div>
                  </button>
                </li>
              ))}
            </ul>
          ) : <p className="text-sm text-muted-foreground">No searches yet.</p>}
        </Card>
      </div>
    </div>
  );
}
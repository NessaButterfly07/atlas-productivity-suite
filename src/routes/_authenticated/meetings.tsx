import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/page-header";
import { ResponsibleAI } from "@/components/responsible-ai";
import { FileText, Copy, Sparkles, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { summarizeMeeting } from "@/lib/ai.functions";

export const Route = createFileRoute("/_authenticated/meetings")({
  head: () => ({ meta: [{ title: "Meeting Notes Summarizer" }] }),
  component: Meetings,
});

function Meetings() {
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [summary, setSummary] = useState<string | null>(null);
  const qc = useQueryClient();
  const call = useServerFn(summarizeMeeting);

  const mutation = useMutation({
    mutationFn: async () => call({ data: { title: title || "Untitled meeting", notes } }),
    onSuccess: (row) => {
      setSummary(row.summary);
      toast.success("Summary ready");
      qc.invalidateQueries({ queryKey: ["dashboard-stats"] });
      qc.invalidateQueries({ queryKey: ["meeting-history"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    setNotes(text);
    toast.success("File loaded");
  }

  function copy() {
    if (!summary) return;
    navigator.clipboard.writeText(summary);
    toast.success("Copied to clipboard");
  }

  function downloadPdf() {
    if (!summary) return;
    const w = window.open("", "_blank");
    if (!w) return;
    w.document.write(`<html><head><title>${title || "Summary"}</title><style>body{font-family:system-ui;max-width:720px;margin:2rem auto;padding:0 1rem;line-height:1.6}</style></head><body><h1>${title || "Meeting Summary"}</h1><pre style="white-space:pre-wrap;font-family:inherit">${summary.replace(/</g, "&lt;")}</pre></body></html>`);
    w.document.close();
    setTimeout(() => w.print(), 300);
  }

  return (
    <div className="max-w-6xl mx-auto">
      <PageHeader title="Meeting Notes Summarizer" description="Paste your notes, get an executive summary, decisions, and action items." icon={FileText} />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-5">
          <h2 className="font-semibold mb-4">Input</h2>
          <div className="space-y-3">
            <div>
              <Label htmlFor="title">Meeting title</Label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Weekly product sync" />
            </div>
            <div>
              <Label htmlFor="notes">Meeting notes</Label>
              <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={14} placeholder="Paste your meeting notes here..." />
            </div>
            <div className="flex flex-wrap gap-2">
              <label className="inline-flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
                <input type="file" accept=".txt,.md" onChange={handleFile} className="hidden" />
                <span className="rounded-md border border-input px-3 py-1.5 hover:bg-accent">Upload .txt</span>
              </label>
              <Button variant="ghost" size="sm" onClick={() => { setNotes(""); setSummary(null); setTitle(""); }}>
                <Trash2 className="h-4 w-4 mr-1" /> Clear
              </Button>
              <Button className="ml-auto gap-2" onClick={() => mutation.mutate()} disabled={mutation.isPending || notes.length < 10}>
                {mutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                Summarize
              </Button>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">AI Summary</h2>
            {summary && (
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={copy}><Copy className="h-3.5 w-3.5 mr-1" /> Copy</Button>
                <Button size="sm" variant="outline" onClick={downloadPdf}>Download PDF</Button>
              </div>
            )}
          </div>
          {mutation.isPending && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground py-8"><Loader2 className="h-4 w-4 animate-spin" /> Generating summary…</div>
          )}
          {!mutation.isPending && !summary && (
            <div className="text-sm text-muted-foreground py-12 text-center border border-dashed rounded-lg">
              Your AI summary will appear here.
            </div>
          )}
          {summary && (
            <div className="prose prose-sm max-w-none whitespace-pre-wrap text-sm leading-relaxed">
              {summary}
            </div>
          )}
        </Card>
      </div>

      <ResponsibleAI />
    </div>
  );
}
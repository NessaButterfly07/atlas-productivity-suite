import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { PageHeader } from "@/components/page-header";
import { History as HistoryIcon, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { useState } from "react";

export const Route = createFileRoute("/_authenticated/history")({
  head: () => ({ meta: [{ title: "History" }] }),
  component: HistoryPage,
});

function HistoryPage() {
  const qc = useQueryClient();
  const [openId, setOpenId] = useState<string | null>(null);

  const meetings = useQuery({
    queryKey: ["meeting-history"],
    queryFn: async () => (await supabase.from("meeting_summaries").select("*").order("created_at", { ascending: false })).data ?? [],
  });
  const research = useQuery({
    queryKey: ["research-history"],
    queryFn: async () => (await supabase.from("research_history").select("*").order("created_at", { ascending: false })).data ?? [],
  });

  async function del(table: "meeting_summaries" | "research_history", id: string) {
    const { error } = await supabase.from(table).delete().eq("id", id);
    if (error) toast.error(error.message);
    else {
      toast.success("Deleted");
      qc.invalidateQueries({ queryKey: [table === "meeting_summaries" ? "meeting-history" : "research-history"] });
      qc.invalidateQueries({ queryKey: ["dashboard-stats"] });
    }
  }

  return (
    <div className="max-w-5xl mx-auto">
      <PageHeader title="History" description="Review your saved meeting summaries and research briefings." icon={HistoryIcon} />

      <Tabs defaultValue="meetings">
        <TabsList>
          <TabsTrigger value="meetings">Meetings ({meetings.data?.length ?? 0})</TabsTrigger>
          <TabsTrigger value="research">Research ({research.data?.length ?? 0})</TabsTrigger>
        </TabsList>

        <TabsContent value="meetings" className="mt-4 space-y-3">
          {meetings.data?.length === 0 && <Card className="p-8 text-center text-muted-foreground">No meetings yet.</Card>}
          {meetings.data?.map((m) => (
            <Card key={m.id} className="p-4">
              <div className="flex items-center justify-between gap-2">
                <button className="text-left flex-1 min-w-0" onClick={() => setOpenId(openId === m.id ? null : m.id)}>
                  <div className="font-medium truncate">{m.title}</div>
                  <div className="text-xs text-muted-foreground">{format(new Date(m.created_at), "PPp")}</div>
                </button>
                <Button size="icon" variant="ghost" onClick={() => del("meeting_summaries", m.id)}><Trash2 className="h-4 w-4" /></Button>
              </div>
              {openId === m.id && (
                <div className="mt-3 pt-3 border-t text-sm whitespace-pre-wrap">{m.summary}</div>
              )}
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="research" className="mt-4 space-y-3">
          {research.data?.length === 0 && <Card className="p-8 text-center text-muted-foreground">No research yet.</Card>}
          {research.data?.map((r) => (
            <Card key={r.id} className="p-4">
              <div className="flex items-center justify-between gap-2">
                <button className="text-left flex-1 min-w-0" onClick={() => setOpenId(openId === r.id ? null : r.id)}>
                  <div className="font-medium truncate">{r.topic}</div>
                  <div className="text-xs text-muted-foreground">{format(new Date(r.created_at), "PPp")}</div>
                </button>
                <Button size="icon" variant="ghost" onClick={() => del("research_history", r.id)}><Trash2 className="h-4 w-4" /></Button>
              </div>
              {openId === r.id && (
                <div className="mt-3 pt-3 border-t text-sm whitespace-pre-wrap">{r.response}</div>
              )}
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
import { AlertTriangle } from "lucide-react";

export function ResponsibleAI() {
  return (
    <div className="mt-6 flex items-start gap-3 rounded-lg border border-border bg-muted/40 p-4 text-sm text-muted-foreground">
      <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
      <p>
        <span className="font-medium text-foreground">Responsible AI Notice:</span> AI-generated responses are intended to assist users and may occasionally contain inaccuracies or incomplete information. Always review important information before making business or personal decisions.
      </p>
    </div>
  );
}
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { PageHeader } from "@/components/page-header";
import { Settings as SettingsIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/settings")({
  head: () => ({ meta: [{ title: "Settings" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  const [dark, setDark] = useState(false);
  const [notify, setNotify] = useState(true);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
    setNotify(localStorage.getItem("notify") !== "false");
  }, []);

  function toggleDark(v: boolean) {
    setDark(v);
    document.documentElement.classList.toggle("dark", v);
    localStorage.setItem("theme", v ? "dark" : "light");
  }

  function toggleNotify(v: boolean) {
    setNotify(v);
    localStorage.setItem("notify", String(v));
  }

  async function sendReset() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.email) return;
    const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) toast.error(error.message);
    else toast.success("Password reset email sent");
  }

  return (
    <div className="max-w-2xl mx-auto">
      <PageHeader title="Settings" description="Preferences and app configuration." icon={SettingsIcon} />
      <Card className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-base">Dark mode</Label>
            <p className="text-sm text-muted-foreground">Switch between light and dark themes.</p>
          </div>
          <Switch checked={dark} onCheckedChange={toggleDark} />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-base">In-app notifications</Label>
            <p className="text-sm text-muted-foreground">Show toasts for AI results and actions.</p>
          </div>
          <Switch checked={notify} onCheckedChange={toggleNotify} />
        </div>
        <div className="pt-4 border-t">
          <Label className="text-base">Password</Label>
          <p className="text-sm text-muted-foreground mb-3">Send a reset link to your email.</p>
          <Button variant="outline" onClick={sendReset}>Send password reset</Button>
        </div>
      </Card>
    </div>
  );
}
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Sparkles } from "lucide-react";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Sign in — AI Productivity Assistant" }] }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetMode, setResetMode] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/dashboard" });
    });
  }, [navigate]);

  async function signIn(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Welcome back!");
    navigate({ to: "/dashboard" });
  }

  async function signUp(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
        emailRedirectTo: window.location.origin,
      },
    });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Account created! Check your email to confirm.");
  }

  async function google() {
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (result.error) toast.error(String((result.error as { message?: string }).message ?? result.error));
  }

  async function reset(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + "/reset-password",
    });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Password reset email sent.");
    setResetMode(false);
  }

  return (
    <div className="min-h-screen grid place-items-center px-4 py-10" style={{ background: "var(--gradient-hero)" }}>
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-2 text-white mb-6">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-white/20 backdrop-blur">
            <Sparkles className="h-4 w-4" />
          </span>
          <span className="font-bold text-lg">AI Productivity Assistant</span>
        </div>
        <Card className="p-6">
          {resetMode ? (
            <form onSubmit={reset} className="space-y-4">
              <h2 className="text-xl font-semibold">Reset password</h2>
              <div>
                <Label htmlFor="rmail">Email</Label>
                <Input id="rmail" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <Button className="w-full" disabled={loading}>Send reset link</Button>
              <button type="button" onClick={() => setResetMode(false)} className="text-sm text-muted-foreground hover:text-foreground w-full text-center">
                Back to sign in
              </button>
            </form>
          ) : (
            <Tabs defaultValue="signin">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign in</TabsTrigger>
                <TabsTrigger value="signup">Sign up</TabsTrigger>
              </TabsList>
              <TabsContent value="signin" className="space-y-4 mt-4">
                <form onSubmit={signIn} className="space-y-3">
                  <div><Label htmlFor="email">Email</Label><Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
                  <div><Label htmlFor="password">Password</Label><Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required /></div>
                  <Button className="w-full" disabled={loading}>Sign in</Button>
                </form>
                <button type="button" onClick={() => setResetMode(true)} className="text-xs text-muted-foreground hover:text-foreground w-full text-center">Forgot password?</button>
              </TabsContent>
              <TabsContent value="signup" className="space-y-4 mt-4">
                <form onSubmit={signUp} className="space-y-3">
                  <div><Label htmlFor="name">Name</Label><Input id="name" value={name} onChange={(e) => setName(e.target.value)} required /></div>
                  <div><Label htmlFor="email2">Email</Label><Input id="email2" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
                  <div><Label htmlFor="password2">Password</Label><Input id="password2" type="password" value={password} onChange={(e) => setPassword(e.target.value)} minLength={6} required /></div>
                  <Button className="w-full" disabled={loading}>Create account</Button>
                </form>
              </TabsContent>
              <div className="mt-4">
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
                  <div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground">Or</span></div>
                </div>
                <Button variant="outline" className="w-full" onClick={google} type="button">
                  Continue with Google
                </Button>
              </div>
            </Tabs>
          )}
        </Card>
      </div>
    </div>
  );
}
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<"loading" | "auth" | "unauth">("loading");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/admin/me")
      .then((res) => {
        if (res.ok) setStatus("auth");
        else setStatus("unauth");
      })
      .catch(() => setStatus("unauth"));
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus("auth");
        router.refresh();
      } else {
        setError(data.error || "Mot de passe incorrect");
      }
    } catch {
      setError("Erreur de connexion");
    }
    setSubmitting(false);
  };

  if (status === "loading") {
    return (
      <div className="flex min-h-[50vh] items-center justify-center px-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (status === "unauth") {
    return (
      <div className="mx-auto max-w-sm px-4 py-16">
        <div className="flex items-center gap-2 text-primary">
          <Lock className="h-6 w-6" />
          <h1 className="font-heading text-xl font-semibold">Administration</h1>
        </div>
        <p className="mt-2 text-sm text-gray-600">
          Entrez le mot de passe pour accéder à l&apos;admin.
        </p>
        <form onSubmit={handleLogin} className="mt-6 space-y-4">
          <div>
            <Label htmlFor="admin-password">Mot de passe</Label>
            <Input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2"
              placeholder="••••••••"
              autoFocus
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button type="submit" disabled={submitting} className="w-full">
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Accéder"}
          </Button>
        </form>
      </div>
    );
  }

  return <>{children}</>;
}

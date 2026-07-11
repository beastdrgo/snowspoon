"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, Lock, Loader2, ArrowRight, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="grid min-h-screen place-items-center text-muted">Loading…</div>}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const redirect = params.get("redirect") || "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<"login" | "forgot">("login");
  const [notice, setNotice] = useState<string | null>(null);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    router.replace(redirect);
    router.refresh();
  }

  async function handleForgot(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setNotice(null);
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/admin/login`,
    });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    setNotice("If that email exists, a password reset link is on its way.");
  }

  return (
    <div className="grid min-h-screen place-items-center px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md"
      >
        <div className="mb-6 text-center">
          <Link href="/" className="inline-flex">
            <Image src="/logo.png" alt="Snow Spoon" width={150} height={50} className="h-12 w-auto" />
          </Link>
        </div>

        <div className="card rounded-3xl p-7 sm:p-8">
          <h1 className="font-display text-2xl font-bold text-ink">
            {mode === "login" ? "Admin sign in" : "Reset password"}
          </h1>
          <p className="mt-1 text-sm text-ink-soft">
            {mode === "login"
              ? "Manage your menu, categories and site content."
              : "Enter your email and we'll send a reset link."}
          </p>

          {error && (
            <div className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
              {error}
            </div>
          )}
          {notice && (
            <div className="mt-4 rounded-2xl bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
              {notice}
            </div>
          )}

          <form onSubmit={mode === "login" ? handleLogin : handleForgot} className="mt-5 space-y-4">
            <Field
              icon={<Mail className="size-4.5" />}
              type="email"
              placeholder="admin@snowspoon.in"
              value={email}
              onChange={setEmail}
              autoComplete="email"
            />

            {mode === "login" && (
              <div className="relative">
                <Field
                  icon={<Lock className="size-4.5" />}
                  type={show ? "text" : "password"}
                  placeholder="Your password"
                  value={password}
                  onChange={setPassword}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShow((v) => !v)}
                  aria-label={show ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-full text-muted hover:bg-cloud"
                >
                  {show ? <EyeOff className="size-4.5" /> : <Eye className="size-4.5" />}
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full py-3.5 text-sm disabled:opacity-70"
            >
              {loading ? (
                <Loader2 className="size-4.5 animate-spin" />
              ) : mode === "login" ? (
                <>
                  Sign in <ArrowRight className="size-4.5" />
                </>
              ) : (
                "Send reset link"
              )}
            </button>
          </form>

          <div className="mt-5 text-center text-sm">
            {mode === "login" ? (
              <button
                onClick={() => {
                  setMode("forgot");
                  setError(null);
                }}
                className="font-semibold text-brand hover:underline"
              >
                Forgot password?
              </button>
            ) : (
              <button
                onClick={() => {
                  setMode("login");
                  setError(null);
                  setNotice(null);
                }}
                className="inline-flex items-center gap-1 font-semibold text-brand hover:underline"
              >
                <ArrowLeft className="size-4" /> Back to sign in
              </button>
            )}
          </div>
        </div>

        <p className="mt-5 text-center text-xs text-muted">
          <Link href="/" className="hover:text-brand">
            ← Back to website
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

function Field({
  icon,
  type,
  placeholder,
  value,
  onChange,
  autoComplete,
}: {
  icon: React.ReactNode;
  type: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  autoComplete?: string;
}) {
  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted">
        {icon}
      </span>
      <input
        type={type}
        required
        placeholder={placeholder}
        value={value}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl border border-line bg-white py-3.5 pl-11 pr-11 text-sm text-ink outline-none transition-colors placeholder:text-muted focus:border-brand-tint focus:ring-4 focus:ring-brand/10"
      />
    </div>
  );
}

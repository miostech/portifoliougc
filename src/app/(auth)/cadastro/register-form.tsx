"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { registerUser, type RegisterState } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function RegisterForm() {
  const router = useRouter();
  const [pendingLogin, setPendingLogin] = useState(false);
  // Stash the submitted credentials so we can auto-login once the action
  // reports success — without mutating the action state object.
  const creds = useRef<{ email: string; password: string } | null>(null);
  const [state, formAction, pending] = useActionState<RegisterState, FormData>(
    registerUser,
    {}
  );

  useEffect(() => {
    if (!state.success || !creds.current) return;
    const { email, password } = creds.current;

    setPendingLogin(true);
    signIn("credentials", { email, password, redirect: false }).then((res) => {
      if (res?.error) {
        toast.error("Conta criada, mas o login falhou. Faça login manualmente.");
        router.push("/login");
      } else {
        router.push("/app/onboarding");
      }
    });
  }, [state, router]);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Criar conta</h1>
        <p className="text-sm text-muted-foreground">
          Comece a montar seu portfólio de criador agora.
        </p>
      </div>

      <form
        action={(fd) => {
          // Stash credentials so the effect can auto-login on success.
          creds.current = {
            email: String(fd.get("email") ?? ""),
            password: String(fd.get("password") ?? ""),
          };
          formAction(fd);
        }}
        className="space-y-4"
      >
        <div className="space-y-2">
          <Label htmlFor="name">Nome</Label>
          <Input id="name" name="name" placeholder="Seu nome" autoComplete="name" />
          {state.fieldErrors?.name && (
            <p className="text-xs text-destructive">{state.fieldErrors.name}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">E-mail</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="voce@email.com"
            autoComplete="email"
          />
          {state.fieldErrors?.email && (
            <p className="text-xs text-destructive">{state.fieldErrors.email}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Senha</Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="Mínimo 6 caracteres"
            autoComplete="new-password"
          />
          {state.fieldErrors?.password && (
            <p className="text-xs text-destructive">
              {state.fieldErrors.password}
            </p>
          )}
        </div>

        {state.error && (
          <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {state.error}
          </p>
        )}

        <Button
          type="submit"
          className="w-full"
          disabled={pending || pendingLogin}
        >
          {pending || pendingLogin ? "Criando..." : "Criar minha conta"}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Já tem conta?{" "}
        <a href="/login" className="font-medium text-primary hover:underline">
          Entrar
        </a>
      </p>
    </div>
  );
}

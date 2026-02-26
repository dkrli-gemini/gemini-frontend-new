"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

type RegisterResponse = {
  data?: {
    id: string;
    name: string;
    email: string;
    username: string;
    keycloakCreated: boolean;
  };
  message?: string;
};

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (!name || !email || !password) {
      setError("Preencha nome, email e senha.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/public/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          username: username || undefined,
          password,
        }),
      });

      const payload: RegisterResponse = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(payload?.message ?? "Não foi possível concluir o cadastro.");
        setLoading(false);
        return;
      }

      setSuccess(
        `Cadastro concluído para ${payload?.data?.email ?? email}. Aguarde vínculo com sua organização.`
      );
      setName("");
      setEmail("");
      setUsername("");
      setPassword("");
    } catch (err) {
      setError("Erro inesperado ao cadastrar usuário.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-xl rounded-lg bg-white p-8 shadow-lg">
        <h1 className="text-2xl font-bold">Cadastro</h1>
        <p className="mt-2 text-sm text-gray-600">
          Crie sua conta. Depois um administrador vinculará você à organização.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
          <label className="text-sm font-medium text-gray-700">
            Nome
            <input
              className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Seu nome"
            />
          </label>

          <label className="text-sm font-medium text-gray-700">
            Email
            <input
              className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
            />
          </label>

          <label className="text-sm font-medium text-gray-700">
            Username (opcional)
            <input
              className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="seu.usuario"
            />
          </label>

          <label className="text-sm font-medium text-gray-700">
            Senha
            <input
              className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo 6 caracteres"
            />
          </label>

          <div className="mt-2 flex items-center gap-3">
            <button
              type="submit"
              disabled={loading}
              className="rounded bg-[#0f3759] px-4 py-2 font-semibold text-white"
            >
              {loading ? "Cadastrando..." : "Criar conta"}
            </button>
            <Link href="/auth/signin" className="text-sm text-blue-700 underline">
              Voltar para login
            </Link>
          </div>
        </form>

        {error && (
          <div className="mt-4 rounded bg-red-100 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mt-4 rounded bg-green-100 px-3 py-2 text-sm text-green-700">
            {success}
          </div>
        )}
      </div>
    </div>
  );
}

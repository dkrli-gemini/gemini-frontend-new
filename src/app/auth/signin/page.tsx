"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";

export default function SignInPage() {
  return (
    <div
      className="flex items-center justify-center min-h-screen bg-gray-100"
      style={{
        backgroundSize: "cover",
        backgroundPosition: "left",
      }}
    >
      <div className="px-8 py-6 mt-4 text-left bg-white shadow-lg rounded-lg flex flex-col items-center gap-6">
        <h3 className="text-2xl font-bold text-center">Sign in to your account</h3>

        <button
          type="button"
          className="bg-[#0f3759] text-white rounded-md px-4 py-2 text-sm font-semibold"
          onClick={() => signIn("keycloak", { callbackUrl: "/home" })}
        >
          Entrar com Keycloak
        </button>

        <p className="text-sm text-gray-600">
          Novo por aqui?{" "}
          <Link href="/register" className="text-blue-700 underline">
            Crie sua conta
          </Link>
        </p>
      </div>
    </div>
  );
}

"use client";

import { signIn } from "next-auth/react";

interface Provider {
  id: string;
  name: string;
}

export default function SignInButton({ provider }: { provider: Provider }) {
  return (
    <button
      onClick={() => signIn(provider.id, { callbackUrl: "/home" })}
      className="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded-full hover:bg-blue-700 focus:outline-none focus:shadow-outline"
    >
      Sign in with {provider.name}
    </button>
  );
}

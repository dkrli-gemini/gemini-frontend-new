"use client";

import { signIn } from "next-auth/react";
import { Button } from "./Button";

interface Provider {
  id: string;
  name: string;
}

export default function SignInButton({ provider }: { provider: Provider }) {
  return (
    <Button
      variant="primary"
      onClick={() => signIn(provider.id, { callbackUrl: "/home" })}
    >
      Sign in with {provider.name}
    </Button>
  );
}

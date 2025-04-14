"use client";

import { signIn, useSession } from "next-auth/react";
import Image from "next/image";

export default function Home() {
  const { data: session } = useSession();

  if (session) {
    return (
      <>
        Signed in as {session?.user?.email} <br />
      </>
    );
  }

  return (
    <>
      Not signed in <br />
      <button onClick={() => signIn("keycloak")}>SignIn With Keycloak</button>
    </>
  );
}

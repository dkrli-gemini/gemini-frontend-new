"use client";

import { useSession } from "next-auth/react";

export default function MachinePage() {
  const session = useSession();

  // return <div>{session.data?.access_token}</div>;
}

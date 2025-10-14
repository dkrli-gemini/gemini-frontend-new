import { ChevronDown } from "lucide-react";
import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

export function Header() {
  return (
    <header className="flex justify-between items-center p-3 border-b bg-white border-b h-12">
      <div></div>
    </header>
  );
}

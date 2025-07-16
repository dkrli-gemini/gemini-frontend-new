import { ChevronDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function Header() {
  return (
    <header className="flex justify-between items-center p-4 border-b bg-white">
      <div className="flex items-center gap-2">
        <Link href="/api/auth/signin">
          <h2 className="text-xl font-semibold text-gray-800">Root</h2>
        </Link>
        <ChevronDown size={20} className="text-gray-500" />
      </div>
      <div></div>
    </header>
  );
}

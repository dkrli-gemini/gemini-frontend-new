import { ChevronDown } from "lucide-react";
import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

export function Header() {
  return (
    <header className="flex justify-between items-center p-3 border-b bg-white border-b">
      <div
        className="flex items-center gap-2 bg-[#F2F2F2] p-1 px-5 rounded-full"
        onClick={() => signOut()}
      >
        <h2 className="text-xl text-gray-800 ">Projeto Niblo</h2>
        <ChevronDown size={20} className="text-gray-500" />
      </div>
      <div></div>
    </header>
  );
}

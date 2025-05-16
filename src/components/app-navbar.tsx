import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";

interface NavbarProps {}

const Navbar: React.FC<NavbarProps> = ({}) => {
  return (
    <div className="shadow bg-[#FAFAFA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link href="/home" className="font-bold text-xl">
              Niblo Cloud
            </Link>
          </div>

          <div className="md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link
                href="/about"
                className={cn(
                  "text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 dark:text-gray-300 px-3 py-2 rounded-md text-sm font-medium",
                  "focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                )}
              ></Link>
              <Link
                href="/services"
                className={cn(
                  "text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 dark:text-gray-300 px-3 py-2 rounded-md text-sm font-medium",
                  "focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                )}
              >
                Configurações
              </Link>
              <Link
                onClick={() => {signOut()}}
                href=""
                className={cn(
                  "text-red-600 hover:bg-gray-50 dark:hover:bg-gray-800 dark:text-gray-300 px-3 py-2 rounded-md text-sm font-medium",
                  "focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                )}
              >
                Sair
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;

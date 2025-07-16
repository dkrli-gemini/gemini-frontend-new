import { Plus } from "lucide-react";

export const Button = ({ children }: any, props: any) => {
  return (
    <button className="bg-primary border-primary border rounded-[12] inline-flex items-center justify-center py-3 px-7 text-center text-base font-medium text-white hover:bg-brand-800 disabled:bg-gray-3 disabled:border-gray-3 disabled:text-dark-5 h-fit">
      {children}
    </button>
  );
};

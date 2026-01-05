import { cn } from "@/lib/utils";

export interface PageHeaderProps {
  title: string;
  height?: string;
}

export const PageHeader0 = (props: PageHeaderProps) => {
  return (
    <>
      <div
        className={cn(
          "p-10 px-22  bg-gradient-to-r from-[#EC9C1B] via-[#E2C31C] to-[#3AA3F5] text-white shadow-lg  h-55",
          props.height
        )}
      >
        <h1 className="text-4xl font-bold mb-4">{props.title}</h1>
      </div>
    </>
  );
};

import { useAclStore } from "@/stores/acl.store";

export interface PageHeader2Props {
  title: string;
  el1name: string;
  el1value: string;
  el2name: string;
  el2value: string;
}

export const PageHeader2 = (props: PageHeader2Props) => {
  return (
    <>
      <div className="p-10 px-22  bg-gradient-to-r from-[#EC9C1B] via-[#E2C31C] to-[#3AA3F5] text-white shadow-lg  h-55">
        <h1 className="text-4xl font-bold mb-4">{props.title}</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2   self-center px-6 -translate-y-16 bg-white w-91/100   py-6 rounded-xl shadow-sm ">
        <div className="flex justify-center items-center flex-col border-r">
          <span className="text-4xl font-bold text-[#4297D3] mb-2">
            {props.el1value}
          </span>
          <span className="text-[#737373]">{props.el1name}</span>
        </div>
        <div className="flex justify-center items-center flex-col ">
          <span className="text-4xl font-bold text-[#4297D3] mb-2">
            {props.el2value}
          </span>
          <span className="text-[#737373]">{props.el2name}</span>
        </div>
      </div>
    </>
  );
};

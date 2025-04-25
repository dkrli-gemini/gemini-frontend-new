import { Settings, TrashIcon, Wifi } from "lucide-react";
import { Button } from "./ui/button";

export interface NetworkPopupProps {
  name: string;
  gateway: string;
  netmask: string;
  id: string;
}

export default function NetworkPopup(props: NetworkPopupProps) {
  return (
    <div className="border rounded-md grid-span-2 p-2 text-sm bg-white">
      <div className="flex gap-2 justify-center items-center">
        <Wifi />
        {props.name}
      </div>
      <div className="flex justify-center flex-col items-center mt-5 gap-2">
        <div className="text-center border rounded-md px-4 py-0.8 bg-white">
          Gateway <br />
          {props.gateway}
        </div>
        <div className="text-center border rounded-md px-4 py-0.8 bg-white">
          Netmask <br />
          {props.netmask}
        </div>
      </div>
      <div className="flex gap-1 mt-8 ">
        <Button className="flex-3" variant="outline">
          Ativo
        </Button>
        <Button className="flex-1">
          <Settings />
        </Button>
        <Button className="flex-1">
          <TrashIcon />
        </Button>
      </div>
    </div>
  );
}

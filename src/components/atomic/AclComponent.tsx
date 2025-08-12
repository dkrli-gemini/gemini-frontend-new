"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { Button } from "./Button";
import { SearchInput } from "./SearchInput";

export default function AclComponent() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        id="heading"
        aria-controls="body"
        className="border rounded-lg grid grid-cols-3 p-14 cursor-pointer hover:bg-gray-100"
      >
        <div className="col-span-1 flex items-center">
          <h2 className="text-2xl font-semibold">ACL ABC</h2>
        </div>
        <div className="col-span-2 flex justify-between items-center">
          <div className="pr-28">
            <p>
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Animi
              ut, harum officiis nulla praesentium delectus dolorum eum
              laudantium et beatae deserunt, at tempora cum ad minima non
              repellendus nisi corporis.
            </p>
          </div>
          <div
            className={`${
              isOpen ? "rotate-180" : ""
            } transition-transform duration-300`}
          >
            <ChevronDown size={32} />
          </div>
        </div>
      </button>
      <div
        className={`${
          isOpen ? "block" : "hidden"
        } border-l border-r border-b rounded-b-lg -translate-y-2 pt-2`}
        id="body"
        aria-labelledby="heading"
      >
        <div className="flex justify-between px-8 p-4">
          <SearchInput />
          <Button variant="primary">asd</Button>
        </div>
      </div>
    </div>
  );
}

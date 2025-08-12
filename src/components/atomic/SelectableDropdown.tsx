"use client";

import * as React from "react";
import { ChevronsUpDown } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/atomic/Button";

interface Item {
  id: string;
  name: string;
}

interface SelectableDropdownProps {
  items: Item[];
  onSelect: (id: string) => void;
  placeholder?: string;
}

export function SelectableDropdown({
  items,
  onSelect,
  placeholder = "Select an option",
}: SelectableDropdownProps) {
  const [selectedItem, setSelectedItem] = React.useState<Item | null>(null);
  const [isOpen, setIsOpen] = React.useState(false);

  const handleSelect = (item: Item) => {
    setSelectedItem(item);
    onSelect(item.id);
    setIsOpen(false);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outlined"
          className="w-full justify-between text-normal-md font-normal placeholder-[#999999] text-[#999999] bg-[#F2F2F2]"
        >
          {selectedItem ? selectedItem.name : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom">
        {items.map((item) => (
          <DropdownMenuItem
            key={item.id}
            onClick={() => {
              handleSelect(item);
            }}
          >
            {item.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

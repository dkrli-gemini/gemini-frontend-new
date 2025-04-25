"use client";

import { useState } from "react";
import SelectableNetworkPopup from "./selectable-network-popup";

export interface ListItemData {
  id: string;
  name: string;
  gateway: string;
  netmask: string;
}

export interface SelectableHorizontalListProps {
  items: ListItemData[];
  onSelectChange?: (selectedItemId: string | null) => void;
}

export function SelectableHorizontalList({
  items,
  onSelectChange,
}: SelectableHorizontalListProps) {
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  const handleItemClick = (id: string) => {
    setSelectedItemId(id);
    onSelectChange?.(id);
  };

  return (
    <div className="w-full">
      {" "}
      {/* Container to give the list a width */}
      <div className="flex overflow-x-auto space-x-4 p-2">
        {items.map((item) => (
          <SelectableNetworkPopup
            key={item.id}
            item={item}
            isSelected={item.id === selectedItemId}
            onClickAction={handleItemClick}
          />
        ))}
      </div>
    </div>
  );
}

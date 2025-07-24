"use client";
import { useState } from "react";
import * as React from "react";

export interface DataTableRow {
  id: string;
  data: React.ReactNode[];
}

interface SelectableDataTableProps {
  headers: string[];
  rows: DataTableRow[];
  onRowSelected: (row: DataTableRow) => void;
  name: string;
}

export default function SelectableDataTable({
  headers,
  rows,
  onRowSelected,
  name,
}: SelectableDataTableProps) {
  const [selectedRow, setSelectedRow] = useState<string | null>(null);

  const handleRowClick = (row: DataTableRow) => {
    setSelectedRow(row.id);
    onRowSelected(row);
  };

  return (
    <div className="mt-2 overflow-hidden rounded-lg border border-tools-table-outline">
      <table className="w-full text-left">
        <thead className="bg-[#FAFAFA]">
          <tr>
            <th className="p-4 font-medium w-0"></th>
            {headers.map((header) => (
              <th key={header} className="p-4 font-medium">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-t border-tools-table-outline">
              <td className="flex items-center pl-4 py-4 mr-5">
                <input
                  type="radio"
                  name={name}
                  checked={selectedRow === row.id}
                  onChange={() => handleRowClick(row)}
                  className="h-6 w-6 accent-[#0F3759]"
                />
              </td>
              {row.data.map((cell, cellIndex) => (
                <td key={cellIndex} className="px-4 py-3">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

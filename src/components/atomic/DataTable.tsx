import * as React from "react";

export interface DataTableRow {
  id: string;
  data: React.ReactNode[];
}

interface DataTableProps {
  headers: string[];
  rows: DataTableRow[];
}

export default function DataTable({ headers, rows }: DataTableProps) {
  return (
    <div className="mt-2 overflow-hidden rounded-lg border border-tools-table-outline">
      <table className="w-full text-left">
        <thead className="bg-[#FAFAFA]">
          <tr>
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
              {row.data.map((cell, cellIndex) => (
                <td key={cellIndex} className="px-4 py-4">
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

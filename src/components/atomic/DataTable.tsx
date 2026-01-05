import * as React from "react";

export interface DataTableRow {
  id: string;
  data: React.ReactNode[];
}

type Alignment = "left" | "center" | "right";

interface DataTableProps {
  headers: string[];
  rows: DataTableRow[];
  columnAlignments?: Alignment[];
}

const alignmentClasses: Record<Alignment, string> = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

export default function DataTable({ headers, rows, columnAlignments }: DataTableProps) {
  return (
    <div className="mt-2 overflow-hidden rounded-lg border border-tools-table-outline">
      <table className="w-full text-left">
        <thead className="bg-[#FAFAFA]">
          <tr>
            {headers.map((header, index) => (
              <th
                key={header}
                className={`p-4 font-medium ${alignmentClasses[columnAlignments?.[index] ?? "left"]}`}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-t border-tools-table-outline">
              {row.data.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  className={`px-4 py-4 ${alignmentClasses[columnAlignments?.[cellIndex] ?? "left"]}`}
                >
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

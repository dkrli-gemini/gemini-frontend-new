interface DataTableProps {
  headers: string[];
  rows: string[][];
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
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex} className="border-t border-tools-table-outline">
              {row.map((cell, cellIndex) => (
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

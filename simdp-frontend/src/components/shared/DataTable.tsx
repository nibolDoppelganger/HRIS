import React from 'react';

export interface ColumnDef<T> {
  header: string;
  accessorKey?: keyof T;
  cell?: (item: T) => React.ReactNode;
  width?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  keyExtractor: (item: T) => string;
  onRowClick?: (item: T) => void;
  isLoading?: boolean;
}

export function DataTable<T>({ data, columns, keyExtractor, onRowClick, isLoading = false }: DataTableProps<T>) {
  return (
    <div className="w-full bg-white rounded-lg border border-neutral-200 overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-neutral-50 border-b-2 border-neutral-200">
              {columns.map((col, i) => (
                <th 
                  key={i} 
                  className="px-4 py-2.5 font-display text-[11px] font-semibold text-neutral-600 uppercase tracking-wider"
                  style={{ width: col.width }}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {isLoading ? (
              // Skeleton loading state
              Array.from({ length: 5 }).map((_, idx) => (
                <tr key={idx} className="h-12">
                  {columns.map((col, colIdx) => (
                    <td key={colIdx} className="px-4 py-3">
                      <div className="h-4 bg-neutral-100 rounded shimmer w-3/4"></div>
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-12 text-center text-neutral-500 font-body text-sm">
                  Tidak ada data yang ditemukan.
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr 
                  key={keyExtractor(item)}
                  onClick={() => onRowClick?.(item)}
                  className={`h-[52px] bg-white hover:bg-brand-blue-light transition-colors ${onRowClick ? 'cursor-pointer' : ''}`}
                >
                  {columns.map((col, colIdx) => (
                    <td key={colIdx} className="px-4 py-2 font-body text-[13px] text-neutral-800">
                      {col.cell ? col.cell(item) : (item as any)[col.accessorKey as string]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* Simple Pagination Footer for UI mockup */}
      <div className="bg-white border-t border-neutral-200 px-4 py-3 flex items-center justify-between">
        <div className="font-body text-xs text-neutral-600">
          Menampilkan <span className="font-medium text-neutral-950">{data.length}</span> baris
        </div>
        <div className="flex items-center gap-1">
          <button className="px-2 py-1 text-xs font-medium text-neutral-400 bg-neutral-50 border border-neutral-200 rounded cursor-not-allowed">
            Sebelumnya
          </button>
          <button className="px-2 py-1 text-xs font-medium text-neutral-600 hover:bg-neutral-50 border border-neutral-200 rounded transition-colors">
            Selanjutnya
          </button>
        </div>
      </div>
    </div>
  );
}

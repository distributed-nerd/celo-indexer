// src/components/indexer/DataTable.tsx
import React from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
  ColumnDef,
  SortingState,
} from '@tanstack/react-table';
import { ChevronLeft, ChevronRight, ArrowUp, ArrowDown, ListFilter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DataTableProps<T extends object> {
  data: T[];
  columns: ColumnDef<T>[];
  pagination?: boolean;
  className?: string;
  isLoading?: boolean;
}

export function DataTable<T extends object>({ 
  data, 
  columns, 
  pagination = true,
  className = '',
  isLoading = false
}: DataTableProps<T>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: pagination ? getPaginationRowModel() : undefined,
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className={`w-full overflow-hidden rounded-3xl glass shadow-2xl border border-white/10 ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full border-separate border-spacing-0">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="bg-slate-50/50 dark:bg-slate-800/50 backdrop-blur-md sticky top-0 z-10 border-b border-gray-200 dark:border-white/5 px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest"
                    style={{ width: header.getSize() }}
                  >
                    {header.isPlaceholder ? null : (
                      <div
                        className={`flex items-center space-x-2 group ${header.column.getCanSort() ? 'cursor-pointer select-none' : ''}`}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        <span className="transition-colors group-hover:text-base-blue-500">
                          {flexRender(header.column.columnDef.header, header.getContext())}
                        </span>
                        {header.column.getCanSort() && (
                          <span className="transition-transform duration-300 transform group-hover:scale-110">
                            {{
                              asc: <ArrowUp size={14} className="text-base-blue-500" />,
                              desc: <ArrowDown size={14} className="text-base-blue-500" />,
                            }[header.column.getIsSorted() as string] ?? (
                              <ListFilter size={14} className="opacity-0 group-hover:opacity-40" />
                            )}
                          </span>
                        )}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="relative">
            <AnimatePresence mode="wait">
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row, idx) => (
                  <motion.tr 
                    key={row.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2, delay: idx * 0.03 }}
                    className="hover:bg-base-blue-500/5 dark:hover:bg-base-blue-500/10 transition-colors group"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className="px-6 py-4 text-sm text-gray-800 dark:text-gray-300 border-b border-gray-100 dark:border-white/5"
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </motion.tr>
                ))
              ) : (
                <tr className="bg-white/50 dark:bg-slate-900/50">
                  <td
                    colSpan={columns.length}
                    className="px-6 py-20 text-center text-sm text-gray-500 dark:text-gray-400"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <div className="h-12 w-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                        <ListFilter size={24} className="text-gray-400" />
                      </div>
                      <p className="font-semibold">No transactions found</p>
                      <p className="text-xs text-gray-400">Try adjusting your filters or search query</p>
                    </div>
                  </td>
                </tr>
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {pagination && table.getPageCount() > 1 && (
        <div className="flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50 backdrop-blur-md px-6 py-4 border-t border-gray-200 dark:border-white/5">
          <div className="flex flex-1 justify-between sm:hidden">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="relative inline-flex items-center rounded-2xl glass px-4 py-2 text-sm font-bold text-gray-700 dark:text-gray-200 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              Previous
            </button>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="relative ml-3 inline-flex items-center rounded-2xl glass px-4 py-2 text-sm font-bold text-gray-700 dark:text-gray-200 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Showing{' '}
                <span className="text-gray-900 dark:text-white font-bold">
                  {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}
                </span>{' '}
                to{' '}
                <span className="text-gray-900 dark:text-white font-bold">
                  {Math.min(
                    (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                    table.getPrePaginationRowModel().rows.length
                  )}
                </span>{' '}
                of <span className="text-gray-900 dark:text-white font-bold">{table.getPrePaginationRowModel().rows.length}</span>{' '}
                results
              </p>
            </div>
            <div>
              <nav className="flex items-center gap-2" aria-label="Pagination">
                <button
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                  className="p-2 rounded-xl glass hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <div className="px-4 py-2 rounded-xl glass text-sm font-bold">
                  {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}
                </div>
                <button
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                  className="p-2 rounded-xl glass hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DataTable;
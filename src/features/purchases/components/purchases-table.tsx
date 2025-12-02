import { useEffect, useMemo, useState } from 'react'
import {
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { DatePicker } from '@/components/date-picker'
import { cn } from '@/lib/utils'
import { type NavigateFn, useTableUrlState } from '@/hooks/use-table-url-state'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { DataTablePagination } from '@/components/data-table'
import { type Purchase } from '../data/schema'
import { purchasesColumns as columns } from './purchases-columns'

type DataTableProps = {
  data: Purchase[]
  search: Record<string, unknown>
  navigate: NavigateFn
}

export function PurchasesTable({ data, search, navigate }: DataTableProps) {
  // Local UI-only states
  const [rowSelection, setRowSelection] = useState({})
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [sorting, setSorting] = useState<SortingState>([])

  // Local state management for table (uncomment to use local-only state, not synced with URL)
  // const [columnFilters, onColumnFiltersChange] = useState<ColumnFiltersState>([])
  // const [pagination, onPaginationChange] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 })

  // Synced with URL states (keys/defaults mirror users route search schema)
  const {
    columnFilters,
    onColumnFiltersChange,
    pagination,
    onPaginationChange,
    ensurePageInRange,
  } = useTableUrlState({
    search,
    navigate,
    pagination: { defaultPage: 1, defaultPageSize: 10 },
    globalFilter: { enabled: false },
    columnFilters: [
      { columnId: 'metodoPago', searchKey: 'metodoPago', type: 'string' },
    ],
  })

  // Date range filter (based on fechaCreacion)
  const rawDateFrom = (search as Record<string, unknown>)['dateFrom'] as string | undefined
  const rawDateTo = (search as Record<string, unknown>)['dateTo'] as string | undefined
  
  // Filter data by fechaCreacion using the date range (if provided)
  const filteredData = useMemo(() => {
    return data.filter((row) => {
      const fecha = row.fechaCreacion ? new Date(row.fechaCreacion) : null
      if (!fecha) return false
      if (rawDateFrom && fecha < new Date(rawDateFrom)) return false
      if (rawDateTo && fecha > new Date(rawDateTo)) return false
      return true
    })
  }, [data, rawDateFrom, rawDateTo])
  
  const dateFrom = rawDateFrom ? new Date(rawDateFrom) : undefined
  const dateTo = rawDateTo ? new Date(rawDateTo) : undefined

  const handleDateFromChange = (d: Date | undefined) => {
    const iso = d ? new Date(new Date(d).setHours(0, 0, 0, 0)).toISOString() : undefined
    navigate({
      search: (prev) => ({ ...(prev as Record<string, unknown>), page: undefined, dateFrom: iso }),
    })
  }

  const handleDateToChange = (d: Date | undefined) => {
    const iso = d ? new Date(new Date(d).setHours(23, 59, 59, 999)).toISOString() : undefined
    navigate({
      search: (prev) => ({ ...(prev as Record<string, unknown>), page: undefined, dateTo: iso }),
    })
  }

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      sorting,
      pagination,
      rowSelection,
      columnFilters,
      columnVisibility,
    },
    enableRowSelection: true,
    onPaginationChange,
    onColumnFiltersChange,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    getPaginationRowModel: getPaginationRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  useEffect(() => {
    ensurePageInRange(table.getPageCount())
  }, [table.getPageCount(), ensurePageInRange])

  return (
    <div
      className={cn(
        'max-sm:has-[div[role="toolbar"]]:mb-16', // Add margin bottom to the table on mobile when the toolbar is visible
        'flex flex-1 flex-col gap-4'
      )}
    >
      <div className='flex flex-wrap items-center gap-2'>
        <div className='flex items-center gap-2'>
          <DatePicker
            selected={dateFrom}
            onSelect={handleDateFromChange}
            placeholder='Fecha desde'
          />
          <DatePicker
            selected={dateTo ? new Date(new Date(dateTo).setHours(0, 0, 0, 0)) : undefined}
            onSelect={(d) => handleDateToChange(d)}
            placeholder='Fecha hasta'
          />
        </div>
      </div>
      <div className='overflow-hidden rounded-md border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className='group/row'>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      colSpan={header.colSpan}
                      className={cn(
                        'bg-background group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted',
                        header.column.columnDef.meta?.className,
                        header.column.columnDef.meta?.thClassName
                      )}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className='group/row'
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={cn(
                        'bg-background group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted',
                        cell.column.columnDef.meta?.className,
                        cell.column.columnDef.meta?.tdClassName
                      )}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='h-24 text-center'
                >
                  No hay datos para mostrar.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} className='mt-auto' />
    </div>
  )
}

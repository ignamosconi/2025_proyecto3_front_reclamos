import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { Purchases } from '@/features/purchases'

const purchasesSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10),
  // Per-column text filter
  metodoPago: z.string().optional().catch(''),
  // Date range filters
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
})

export const Route = createFileRoute('/_authenticated/purchases/')({
  validateSearch: purchasesSearchSchema,
  beforeLoad: () => {},
  component: Purchases,
})

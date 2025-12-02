import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { ResetPassword } from '@/features/auth/reset-password'

// Schema de validación para los query params
const resetPasswordSearchSchema = z.object({
  token: z.string().optional(),
})

export const Route = createFileRoute('/(auth)/reset-password')({
  component: RouteComponent,
  validateSearch: resetPasswordSearchSchema,
})

function RouteComponent() {
  const { token } = Route.useSearch()
  return <ResetPassword token={token} />
}

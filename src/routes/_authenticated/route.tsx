import { createFileRoute, redirect } from '@tanstack/react-router'
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout'
import { useAuthStore } from '@/stores/auth-store'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async ({ location }) => {
    // Get auth state
    const { auth } = useAuthStore.getState()
    
    // Check if user is authenticated
    const isAuthenticated = auth.isAuthenticated()
    
    if (!isAuthenticated) {
      // Redirect to login with the current path as redirect parameter
      throw redirect({
        to: '/sign-in',
        search: {
          redirect: location.pathname,
        },
      })
    }
  },
  component: AuthenticatedLayout,
})

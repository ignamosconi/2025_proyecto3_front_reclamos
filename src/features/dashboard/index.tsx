import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ThemeSwitch } from '@/components/theme-switch'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuthStore } from '@/stores/auth-store'
import { ClienteDashboard } from './cliente-dashboard'
import { EncargadoDashboard } from './encargado-dashboard'

export function Dashboard() {
  const { auth } = useAuthStore()
  const isClient = auth.hasRole('Cliente')
  const isEncargado = auth.hasRole('Encargado')

  const getTitle = () => {
    if (isClient) return 'Dashboard de Reclamos'
    if (isEncargado) return 'Dashboard de Encargado'
    return 'Dashboard'
  }

  const getDescription = () => {
    if (isClient) return 'Visualiza y analiza el estado de tus reclamos y proyectos'
    if (isEncargado) return 'Monitorea tu desempeño y métricas de los reclamos que has resuelto'
    return 'Panel de control general del sistema'
  }

  const renderDashboard = () => {
    if (isClient) {
      return <ClienteDashboard />
    }

    if (isEncargado) {
      return <EncargadoDashboard />
    }

    return (
      <Card className='border-dashed'>
        <CardHeader>
          <CardTitle>Bienvenido</CardTitle>
          <CardDescription>
            No tienes acceso al dashboard. Por favor, contacta al administrador.
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <>
      {/* ===== Top Heading ===== */}
      <Header>
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
        </div>
      </Header>

      {/* ===== Main ===== */}
      <Main>
        <div className='mb-6 flex flex-col gap-2'>
          <h1 className='text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent'>
            {getTitle()}
          </h1>
          <p className='text-muted-foreground text-sm'>
            {getDescription()}
          </p>
        </div>

        {renderDashboard()}
      </Main>
    </>
  )
}

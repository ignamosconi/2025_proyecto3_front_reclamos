import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ThemeSwitch } from '@/components/theme-switch'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuthStore } from '@/stores/auth-store'
import { ClienteDashboard } from './cliente-dashboard'
import { EncargadoDashboard } from './encargado-dashboard'
import { GerenteDashboard } from './gerente-dashboard'

export function Dashboard() {
  const { auth } = useAuthStore()
  const isClient = auth.hasRole('Cliente')
  const isEncargado = auth.hasRole('Encargado')
  const isGerente = auth.hasRole('Gerente')

  const getTitle = () => {
    if (isClient) return 'Dashboard de Reclamos'
    if (isEncargado) return 'Dashboard de Encargado'
    if (isGerente) return 'Dashboard de Gerente'
    return 'Dashboard'
  }

  const getDescription = () => {
    if (isClient) return 'Visualiza y analiza el estado de tus reclamos y proyectos'
    if (isEncargado) return 'Monitorea tu desempeño y métricas de los reclamos que has resuelto'
    if (isGerente) return 'Métricas estratégicas globales para supervisar el rendimiento y eficiencia del área'
    return 'Panel de control general del sistema'
  }

  const renderDashboard = () => {
    if (isClient) {
      return <ClienteDashboard />
    }

    if (isEncargado) {
      return <EncargadoDashboard />
    }

    if (isGerente) {
      return <GerenteDashboard />
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

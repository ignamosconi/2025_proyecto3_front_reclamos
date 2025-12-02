import { Link } from '@tanstack/react-router'
import { AlertCircle } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AuthLayout } from '../auth-layout'
import { ResetPasswordForm } from './components/reset-password-form'

interface ResetPasswordProps {
  token?: string
}

export function ResetPassword({ token }: ResetPasswordProps = {}) {
  // El token vendrá como prop desde el route

  // Si no hay token, mostrar mensaje de error
  if (!token) {
    return (
      <AuthLayout>
        <Card className='gap-4'>
          <CardHeader>
            <CardTitle className='text-lg tracking-tight'>
              Enlace inválido
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                El enlace de restablecimiento de contraseña no es válido o ha expirado.
                Por favor, solicita un nuevo enlace.
              </AlertDescription>
            </Alert>
          </CardContent>
          <CardFooter>
            <p className='text-muted-foreground mx-auto px-8 text-center text-sm text-balance'>
              <Link
                to='/forgot-password'
                className='hover:text-primary underline underline-offset-4'
              >
                Solicitar nuevo enlace
              </Link>
            </p>
          </CardFooter>
        </Card>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout>
      <Card className='gap-4'>
        <CardHeader>
          <CardTitle className='text-lg tracking-tight'>
            Restablecer contraseña
          </CardTitle>
          <CardDescription>
            Ingresa tu nueva contraseña. Asegúrate de cumplir con todos los requisitos de seguridad.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResetPasswordForm token={token} />
        </CardContent>
        <CardFooter>
          <p className='text-muted-foreground mx-auto px-8 text-center text-sm text-balance'>
            ¿Recordaste tu contraseña?{' '}
            <Link
              to='/sign-in'
              className='hover:text-primary underline underline-offset-4'
            >
              Iniciar sesión
            </Link>
            .
          </p>
        </CardFooter>
      </Card>
    </AuthLayout>
  )
}

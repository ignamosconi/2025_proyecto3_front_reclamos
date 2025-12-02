import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from '@tanstack/react-router'
import { Loader2, LogIn } from 'lucide-react'
import { toast } from 'sonner'
import { useAuthStore } from '@/stores/auth-store'
import { cn } from '@/lib/utils'
import { authService } from '@/services/auth/auth.service'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/password-input'

const formSchema = z.object({
  email: z
    .string()
    .min(1, 'Por favor ingresa tu correo electrónico')
    .email('Por favor ingresa un correo electrónico válido'),
  password: z
    .string()
    .min(1, 'Por favor ingresa tu contraseña')
    .min(7, 'La contraseña debe tener al menos 8 caracteres'),
})

interface UserAuthFormProps extends React.HTMLAttributes<HTMLFormElement> {
  redirectTo?: string
}

export function UserAuthForm({
  className,
  redirectTo,
  ...props
}: UserAuthFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { auth } = useAuthStore()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true)

    try {
      const loginPromise = await authService.login({
        email: data.email,
        password: data.password,
      });

      if (!loginPromise || !loginPromise.accessToken) {
        toast.error('Respuesta inválida del servidor')
        return;
      }

      // The auth service already saves tokens to cookies
      // We just need to update the store with the tokens
      auth.setTokens(loginPromise.accessToken, loginPromise.refreshToken);

      // Si tenemos datos del usuario, los guardamos en el store
      if (loginPromise.user) {
        auth.setUser(loginPromise.user);
      }

      toast.success('Inicio de sesión exitoso')

      // Redirigimos al usuario
      const targetPath = redirectTo || '/';
      navigate({ to: targetPath, replace: true });
      
    } catch (error: any) {
      console.error('Error en inicio de sesión:', error);
      
      // Traducir mensajes de error comunes del backend
      let errorMessage = 'Error al iniciar sesión. Por favor, intenta nuevamente.';
      
      if (error.response?.data?.message) {
        const backendMessage = error.response.data.message;
        
        // Traducir mensajes específicos
        if (backendMessage.includes('Invalid credentials') || 
            backendMessage.includes('Credenciales inválidas') ||
            backendMessage.includes('incorrect')) {
          errorMessage = 'Correo electrónico o contraseña incorrectos';
        } else if (backendMessage.includes('not found') || 
                   backendMessage.includes('no encontrado')) {
          errorMessage = 'Usuario no encontrado';
        } else if (backendMessage.includes('Unauthorized') || 
                   backendMessage.includes('No autorizado')) {
          errorMessage = 'Credenciales inválidas';
        } else {
          // Usar el mensaje del backend si está en español
          errorMessage = backendMessage;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn('grid gap-3', className)}
        {...props}
      >
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder='correo@gmail.com' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem className='relative'>
              <FormLabel>Contraseña</FormLabel>
              <FormControl>
                <PasswordInput placeholder='********' {...field} />
              </FormControl>
              <FormMessage />
              <Link
                to='/forgot-password'
                className='text-muted-foreground absolute end-0 -top-0.5 text-sm font-medium hover:opacity-75'
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </FormItem>
          )}
        />
        <Button className='mt-2' disabled={isLoading}>
          {isLoading ? <Loader2 className='animate-spin' /> : <LogIn />}
          Iniciar sesión
        </Button>
      </form>
    </Form>
  )
}

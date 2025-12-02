import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { ArrowRight, Loader2, Info } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { validatePassword, formatPasswordErrors } from '@/lib/validate-password'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { PasswordInput } from '@/components/password-input'
import { authService } from '@/services/auth/auth.service'

const formSchema = z
  .object({
    password: z
      .string()
      .min(1, 'Por favor ingresa tu nueva contraseña')
      .superRefine((password, ctx) => {
        // Validar la contraseña con todas las reglas
        const errors = validatePassword(password);
        
        if (errors.length > 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: formatPasswordErrors(errors),
          });
        }
      }),
    confirmPassword: z.string().min(1, 'Por favor confirma tu contraseña'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden.',
    path: ['confirmPassword'],
  })

export function ResetPasswordForm({
  className,
  token,
  ...props
}: React.HTMLAttributes<HTMLFormElement> & { token: string }) {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { 
      password: '', 
      confirmPassword: '' 
    },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true)

    try {
      await authService.resetPassword(token, data.password);

      toast.success('Contraseña restablecida exitosamente', {
        description: 'Ahora puedes iniciar sesión con tu nueva contraseña.',
      });

      // Redirigir al login después de un breve delay
      setTimeout(() => {
        navigate({ to: '/sign-in' });
      }, 1500);
    } catch (error: any) {
      console.error('Error al restablecer contraseña:', error);
      
      // Manejar diferentes tipos de errores
      const errorMessage = error?.response?.data?.message || 'Error al restablecer la contraseña';
      
      if (errorMessage.includes('expirado') || errorMessage.includes('expired')) {
        toast.error('El enlace ha expirado', {
          description: 'El enlace de restablecimiento ha expirado (1 hora). Por favor, solicita uno nuevo.',
        });
      } else if (errorMessage.includes('inválido') || errorMessage.includes('invalid')) {
        toast.error('Enlace inválido', {
          description: 'El enlace de restablecimiento no es válido.',
        });
      } else {
        toast.error('Error al restablecer contraseña', {
          description: errorMessage,
        });
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn('grid gap-4', className)}
        {...props}
      >
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>Requisitos de contraseña</AlertTitle>
          <AlertDescription>
            La contraseña debe tener al menos 8 caracteres, incluir mayúsculas, minúsculas, números y caracteres especiales.
          </AlertDescription>
        </Alert>
        
        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nueva contraseña</FormLabel>
              <FormControl>
                <PasswordInput placeholder='********' {...field} />
              </FormControl>
              <FormMessage className="whitespace-pre-line" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='confirmPassword'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirmar nueva contraseña</FormLabel>
              <FormControl>
                <PasswordInput placeholder='********' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className='mt-2' disabled={isLoading}>
          Restablecer contraseña
          {isLoading ? <Loader2 className='animate-spin' /> : <ArrowRight />}
        </Button>
      </form>
    </Form>
  )
}

import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import { authService } from '@/services/auth/auth.service'
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
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/password-input'

const formSchema = z
  .object({
    email: z.string().email('Por favor ingresa un correo electrónico válido'),
    password: z.string().min(1, 'Por favor ingresa tu contraseña'),
    passwordConfirmation: z.string().min(1, 'Por favor confirma tu contraseña'),
    firstName: z.string().min(1, 'Por favor ingresa tu nombre').min(2, 'El nombre debe tener al menos 2 caracteres'),
    lastName: z.string().min(1, 'Por favor ingresa tu apellido').min(2, 'El apellido debe tener al menos 2 caracteres'),
  })
  .superRefine((data, ctx) => {
    // Validar contraseña con todas las reglas
    const passwordErrors = validatePassword(data.password, {
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
    });
    
    if (passwordErrors.length > 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: formatPasswordErrors(passwordErrors),
        path: ['password'],
      });
    }
    
    // Validar que las contraseñas coincidan
    if (data.password !== data.passwordConfirmation) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Las contraseñas no coinciden.",
        path: ['passwordConfirmation'],
      });
    }
  })

export function SignUpForm({
  className,
  ...props
}: React.HTMLAttributes<HTMLFormElement>) {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      passwordConfirmation: '',
      firstName: '',
      lastName: '',
    },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true)

    try {
      const result = await authService.registerClient({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        passwordConfirmation: data.passwordConfirmation,
      });

      if (result.success) {
        // Mostramos mensaje de éxito
        toast.success('¡Registro exitoso!', {
          description: 'Tu cuenta ha sido creada correctamente. Por favor inicia sesión.',
        });

        // Redirigimos al usuario a la pantalla de inicio de sesión
        navigate({ to: '/sign-in', replace: true });
      } 
    } catch (error: any) {
      console.error('Error en registro:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Error al registrar. Por favor intenta nuevamente.';
      toast.error('Error al registrar', {
        description: errorMessage,
      });
    } finally {
      setIsLoading(false)
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
          name='firstName'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input placeholder='Nombre completo' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='lastName'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Apellido</FormLabel>
              <FormControl>
                <Input placeholder='Apellido' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Correo electrónico</FormLabel>
              <FormControl>
                <Input type='email' placeholder='correo@ejemplo.com' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contraseña</FormLabel>
              <FormControl>
                <PasswordInput placeholder='********' {...field} />
              </FormControl>
              <FormMessage className="whitespace-pre-line" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='passwordConfirmation'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirmar contraseña</FormLabel>
              <FormControl>
                <PasswordInput placeholder='********' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className='mt-2' disabled={isLoading}>
          Registrar
        </Button>
      </form>
    </Form>
  )
}

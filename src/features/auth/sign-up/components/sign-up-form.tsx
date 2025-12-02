import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import { useAuthStore } from '@/stores/auth-store'
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
    email: z.email({
      error: (iss) =>
        iss.input === '' ? 'Por favor ingresa tu correo' : undefined,
    }),
    password: z.string().min(1, 'Por favor ingresa tu contraseña'),
    confirmPassword: z.string().min(1, 'Por favor confirma tu contraseña'),
    firstName: z.string().min(3, 'Por favor ingresa tu nombre'),
    lastName: z.string().min(3, 'Por favor ingresa tu apellido'),
    phone: z.string().min(10, 'Por favor ingresa tu número de teléfono'),
    address: z.string().min(5, 'Por favor ingresa tu dirección'),
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
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Las contraseñas no coinciden.",
        path: ['confirmPassword'],
      });
    }
  })

export function SignUpForm({
  className,
  ...props
}: React.HTMLAttributes<HTMLFormElement>) {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { auth } = useAuthStore()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
      phone: '',
      address: ''
    },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true)

    try {
      const registerPromise = await authService.register({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        phone: data.phone,
        address: data.address,
      });

      

      if (registerPromise) {
        const loginPromise = await authService.login({
          email: data.email,
          password: data.password,
        });

        if (!loginPromise || !loginPromise.accessToken) {
          throw new Error('Respuesta inválida del servicio de login');
        }

        // Actualizamos el store con los tokens
        auth.setTokens(loginPromise.accessToken, loginPromise.refreshToken);

        // Si tenemos datos del usuario, los guardamos en el store
        if (loginPromise.user) {
          auth.setUser(loginPromise.user);
        }

        // Mostramos mensaje de éxito
        toast.success('¡Registro exitoso!', {
          description: 'Tu cuenta ha sido creada correctamente.',
        });

        // Redirigimos al usuario al dashboard
        navigate({ to: '/', replace: true });
        return;
      } 
    } catch (error: any) {
      console.error('Error en registro:', error);
      toast.error('Error al registrar', {
        description: error.response.data.message,
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
          name='phone'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Teléfono</FormLabel>
              <FormControl>
                <Input placeholder='123-456-7890' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name='address'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dirección</FormLabel>
              <FormControl>
                <Input placeholder='Dirección' {...field} />
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
          name='confirmPassword'
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

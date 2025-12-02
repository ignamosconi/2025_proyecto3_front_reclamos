import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { ArrowRight, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { sleep, cn } from '@/lib/utils'
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
import { authService } from '@/services/auth/auth.service'

const formSchema = z.object({
  email: z.email({
    error: (iss) => (iss.input === '' ? 'Por favor ingresa tu correo electrónico' : undefined),
  }),
})

export function ForgotPasswordForm({
  className,
  ...props
}: React.HTMLAttributes<HTMLFormElement>) {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: '' },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true)
    
    try {
      const forgotPasswordResponse = await authService.forgotPassword(data.email);

      if (forgotPasswordResponse.success) {
        toast.success(forgotPasswordResponse.message || 'Email enviado', {
          description: 'Revisa tu correo para restablecer tu contraseña.',
        })
        await sleep(500)
        navigate({ to: '/sign-in' })
      } else {
        toast.error('Error al enviar el email. Intenta nuevamente.')
      }
    } catch (error: any) {
      console.error('Error al enviar email de recuperación:', error);
      toast.error('Error al enviar el email', {
        description: error?.response?.data?.message || 'Intenta nuevamente.',
      });
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn('grid gap-2', className)}
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
        <Button className='mt-2' disabled={isLoading}>
          Continuar
          {isLoading ? <Loader2 className='animate-spin' /> : <ArrowRight />}
        </Button>
      </form>
    </Form>
  )
}

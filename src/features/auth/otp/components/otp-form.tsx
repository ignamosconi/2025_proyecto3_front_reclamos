import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { authService } from '@/services/auth/auth.service'
import { toast } from 'sonner'
import { useAuthStore } from '@/stores/auth-store'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from '@/components/ui/input-otp'

const formSchema = z.object({
  otp: z
    .string()
    .min(6, 'Please enter the 6-digit code.')
    .max(6, 'Please enter the 6-digit code.'),
})

type OtpFormProps = React.HTMLAttributes<HTMLFormElement>

export function OtpForm({ className, ...props }: OtpFormProps) {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)

  const search = useSearch({ from: '/(auth)/otp' }) as { email?: string }
  const { auth } = useAuthStore()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { otp: '' },
  })

  const otp = form.watch('otp')

  async function onSubmit(data: z.infer<typeof formSchema>) {
    if (!search.email) {
      toast.error('Email no encontrado. Por favor inicia sesión nuevamente.')
      navigate({ to: '/sign-in' })
      return
    }

    setIsLoading(true)
    try {
      const response = await authService.verify2fa(search.email, data.otp)

      auth.setTokens(response.accessToken, response.refreshToken)

      // Fetch user data to set in store and redirect correctly
      // We can't easily get user data here without another call or decoding token
      // For now, let's redirect to dashboard and let the guard handle it or fetch user
      // Ideally authService.verify2fa should return user or we fetch it.
      // But verify2fa returns TokenPair.
      // Let's just redirect to '/' and let the app handle fetching user info if needed
      // or we can decode the token if we had a decoder.
      // Assuming the app fetches user on mount or we can call me endpoint.

      toast.success('Verificación exitosa')
      navigate({ to: '/' })
    } catch (error) {
      toast.error('Código inválido o expirado')
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
          name='otp'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='sr-only'>One-Time Password</FormLabel>
              <FormControl>
                <InputOTP
                  maxLength={6}
                  {...field}
                  containerClassName='justify-between sm:[&>[data-slot="input-otp-group"]>div]:w-12'
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className='mt-2' disabled={otp.length < 6 || isLoading}>
          Verify
        </Button>
      </form>
    </Form>
  )
}

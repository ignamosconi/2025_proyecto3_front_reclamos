'use client'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
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
import { validatePassword } from '@/lib/validate-password'
import { usersService, type UpdateProfileDto } from '@/services/users/users.service'
import { toast } from 'sonner'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useQueryClient } from '@tanstack/react-query'

const formSchema = z
  .object({
    firstName: z.string().min(1, 'El nombre es requerido.'),
    lastName: z.string().min(1, 'El apellido es requerido.'),
    email: z.string().email('Ingresa un correo electrónico válido.'),
    password: z.string().transform((pwd) => pwd.trim()),
    passwordConfirmation: z.string().transform((pwd) => pwd.trim()),
  })
  .superRefine((data, ctx) => {
    // Si no se ingresó contraseña, no validar
    if (!data.password) {
      return
    }

    // Usar la función de validación personalizada
    const passwordErrors = validatePassword(data.password, {
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
    })

    // Agregar cada error al contexto
    passwordErrors.forEach((error) => {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: error.message,
        path: ['password'],
      })
    })

    // Validar que las contraseñas coincidan
    if (data.password && data.password !== data.passwordConfirmation) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Las contraseñas no coinciden.',
        path: ['passwordConfirmation'],
      })
    }
  })

type ProfileFormType = z.infer<typeof formSchema>

type ProfileFormProps = {
  user: {
    id?: string
    firstName: string
    lastName: string
    email: string
    role?: string
  }
}

export function ProfileForm({ user }: ProfileFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const queryClient = useQueryClient()
  
  const form = useForm<ProfileFormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
      password: '',
      passwordConfirmation: '',
    },
  })

  const onSubmit = async (values: ProfileFormType) => {
    try {
      setIsSubmitting(true)
      
      const updateData: UpdateProfileDto = {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
      }
      
      // Solo incluir password si se proporcionó
      if (values.password) {
        updateData.password = values.password
        updateData.passwordConfirmation = values.passwordConfirmation
      }
      
      await usersService.updateProfile(updateData)
      toast.success('Perfil actualizado correctamente')
      
      // Invalidar la query del usuario actual para refrescar los datos
      queryClient.invalidateQueries({ queryKey: ['currentUser'] })
      
      // Limpiar campos de contraseña
      form.resetField('password')
      form.resetField('passwordConfirmation')
    } catch (error: any) {
      console.error('Error al actualizar perfil:', error)
      const errorMessage = error.response?.data?.message || 'Error al actualizar el perfil'
      toast.error(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  const isPasswordTouched = !!form.formState.dirtyFields.password

  return (
    <Card className='max-w-2xl'>
      <CardHeader>
        <CardTitle>Información Personal</CardTitle>
        <CardDescription>
          Actualiza tu información personal. Los campos marcados con * son obligatorios.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            id='profile-form'
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-6'
          >
            <div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
              <FormField
                control={form.control}
                name='firstName'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Nombre <span className='text-destructive'>*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Juan'
                        autoComplete='given-name'
                        {...field}
                      />
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
                    <FormLabel>
                      Apellido <span className='text-destructive'>*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Pérez'
                        autoComplete='family-name'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Correo Electrónico <span className='text-destructive'>*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type='email'
                      placeholder='juan.perez@example.com'
                      autoComplete='email'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {user.role && (
              <div className='rounded-lg border bg-muted/50 p-4'>
                <p className='text-sm font-medium'>Rol</p>
                <p className='text-sm text-muted-foreground'>{user.role}</p>
                <p className='mt-2 text-xs text-muted-foreground'>
                  El rol no puede ser modificado. Solo un Gerente puede cambiar los roles de los usuarios.
                </p>
              </div>
            )}

            <Separator />

            <div>
              <h3 className='mb-4 text-lg font-semibold'>Cambiar Contraseña</h3>
              <p className='mb-4 text-sm text-muted-foreground'>
                Deja estos campos vacíos si no deseas cambiar tu contraseña.
              </p>
              
              <div className='space-y-4'>
                <FormField
                  control={form.control}
                  name='password'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nueva Contraseña</FormLabel>
                      <FormControl>
                        <PasswordInput
                          placeholder='Deja vacío para no cambiar'
                          autoComplete='new-password'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name='passwordConfirmation'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirmar Nueva Contraseña</FormLabel>
                      <FormControl>
                        <PasswordInput
                          disabled={!isPasswordTouched}
                          placeholder='Confirma tu nueva contraseña'
                          autoComplete='new-password'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className='flex justify-end gap-4'>
              <Button
                type='button'
                variant='outline'
                onClick={() => {
                  form.reset()
                  form.resetField('password')
                  form.resetField('passwordConfirmation')
                }}
              >
                Cancelar
              </Button>
              <Button type='submit' form='profile-form' disabled={isSubmitting}>
                {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}


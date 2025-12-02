'use client'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
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
import { SelectDropdown } from '@/components/select-dropdown'
import { validatePassword } from '@/lib/validate-password'
import { usersService, type CreateUserDto, type UpdateUserDto } from '@/services/users/users.service'
import { toast } from 'sonner'
import { roles } from '../data/data'
import { type User } from '../data/schema'

const formSchema = z
  .object({
    firstName: z.string().min(1, 'El nombre es requerido.'),
    lastName: z.string().min(1, 'El apellido es requerido.'),
    email: z.string().email('Ingresa un correo electrónico válido.'),
    phone: z.string().min(1, 'El teléfono es requerido.'),
    address: z.string().min(1, 'La dirección es requerida.'),
    password: z.string().transform((pwd) => pwd.trim()),
    role: z.union([z.literal('Dueño'), z.literal('Empleado')]),
    confirmPassword: z.string().transform((pwd) => pwd.trim()),
    isEdit: z.boolean(),
  })
  .superRefine((data, ctx) => {
    // Si es edición y no se ingresó contraseña, no validar
    if (data.isEdit && !data.password) {
      return
    }

    // Validar que la contraseña no esté vacía en modo creación
    if (!data.isEdit && !data.password) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'La contraseña es requerida.',
        path: ['password'],
      })
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
    if (data.password && data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Las contraseñas no coinciden.',
        path: ['confirmPassword'],
      })
    }
  })
type UserForm = z.infer<typeof formSchema>

type UserActionDialogProps = {
  currentRow?: User
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function UsersActionDialog({
  currentRow,
  open,
  onOpenChange,
  onSuccess,
}: UserActionDialogProps) {
  const isEdit = !!currentRow
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const form = useForm<UserForm>({
    resolver: zodResolver(formSchema),
    defaultValues: isEdit
      ? {
          firstName: currentRow.firstName,
          lastName: currentRow.lastName,
          email: currentRow.email,
          phone: currentRow.phone,
          address: currentRow.address,
          role: currentRow.role,
          password: '',
          confirmPassword: '',
          isEdit,
        }
      : {
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          address: '',
          role: 'Empleado',
          password: '',
          confirmPassword: '',
          isEdit,
        },
  })

  const onSubmit = async (values: UserForm) => {
    try {
      setIsSubmitting(true)
      
      if (isEdit && currentRow) {
        // Actualizar usuario
        const updateData: UpdateUserDto = {
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          phone: values.phone,
          address: values.address,
          role: values.role,
        }
        
        // Solo incluir password si se proporcionó
        if (values.password) {
          updateData.password = values.password
        }
        
        await usersService.update(currentRow.id, updateData)
        toast.success('Usuario actualizado correctamente')
      } else {
        // Crear nuevo usuario
        const createData: CreateUserDto = {
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          phone: values.phone,
          address: values.address,
          role: values.role,
          password: values.password,
        }
        
        await usersService.create(createData)
        toast.success('Usuario creado correctamente')
      }
      
      form.reset()
      onOpenChange(false)
      onSuccess?.()
    } catch (error: any) {
      console.error('Error al guardar usuario:', error)
      const errorMessage = error.response?.data?.message || 'Error al guardar el usuario'
      toast.error(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  const isPasswordTouched = !!form.formState.dirtyFields.password

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        form.reset()
        onOpenChange(state)
      }}
    >
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader className='text-start'>
          <DialogTitle>{isEdit ? 'Editar usuario' : 'Agregar nuevo usuario'}</DialogTitle>
          <DialogDescription>
            {isEdit 
              ? 'Actualiza la información del usuario. Haz clic en guardar cuando termines.' 
              : 'Crea un nuevo usuario. Haz clic en guardar cuando termines.'}
          </DialogDescription>
        </DialogHeader>
        <div className='h-[26.25rem] w-[calc(100%+0.75rem)] overflow-y-auto py-1 pe-3'>
          <Form {...form}>
            <form
              id='user-form'
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-4 px-0.5'
            >
              <FormField
                control={form.control}
                name='firstName'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      Nombre
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Juan'
                        className='col-span-4'
                        autoComplete='off'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='lastName'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      Apellido
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Pérez'
                        className='col-span-4'
                        autoComplete='off'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>Correo</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='juan.perez@gmail.com'
                        className='col-span-4'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='phone'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      Teléfono
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='+123456789'
                        className='col-span-4'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='address'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      Dirección
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Av. Principal 123'
                        className='col-span-4'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='role'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>Rol</FormLabel>
                    <SelectDropdown
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                      placeholder='Selecciona un rol'
                      className='col-span-4 w-full'
                      items={roles.map(({ label, value }) => ({
                        label,  
                        value,
                      }))}
                    />
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      Contraseña{isEdit && ' (opcional)'}
                    </FormLabel>
                    <FormControl>
                      <PasswordInput
                        placeholder='ej., S3cur3P@ssw0rd'
                        className='col-span-4'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='confirmPassword'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      Confirmar Contraseña
                    </FormLabel>
                    <FormControl>
                      <PasswordInput
                        disabled={!isPasswordTouched}
                        placeholder='ej., S3cur3P@ssw0rd'
                        className='col-span-4'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
        <DialogFooter>
          <Button type='submit' form='user-form' disabled={isSubmitting}>
            {isSubmitting ? 'Guardando...' : 'Guardar cambios'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

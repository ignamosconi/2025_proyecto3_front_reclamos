'use client'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
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
  FormDescription,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/password-input'
import { SelectDropdown } from '@/components/select-dropdown'
import { Checkbox } from '@/components/ui/checkbox'
import { validatePassword } from '@/lib/validate-password'
import { usersService, type CreateStaffDto, type UpdateStaffDto } from '@/services/users/users.service'
import { areasService } from '@/services/areas/areas.service'
import { toast } from 'sonner'
import { staffRoles } from '../data/data'
import { type User } from '../data/schema'

const createStaffSchema = z
  .object({
    firstName: z.string().min(1, 'El nombre es requerido.'),
    lastName: z.string().min(1, 'El apellido es requerido.'),
    email: z.string().email('Ingresa un correo electrónico válido.'),
    role: z.union([z.literal('Encargado'), z.literal('Gerente')]),
    areaIds: z.array(z.string()).min(1, 'Debe seleccionar al menos un área responsable.'),
    password: z.string().transform((pwd) => pwd.trim()),
    passwordConfirmation: z.string().transform((pwd) => pwd.trim()),
  })
  .superRefine((data, ctx) => {
    // Validar que la contraseña no esté vacía en modo creación
    if (!data.password) {
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
    if (data.password && data.password !== data.passwordConfirmation) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Las contraseñas no coinciden.',
        path: ['passwordConfirmation'],
      })
    }
  })

const updateStaffSchema = z.object({
  firstName: z.string().min(1, 'El nombre es requerido.'),
  lastName: z.string().min(1, 'El apellido es requerido.'),
  email: z.string().email('Ingresa un correo electrónico válido.'),
  role: z.union([z.literal('Cliente'), z.literal('Encargado'), z.literal('Gerente')]),
  areaIds: z.array(z.string()).min(1, 'Debe seleccionar al menos un área responsable.'),
})

type CreateStaffForm = z.infer<typeof createStaffSchema>
type UpdateStaffForm = z.infer<typeof updateStaffSchema>

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

  // Obtener áreas disponibles
  const { data: areasData } = useQuery({
    queryKey: ['areas'],
    queryFn: () => areasService.getAll({ limit: 100 }),
    enabled: open,
  })

  const areas = areasData?.data || []

  const createForm = useForm<CreateStaffForm>({
    resolver: zodResolver(createStaffSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      role: 'Encargado',
      areaIds: [],
      password: '',
      passwordConfirmation: '',
    },
  })

  const updateForm = useForm<UpdateStaffForm>({
    resolver: zodResolver(updateStaffSchema),
    defaultValues: {
      firstName: currentRow?.firstName || '',
      lastName: currentRow?.lastName || '',
      email: currentRow?.email || '',
      role: (currentRow?.role as 'Cliente' | 'Encargado' | 'Gerente') || 'Encargado',
      areaIds: currentRow?.areas?.map((a) => a._id) || [],
    },
  })

  // Actualizar valores del formulario de edición cuando cambia currentRow
  useEffect(() => {
    if (isEdit && currentRow) {
      updateForm.reset({
        firstName: currentRow.firstName,
        lastName: currentRow.lastName,
        email: currentRow.email,
        role: (currentRow.role as 'Cliente' | 'Encargado' | 'Gerente'),
        areaIds: currentRow.areas?.map((a) => a._id) || [],
      })
    } else {
      createForm.reset()
    }
  }, [currentRow, isEdit, createForm, updateForm])

  const handleCreateSubmit = async (values: CreateStaffForm) => {
    try {
      setIsSubmitting(true)
      const createData: CreateStaffDto = {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        role: values.role,
        areaIds: values.areaIds,
        password: values.password,
        passwordConfirmation: values.passwordConfirmation,
      }

      await usersService.createStaff(createData)
      toast.success('Usuario creado correctamente. Se ha enviado un correo de bienvenida.')
      createForm.reset()
      onOpenChange(false)
      onSuccess?.()
    } catch (error: any) {
      console.error('Error al crear usuario:', error)
      const errorMessage = error.response?.data?.message || 'Error al crear el usuario'
      toast.error(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpdateSubmit = async (values: UpdateStaffForm) => {
    try {
      setIsSubmitting(true)
      if (!currentRow) return

      const updateData: UpdateStaffDto = {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        role: values.role,
        areaIds: values.areaIds,
      }

      await usersService.updateStaff(currentRow._id, updateData)
      toast.success('Usuario actualizado correctamente')
      onOpenChange(false)
      onSuccess?.()
    } catch (error: any) {
      console.error('Error al actualizar usuario:', error)
      const errorMessage = error.response?.data?.message || 'Error al actualizar el usuario'
      toast.error(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isEdit) {
    return (
      <Dialog
        open={open}
        onOpenChange={(state) => {
          updateForm.reset()
          onOpenChange(state)
        }}
      >
        <DialogContent className='sm:max-w-2xl max-h-[90vh] overflow-y-auto'>
          <DialogHeader className='text-start'>
            <DialogTitle>Editar Usuario</DialogTitle>
            <DialogDescription>
              Actualiza la información del usuario. El gerente no puede modificar la contraseña.
            </DialogDescription>
          </DialogHeader>
          <Form {...updateForm}>
            <form
              id='update-staff-form'
              onSubmit={updateForm.handleSubmit(handleUpdateSubmit)}
              className='space-y-4'
            >
              <div className='grid grid-cols-2 gap-4'>
                <FormField
                  control={updateForm.control}
                  name='firstName'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre</FormLabel>
                      <FormControl>
                        <Input placeholder='Juan' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={updateForm.control}
                  name='lastName'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Apellido</FormLabel>
                      <FormControl>
                        <Input placeholder='Pérez' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={updateForm.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Correo Electrónico</FormLabel>
                    <FormControl>
                      <Input type='email' placeholder='juan.perez@example.com' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={updateForm.control}
                name='role'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rol</FormLabel>
                    <SelectDropdown
                      value={field.value}
                      onValueChange={field.onChange}
                      placeholder='Selecciona un rol'
                      items={[
                        { label: 'Encargado', value: 'Encargado' },
                        { label: 'Gerente', value: 'Gerente' },
                      ]}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={updateForm.control}
                name='areaIds'
                render={() => (
                  <FormItem>
                    <div className='mb-4'>
                      <FormLabel>Áreas Responsables</FormLabel>
                      <FormDescription>
                        Selecciona una o más áreas responsables para este usuario.
                      </FormDescription>
                    </div>
                    {areas.map((area) => (
                      <FormField
                        key={area._id}
                        control={updateForm.control}
                        name='areaIds'
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={area._id}
                              className='flex flex-row items-start space-x-3 space-y-0'
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(area._id)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, area._id])
                                      : field.onChange(
                                          field.value?.filter((value) => value !== area._id)
                                        )
                                  }}
                                />
                              </FormControl>
                              <FormLabel className='font-normal'>
                                {area.nombre}
                                {area.descripcion && (
                                  <span className='text-muted-foreground ml-2 text-sm'>
                                    - {area.descripcion}
                                  </span>
                                )}
                              </FormLabel>
                            </FormItem>
                          )
                        }}
                      />
                    ))}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
          <DialogFooter>
            <Button type='submit' form='update-staff-form' disabled={isSubmitting}>
              {isSubmitting ? 'Guardando...' : 'Guardar cambios'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        createForm.reset()
        onOpenChange(state)
      }}
    >
      <DialogContent className='sm:max-w-2xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader className='text-start'>
          <DialogTitle>Crear Nuevo Usuario (Staff)</DialogTitle>
          <DialogDescription>
            Crea un nuevo Encargado o Gerente. Se enviará un correo de bienvenida al usuario.
          </DialogDescription>
        </DialogHeader>
        <Form {...createForm}>
          <form
            id='create-staff-form'
            onSubmit={createForm.handleSubmit(handleCreateSubmit)}
            className='space-y-4'
          >
            <div className='grid grid-cols-2 gap-4'>
              <FormField
                control={createForm.control}
                name='firstName'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre</FormLabel>
                    <FormControl>
                      <Input placeholder='Juan' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={createForm.control}
                name='lastName'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Apellido</FormLabel>
                    <FormControl>
                      <Input placeholder='Pérez' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={createForm.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Correo Electrónico</FormLabel>
                  <FormControl>
                    <Input type='email' placeholder='juan.perez@example.com' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={createForm.control}
              name='role'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rol</FormLabel>
                  <SelectDropdown
                    value={field.value}
                    onValueChange={field.onChange}
                    placeholder='Selecciona un rol'
                    items={staffRoles.map(({ label, value }) => ({
                      label,
                      value,
                    }))}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={createForm.control}
              name='areaIds'
              render={() => (
                <FormItem>
                  <div className='mb-4'>
                    <FormLabel>Áreas Responsables</FormLabel>
                    <FormDescription>
                      Selecciona una o más áreas responsables para este usuario.
                    </FormDescription>
                  </div>
                  {areas.map((area) => (
                    <FormField
                      key={area._id}
                      control={createForm.control}
                      name='areaIds'
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={area._id}
                            className='flex flex-row items-start space-x-3 space-y-0'
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(area._id)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, area._id])
                                    : field.onChange(
                                        field.value?.filter((value) => value !== area._id)
                                      )
                                }}
                              />
                            </FormControl>
                            <FormLabel className='font-normal'>
                              {area.nombre}
                              {area.descripcion && (
                                <span className='text-muted-foreground ml-2 text-sm'>
                                  - {area.descripcion}
                                </span>
                              )}
                            </FormLabel>
                          </FormItem>
                        )
                      }}
                    />
                  ))}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={createForm.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contraseña</FormLabel>
                  <FormControl>
                    <PasswordInput placeholder='ej., S3cur3P@ssw0rd' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={createForm.control}
              name='passwordConfirmation'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirmar Contraseña</FormLabel>
                  <FormControl>
                    <PasswordInput placeholder='Confirma tu contraseña' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter>
          <Button type='submit' form='create-staff-form' disabled={isSubmitting}>
            {isSubmitting ? 'Creando...' : 'Crear usuario'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

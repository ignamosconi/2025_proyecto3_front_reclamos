import { UserCheck, Users, Shield } from 'lucide-react'

export const roles = [
  {
    label: 'Cliente',
    value: 'Cliente',
    icon: Users,
  },
  {
    label: 'Encargado',
    value: 'Encargado',
    icon: UserCheck,
  },
  {
    label: 'Gerente',
    value: 'Gerente',
    icon: Shield,
  },
] as const

export const staffRoles = [
  {
    label: 'Encargado',
    value: 'Encargado',
    icon: UserCheck,
  },
  {
    label: 'Gerente',
    value: 'Gerente',
    icon: Shield,
  },
] as const

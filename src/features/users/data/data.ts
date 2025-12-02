import { UserCheck, Users } from 'lucide-react'

export const roles = [
  {
    label: 'Dueño',
    value: 'Dueño',
    icon: UserCheck,
  },
  {
    label: 'Empleado',
    value: 'Empleado',
    icon: Users,
  },
] as const

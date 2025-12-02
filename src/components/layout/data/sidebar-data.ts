import {
  LayoutDashboard,
  Users,
  Command,
  FileText,
  FolderTree,
  AlertCircle,
  FolderKanban,
} from 'lucide-react'
import { type SidebarData } from '../types'

export const sidebarData: SidebarData = {
  user: {
    name: 'satnaing',
    email: 'satnaingdev@gmail.com',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    {
      name: 'Shadcn Admin',
      logo: Command,
      plan: 'Vite + ShadcnUI',
    },
  ],
  navGroups: [
    {
      title: 'General',
      items: [
        {
          title: 'Dashboard',
          url: '/',
          icon: LayoutDashboard,
        },
        {
          title: 'Reclamos',
          url: '/reclamos',
          icon: AlertCircle,
        },
        {
          title: 'Usuarios',
          url: '/users',
          icon: Users,
        },
        {
          title: 'Tipos de Reclamos',
          url: '/tipo-reclamo',
          icon: FileText,
        },
        {
          title: 'Áreas Responsables',
          url: '/areas',
          icon: FolderTree,
        },
        {
          title: 'Proyectos',
          url: '/proyectos',
          icon: FolderKanban,
        }
      ],
    }
  ],
}

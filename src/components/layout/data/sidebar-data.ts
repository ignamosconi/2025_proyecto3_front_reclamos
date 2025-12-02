import {
  LayoutDashboard,
  ListTodo,
  Users,
  Command,
  Tag,
  Building,
  ShoppingBag,
  Layers,
  Milestone,
  Package,
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
          title: 'Usuarios',
          url: '/users',
          icon: Users,
        }
      ],
    },
    {
      title: 'Catalogo',
      items: [
        {
          title: 'Líneas de producto',
          url: '/lines',
          icon: ListTodo,
        },
        {
          title: 'Marcas',
          url: '/brands',
          icon: Tag,
        },
        {
          title: 'Proveedores',
          url: '/suppliers',
          icon: Building,
        },
        {
          title: 'Productos',
          url: '/products',
          icon: ShoppingBag,
        }
      ]
    },
    {
      title: 'Operaciones',
      items: [
        {
          title: 'Ventas',
          url: '/sales',
          icon: Milestone,
        },
         {
          title: 'Compras',
          url: '/purchases',
          icon: Package,
        }
      ]
    },
    {
      title: 'Sistema',
      items: [
        {
          title: 'Auditoría',
          url: '/audit',
          icon: Layers,
        }
      ]
    }
  ],
}

import { useMemo } from 'react'
import { useLayout } from '@/context/layout-provider'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'
import { useAuthStore } from '@/stores/auth-store'
import { sidebarData } from './data/sidebar-data'
import { NavGroup } from './nav-group'
import { NavUser } from './nav-user'
import { AppTitle } from './app-title'
import type { NavGroup as NavGroupType } from './types'

export function AppSidebar() {
  const { collapsible, variant } = useLayout()
  const hasRole = useAuthStore((state) => state.auth.hasRole)
  
  // Filtrar los items del menú según el rol del usuario
  const filteredNavGroups = useMemo(() => {
    return sidebarData.navGroups.map((group) => {
      const filteredItems = group.items.filter((item) => {
        // Si el item es "Usuarios", "Líneas de producto", "Marcas" o "Proveedores", solo mostrarlo si el usuario es "Dueño"
        if (
          item.title === 'Usuarios' || 
          item.title === 'Líneas de producto' || 
          item.title === 'Marcas' || 
          item.title === 'Proveedores' ||
          item.title === 'Productos' ||
          item.title === 'Dashboard' ||
          item.title === 'Auditoría'
        ) {
          return hasRole('Dueño')
        }
        // Para otros items, mostrarlos siempre
        return true
      })
      
      return {
        ...group,
        items: filteredItems,
      }
    }).filter((group) => group.items.length > 0) // Eliminar grupos sin items
  }, [hasRole]) as NavGroupType[]
  
  return (
    <Sidebar collapsible={collapsible} variant={variant}>
      <SidebarHeader>
       {/*  <TeamSwitcher teams={sidebarData.teams} /> */}
        <AppTitle />
      </SidebarHeader>
      <SidebarContent>
        {filteredNavGroups.map((props) => (
          <NavGroup key={props.title} {...props} />
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

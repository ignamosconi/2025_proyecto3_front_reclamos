'use client'

import React from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type Proyecto } from '../data/schema'

type ProyectoDialogType = 'add' | 'edit' | 'delete' | 'view'

type ProyectoContextType = {
  open: ProyectoDialogType | null
  setOpen: (str: ProyectoDialogType | null) => void
  currentRow: Proyecto | null
  setCurrentRow: (row: Proyecto | null) => void
}

const ProyectoContext = React.createContext<ProyectoContextType | null>(null)

export function ProyectosProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<ProyectoDialogType>(null)
  const [currentRow, setCurrentRow] = React.useState<Proyecto | null>(null)

  return (
    <ProyectoContext.Provider value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </ProyectoContext.Provider>
  )
}

export const useProyecto = () => {
  const proyectoContext = React.useContext(ProyectoContext)
  if (!proyectoContext) {
    throw new Error('useProyecto has to be used within <ProyectosProvider>')
  }
  return proyectoContext
}


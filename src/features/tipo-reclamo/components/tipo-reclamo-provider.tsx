'use client'

import React from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type TipoReclamo } from '../data/schema'

type TipoReclamoDialogType = 'add' | 'edit' | 'delete'

type TipoReclamoContextType = {
  open: TipoReclamoDialogType | null
  setOpen: (str: TipoReclamoDialogType | null) => void
  currentRow: TipoReclamo | null
  setCurrentRow: (row: TipoReclamo | null) => void
}

const TipoReclamoContext = React.createContext<TipoReclamoContextType | null>(null)

export function TipoReclamoProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<TipoReclamoDialogType>(null)
  const [currentRow, setCurrentRow] = React.useState<TipoReclamo | null>(null)

  return (
    <TipoReclamoContext.Provider value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </TipoReclamoContext.Provider>
  )
}

export const useTipoReclamo = () => {
  const tipoReclamoContext = React.useContext(TipoReclamoContext)
  if (!tipoReclamoContext) {
    throw new Error('useTipoReclamo has to be used within <TipoReclamoProvider>')
  }
  return tipoReclamoContext
}


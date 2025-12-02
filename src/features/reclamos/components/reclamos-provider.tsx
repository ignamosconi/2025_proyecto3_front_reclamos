'use client'

import React from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type Reclamo } from '../data/schema'

type ReclamoDialogType = 'add' | 'edit' | 'delete' | 'view' | 'change-state' | 'reassign-area'

type ReclamoContextType = {
  open: ReclamoDialogType | null
  setOpen: (str: ReclamoDialogType | null) => void
  currentRow: Reclamo | null
  setCurrentRow: (row: Reclamo | null) => void
}

const ReclamoContext = React.createContext<ReclamoContextType | null>(null)

export function ReclamosProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<ReclamoDialogType>(null)
  const [currentRow, setCurrentRow] = React.useState<Reclamo | null>(null)

  return (
    <ReclamoContext.Provider value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </ReclamoContext.Provider>
  )
}

export const useReclamos = () => {
  const reclamoContext = React.useContext(ReclamoContext)
  if (!reclamoContext) {
    throw new Error('useReclamos has to be used within <ReclamosProvider>')
  }
  return reclamoContext
}


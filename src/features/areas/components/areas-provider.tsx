'use client'

import React from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type Area } from '../data/schema'

type AreaDialogType = 'add' | 'edit' | 'delete'

type AreaContextType = {
  open: AreaDialogType | null
  setOpen: (str: AreaDialogType | null) => void
  currentRow: Area | null
  setCurrentRow: (row: Area | null) => void
}

const AreaContext = React.createContext<AreaContextType | null>(null)

export function AreasProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<AreaDialogType>(null)
  const [currentRow, setCurrentRow] = React.useState<Area | null>(null)

  return (
    <AreaContext.Provider value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </AreaContext.Provider>
  )
}

export const useAreas = () => {
  const areaContext = React.useContext(AreaContext)
  if (!areaContext) {
    throw new Error('useAreas has to be used within <AreasProvider>')
  }
  return areaContext
}


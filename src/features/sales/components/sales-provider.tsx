import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type Sale } from '../data/schema'

type SalesDialogType =  'add' | 'edit'

type SalesContextType = {
  open: SalesDialogType | null
  setOpen: (str: SalesDialogType | null) => void
  currentRow: Sale | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Sale | null>>
}

const SalesContext = React.createContext<SalesContextType | null>(null)

export function SalesProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<SalesDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Sale | null>(null)

  return (
    <SalesContext.Provider value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </SalesContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useSales = () => {
  const salesContext = React.useContext(SalesContext)

  if (!salesContext) {
    throw new Error('useSales has to be used within <SalesContext>')
  }

  return salesContext
}


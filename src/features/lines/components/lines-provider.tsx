import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type Line } from '../data/schema'

type LinesDialogType =  'add' | 'edit' | 'delete'

type LinesContextType = {
  open: LinesDialogType | null
  setOpen: (str: LinesDialogType | null) => void
  currentRow: Line | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Line | null>>
}

const LinesContext = React.createContext<LinesContextType | null>(null)

export function LinesProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<LinesDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Line | null>(null)

  return (
    <LinesContext.Provider value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </LinesContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useLines = () => {
  const linesContext = React.useContext(LinesContext)

  if (!linesContext) {
    throw new Error('useLines has to be used within <LinesContext>')
  }

  return linesContext
}

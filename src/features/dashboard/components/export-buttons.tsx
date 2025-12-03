import { Button } from '@/components/ui/button'
import { Download, File, FileText } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import type { ExportFormat } from '@/services/dashboard/dashboard.service'

interface ExportButtonsProps {
  onExport: (format: ExportFormat) => Promise<void>
  isLoading?: boolean
}

export function ExportButtons({ onExport, isLoading = false }: ExportButtonsProps) {
  const [exportingFormat, setExportingFormat] = useState<ExportFormat | null>(null)

  const handleExport = async (format: ExportFormat) => {
    try {
      setExportingFormat(format)
      await onExport(format)
      toast.success(`Reporte exportado exitosamente en formato ${format.toUpperCase()}`)
    } catch (error) {
      console.error('Error al exportar:', error)
      toast.error('Error al exportar el reporte. Por favor, intenta nuevamente.')
    } finally {
      setExportingFormat(null)
    }
  }

  const isExporting = exportingFormat !== null || isLoading
  const isExportingExcel = exportingFormat === 'xlsx'
  const isExportingCsv = exportingFormat === 'csv'

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="default"
        onClick={() => handleExport('xlsx')}
        disabled={isExporting}
        className="gap-2"
      >
        {isExportingExcel ? (
          <>
            <Download className="h-4 w-4 animate-spin" />
            Exportando...
          </>
        ) : (
          <>
            <File className="h-4 w-4" />
            Exportar a Excel
          </>
        )}
      </Button>
      <Button
        variant="outline"
        size="default"
        onClick={() => handleExport('csv')}
        disabled={isExporting}
        className="gap-2"
      >
        {isExportingCsv ? (
          <>
            <Download className="h-4 w-4 animate-spin" />
            Exportando...
          </>
        ) : (
          <>
            <FileText className="h-4 w-4" />
            Exportar a CSV
          </>
        )}
      </Button>
    </div>
  )
}


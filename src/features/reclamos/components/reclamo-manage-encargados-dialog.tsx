import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { reclamosService, Reclamo } from '@/services/reclamos/reclamos.service';
import { usersService } from '@/services/users/users.service';
import { toast } from 'sonner';
import { Loader2, UserPlus, UserMinus } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

interface ReclamoManageEncargadosDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reclamo: Reclamo;
  currentUserId: string;
}

interface Encargado {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  areas?: Array<string | { _id: string; nombre: string; descripcion?: string }>;
}

interface EncargadoAsignacion {
  _id: string;
  fkEncargado: Encargado;
  fkReclamo: string;
  isPrincipal: boolean;
  createdAt: string;
  updatedAt: string;
}

export function ReclamoManageEncargadosDialog({
  open,
  onOpenChange,
  reclamo,
  currentUserId,
}: ReclamoManageEncargadosDialogProps) {
  const queryClient = useQueryClient();
  const [selectedEncargadoToAdd, setSelectedEncargadoToAdd] = useState<string>('');
  const [selectedEncargadoToRemove, setSelectedEncargadoToRemove] = useState<string>('');

  // Obtener encargados asignados al reclamo
  const { data: encargadosAsignados = [], isLoading: isLoadingAsignados } = useQuery<EncargadoAsignacion[]>({
    queryKey: ['reclamo-encargados', reclamo._id],
    queryFn: async () => {
      const response = await reclamosService.getEncargados(reclamo._id);
      return response;
    },
    enabled: open,
  });

  // Obtener el ID del área del reclamo (puede venir como string o como objeto)
  const reclamoAreaId = typeof reclamo.fkArea === 'string' 
    ? reclamo.fkArea 
    : (reclamo.fkArea as any)?._id;

  // Obtener todos los encargados del área del reclamo directamente desde el backend
  const { data: encargadosArea = [], isLoading: isLoadingEncargados } = useQuery<Encargado[]>({
    queryKey: ['users-encargados-area', reclamoAreaId],
    queryFn: async () => {
      console.log('📋 Obteniendo encargados del área:', reclamoAreaId);
      const encargados = await usersService.getEncargadosByArea(reclamoAreaId);
      console.log('👥 Encargados del área obtenidos del backend:', encargados.length);
      console.log('👥 Encargados:', encargados.map(e => `${e.firstName} ${e.lastName} (${e._id})`));
      return encargados;
    },
    enabled: open && !!reclamoAreaId,
  });

  // Determinar si el usuario actual está asignado al reclamo
  const isAssigned = encargadosAsignados.some(asig => {
    const asigId = typeof asig.fkEncargado === 'string' 
      ? asig.fkEncargado 
      : asig.fkEncargado?._id;
    return asigId === currentUserId;
  });

  // Encargados disponibles para agregar (que no estén ya asignados)
  const encargadosDisponibles = encargadosArea.filter(
    enc => {
      const isAlreadyAssigned = encargadosAsignados.some(asig => {
        const asigId = typeof asig.fkEncargado === 'string' 
          ? asig.fkEncargado 
          : asig.fkEncargado?._id;
        const match = String(asigId) === String(enc._id);
        console.log(`   Comparando enc._id "${enc._id}" con asig "${asigId}": ${match}`);
        return match;
      });
      console.log(`🔍 ${enc.firstName} ${enc.lastName} - Ya asignado: ${isAlreadyAssigned}`);
      return !isAlreadyAssigned;
    }
  );

  console.log('\n📊 RESUMEN:');
  console.log('📊 Encargados del área:', encargadosArea.length);
  console.log('📊 Encargados asignados:', encargadosAsignados.length);
  console.log('📊 Encargados disponibles:', encargadosDisponibles.length);
  console.log('👥 Lista de encargados del área:', encargadosArea.map(e => `${e.firstName} ${e.lastName} (${e._id})`));
  console.log('👥 Lista de encargados asignados:', encargadosAsignados.map(a => {
    const encId = typeof a.fkEncargado === 'string' ? a.fkEncargado : a.fkEncargado?._id;
    const encName = typeof a.fkEncargado === 'string' ? encId : `${a.fkEncargado?.firstName} ${a.fkEncargado?.lastName}`;
    return `${encName} (${encId})`;
  }));
  console.log('👥 Lista de encargados disponibles:', encargadosDisponibles.map(e => `${e.firstName} ${e.lastName} (${e._id})`));

  // Encargados que se pueden eliminar (todos, pero debe quedar al menos uno)
  const encargadosRemovibles = encargadosAsignados;

  // Mutación para agregar encargado
  const addEncargadoMutation = useMutation({
    mutationFn: async (encargadoId: string) => {
      return await reclamosService.addEncargado(reclamo._id, encargadoId);
    },
    onSuccess: () => {
      toast.success('El encargado ha sido añadido exitosamente al reclamo.');
      queryClient.invalidateQueries({ queryKey: ['reclamo-encargados', reclamo._id] });
      queryClient.invalidateQueries({ queryKey: ['reclamos'] });
      queryClient.invalidateQueries({ queryKey: ['historial', reclamo._id] });
      setSelectedEncargadoToAdd('');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'No se pudo añadir el encargado.');
    },
  });

  // Mutación para eliminar encargado
  const removeEncargadoMutation = useMutation({
    mutationFn: async (encargadoId: string) => {
      return await reclamosService.removeEncargado(reclamo._id, encargadoId);
    },
    onSuccess: () => {
      toast.success('El encargado ha sido eliminado exitosamente del reclamo.');
      queryClient.invalidateQueries({ queryKey: ['reclamo-encargados', reclamo._id] });
      queryClient.invalidateQueries({ queryKey: ['reclamos'] });
      queryClient.invalidateQueries({ queryKey: ['historial', reclamo._id] });
      setSelectedEncargadoToRemove('');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'No se pudo eliminar el encargado.');
    },
  });

  const handleAddEncargado = () => {
    if (!selectedEncargadoToAdd) {
      toast.error('Por favor selecciona un encargado para añadir.');
      return;
    }
    addEncargadoMutation.mutate(selectedEncargadoToAdd);
  };

  const handleRemoveEncargado = () => {
    if (!selectedEncargadoToRemove) {
      toast.error('Por favor selecciona un encargado para eliminar.');
      return;
    }
    removeEncargadoMutation.mutate(selectedEncargadoToRemove);
  };

  const isLoading = isLoadingAsignados || isLoadingEncargados;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Gestionar encargados del reclamo</DialogTitle>
          <DialogDescription>
            {isAssigned 
              ? 'Puedes añadir o eliminar encargados de tu misma área. Debe quedar al menos un encargado asignado.'
              : 'Solo los encargados asignados pueden gestionar los encargados de este reclamo.'}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-6">
            {/* Encargados actuales */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Encargados asignados</h3>
              {isLoading ? (
                <div className="flex items-center justify-center p-4">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : encargadosAsignados.length === 0 ? (
                <p className="text-sm text-muted-foreground">No hay encargados asignados.</p>
              ) : (
                <div className="space-y-2">
                  {encargadosAsignados.map((asignacion) => (
                    <Card key={asignacion._id} className="p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div>
                            <p className="font-medium">
                              {asignacion.fkEncargado.firstName} {asignacion.fkEncargado.lastName}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {asignacion.fkEncargado.email}
                            </p>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {isAssigned && (
              <>
                <Separator />

                {/* Añadir encargado */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Añadir Encargado</h3>
                  {encargadosDisponibles.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No hay más encargados disponibles de esta área.
                    </p>
                  ) : (
                    <div className="flex gap-2">
                      <Select
                        value={selectedEncargadoToAdd}
                        onValueChange={setSelectedEncargadoToAdd}
                        disabled={addEncargadoMutation.isPending}
                      >
                        <SelectTrigger className="flex-1">
                          <SelectValue placeholder="Selecciona un encargado" />
                        </SelectTrigger>
                        <SelectContent>
                          {encargadosDisponibles.map((enc) => (
                            <SelectItem key={enc._id} value={enc._id}>
                              {enc.firstName} {enc.lastName} - {enc.email}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        onClick={handleAddEncargado}
                        disabled={!selectedEncargadoToAdd || addEncargadoMutation.isPending}
                      >
                        {addEncargadoMutation.isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            <UserPlus className="h-4 w-4 mr-2" />
                            Añadir
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </div>

                <Separator />

                {/* Eliminar encargado */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Eliminar Encargado</h3>
                  {encargadosRemovibles.length <= 1 ? (
                    <p className="text-sm text-muted-foreground">
                      No se puede eliminar el último encargado. Debe quedar al menos uno asignado al reclamo.
                    </p>
                  ) : (
                    <div className="flex gap-2">
                      <Select
                        value={selectedEncargadoToRemove}
                        onValueChange={setSelectedEncargadoToRemove}
                        disabled={removeEncargadoMutation.isPending}
                      >
                        <SelectTrigger className="flex-1">
                          <SelectValue placeholder="Selecciona un encargado" />
                        </SelectTrigger>
                        <SelectContent>
                          {encargadosRemovibles.map((asig) => (
                            <SelectItem key={asig._id} value={asig.fkEncargado._id}>
                              {asig.fkEncargado.firstName} {asig.fkEncargado.lastName} - {asig.fkEncargado.email}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        onClick={handleRemoveEncargado}
                        disabled={!selectedEncargadoToRemove || removeEncargadoMutation.isPending}
                        variant="destructive"
                      >
                        {removeEncargadoMutation.isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            <UserMinus className="h-4 w-4 mr-2" />
                            Eliminar
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </ScrollArea>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

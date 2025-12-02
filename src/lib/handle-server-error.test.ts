import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AxiosError } from 'axios';
import { handleServerError } from './handle-server-error';
import { toast } from 'sonner';

// Mock del módulo sonner
vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
  },
}));

describe('handleServerError - Manejo centralizado de errores del servidor', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  // CASO 1: Manejo especial de status 204
  describe('Status 204 No Content', () => {
    it('debería mostrar "Content not found." cuando status es 204', () => {
      const error = { status: 204 };
      handleServerError(error);
      expect(toast.error).toHaveBeenCalledWith('Content not found.');
    });

    it('debería priorizar status 204 sobre otros campos', () => {
      const error = { status: 204, message: 'Other message' };
      handleServerError(error);
      expect(toast.error).toHaveBeenCalledWith('Content not found.');
    });
  });

  // CASO 2: Error de Axios con response.data.title
  describe('Errores de Axios con title en response.data', () => {
    it('debería mostrar response.data.title cuando existe', () => {
      const axiosError = new AxiosError(
        'Request failed',
        'ERR_BAD_REQUEST',
        {} as any,
        {} as any,
        {
          data: { title: 'Usuario no encontrado' },
          status: 404,
          statusText: 'Not Found',
          headers: {},
          config: {} as any,
        }
      );

      handleServerError(axiosError);
      expect(toast.error).toHaveBeenCalledWith('Usuario no encontrado');
    });

    it('debería manejar diferentes códigos de estado con title', () => {
      const scenarios = [
        { status: 400, title: 'Datos inválidos' },
        { status: 401, title: 'No autorizado' },
        { status: 403, title: 'Acceso denegado' },
        { status: 404, title: 'Recurso no encontrado' },
        { status: 500, title: 'Error interno' },
      ];

      scenarios.forEach(({ status, title }) => {
        vi.clearAllMocks();
        const axiosError = new AxiosError(
          'Request failed',
          'ERR',
          {} as any,
          {} as any,
          {
            data: { title },
            status,
            statusText: '',
            headers: {},
            config: {} as any,
          }
        );
        handleServerError(axiosError);
        expect(toast.error).toHaveBeenCalledWith(title);
      });
    });
  });

  // CASO 3: Errores sin title (fallback a mensaje por defecto)
  describe('Fallback a mensaje por defecto', () => {
    it('debería usar "Something went wrong!" cuando no hay title', () => {
      const axiosError = new AxiosError(
        'Request failed',
        'ERR',
        {} as any,
        {} as any,
        {
          data: {},
          status: 500,
          statusText: '',
          headers: {},
          config: {} as any,
        }
      );

      handleServerError(axiosError);
      expect(toast.error).toHaveBeenCalledWith(undefined);
    });

    it('debería usar mensaje por defecto para errores no-Axios', () => {
      handleServerError(new Error('Standard error'));
      expect(toast.error).toHaveBeenCalledWith('Something went wrong!');
    });

    it('debería usar mensaje por defecto para valores primitivos', () => {
      handleServerError('error string');
      expect(toast.error).toHaveBeenCalledWith('Something went wrong!');
    });

    it('debería usar mensaje por defecto para null', () => {
      handleServerError(null);
      expect(toast.error).toHaveBeenCalledWith('Something went wrong!');
    });

    it('debería usar mensaje por defecto para undefined', () => {
      handleServerError(undefined);
      expect(toast.error).toHaveBeenCalledWith('Something went wrong!');
    });
  });

  // CASO 4: Logging de errores
  describe('Logging de errores', () => {
    it('debería llamar a console.log con el error', () => {
      const error = new Error('Test error');
      handleServerError(error);
      expect(console.log).toHaveBeenCalledWith(error);
    });

    it('debería hacer log de cualquier tipo de error', () => {
      const errors = [
        new Error('JS Error'),
        new AxiosError('Axios Error'),
        'string error',
        { custom: 'error' },
      ];

      errors.forEach(error => {
        vi.clearAllMocks();
        handleServerError(error);
        expect(console.log).toHaveBeenCalledWith(error);
      });
    });
  });

  // CASO 5: Invocación única de toast
  describe('Invocación de toast.error', () => {
    it('debería llamar a toast.error exactamente una vez', () => {
      handleServerError(new Error('test'));
      expect(toast.error).toHaveBeenCalledTimes(1);
    });

    it('no debería llamar a toast múltiples veces en ningún escenario', () => {
      const scenarios = [
        { status: 204 },
        new AxiosError('err', 'ERR', {} as any, {} as any, {
          data: { title: 'Test' },
          status: 400,
          statusText: '',
          headers: {},
          config: {} as any,
        }),
        new Error('error'),
        'string',
      ];

      scenarios.forEach(error => {
        vi.clearAllMocks();
        handleServerError(error);
        expect(toast.error).toHaveBeenCalledTimes(1);
      });
    });
  });
});

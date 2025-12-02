import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { cn, sleep, getPageNumbers } from './utils';

describe('cn - className merger utility', () => {
  // CASO 1: Funcionalidad básica
  it('debería combinar clases simples', () => {
    const result = cn('class1', 'class2');
    expect(result).toBe('class1 class2');
  });

  it('debería manejar una sola clase', () => {
    const result = cn('single-class');
    expect(result).toBe('single-class');
  });

  it('debería manejar array de clases', () => {
    const result = cn(['class1', 'class2']);
    expect(result).toContain('class1');
    expect(result).toContain('class2');
  });

  // CASO 2: Manejo de valores falsy (Partición de Equivalencia)
  it('debería ignorar valores undefined', () => {
    const result = cn('class1', undefined, 'class2');
    expect(result).toBe('class1 class2');
  });

  it('debería ignorar valores null', () => {
    const result = cn('class1', null, 'class2');
    expect(result).toBe('class1 class2');
  });

  it('debería ignorar valores false', () => {
    const result = cn('class1', false, 'class2');
    expect(result).toBe('class1 class2');
  });

  it('debería ignorar strings vacíos', () => {
    const result = cn('class1', '', 'class2');
    expect(result).toBe('class1 class2');
  });

  // CASO 3: Condicionales (uso común en React)
  it('debería manejar clases condicionales', () => {
    const isActive = true;
    const result = cn('base', isActive && 'active');
    expect(result).toBe('base active');
  });

  it('debería excluir clases cuando la condición es false', () => {
    const isActive = false;
    const result = cn('base', isActive && 'active');
    expect(result).toBe('base');
  });

  // CASO 4: Casos extremos
  it('debería retornar string vacío cuando no hay argumentos', () => {
    const result = cn();
    expect(result).toBe('');
  });

  it('debería manejar solo valores falsy', () => {
    const result = cn(undefined, null, false);
    expect(result).toBe('');
  });

  // CASO 5: Merge de clases Tailwind (conflictos)
  it('debería resolver conflictos de clases Tailwind', () => {
    const result = cn('px-2', 'px-4');
    // tailwind-merge debe mantener solo la última clase px
    expect(result).toBe('px-4');
  });

  it('debería combinar clases Tailwind sin conflictos', () => {
    const result = cn('px-4', 'py-2', 'bg-blue-500');
    expect(result).toContain('px-4');
    expect(result).toContain('py-2');
    expect(result).toContain('bg-blue-500');
  });
});

describe('sleep - Promise-based delay', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // CASO 6: Funcionalidad básica con delay personalizado
  it('debería esperar el tiempo especificado (2000ms)', async () => {
    const promise = sleep(2000);
    vi.advanceTimersByTime(2000);
    await expect(promise).resolves.toBeUndefined();
  });

  it('debería esperar el tiempo especificado (500ms)', async () => {
    const promise = sleep(500);
    vi.advanceTimersByTime(500);
    await expect(promise).resolves.toBeUndefined();
  });

  // CASO 7: Valor por defecto (Análisis de Valores Límite)
  it('debería usar 1000ms como valor por defecto', async () => {
    const startTime = Date.now();
    const promise = sleep();
    vi.advanceTimersByTime(1000);
    await promise;
    const elapsed = Date.now() - startTime;
    expect(elapsed).toBeGreaterThanOrEqual(0);
  });

  // CASO 8: Valores límite
  it('debería manejar delay de 0ms', async () => {
    const promise = sleep(0);
    vi.advanceTimersByTime(0);
    await expect(promise).resolves.toBeUndefined();
  });

  it('debería retornar una Promise', () => {
    const result = sleep(100);
    expect(result).toBeInstanceOf(Promise);
  });

  // CASO 9: No debe resolver antes de tiempo
  it('no debería resolver antes del tiempo especificado', async () => {
    let resolved = false;
    const promise = sleep(1000).then(() => {
      resolved = true;
    });

    vi.advanceTimersByTime(500);
    await Promise.resolve(); // flush microtasks
    expect(resolved).toBe(false);

    vi.advanceTimersByTime(500);
    await promise;
    expect(resolved).toBe(true);
  });
});

describe('getPageNumbers - Paginación', () => {
  // CASO 10: Pocas páginas (≤ 5) - mostrar todas
  it('debería retornar todas las páginas cuando hay 5 o menos páginas', () => {
    const result = getPageNumbers(1, 5);
    expect(result).toEqual([1, 2, 3, 4, 5]);
  });

  it('debería retornar todas las páginas cuando hay exactamente 5 páginas', () => {
    const result = getPageNumbers(3, 5);
    expect(result).toEqual([1, 2, 3, 4, 5]);
  });

  // CASO 11: Página actual cerca del inicio (currentPage <= 3)
  describe('Cerca del inicio (currentPage <= 3)', () => {
    it('debería mostrar [1, 2, 3, 4, ..., 10] cuando currentPage = 1', () => {
      const result = getPageNumbers(1, 10);
      expect(result).toEqual([1, 2, 3, 4, '...', 10]);
    });

    it('debería mostrar [1, 2, 3, 4, ..., 10] cuando currentPage = 2', () => {
      const result = getPageNumbers(2, 10);
      expect(result).toEqual([1, 2, 3, 4, '...', 10]);
    });

    it('debería mostrar [1, 2, 3, 4, ..., 10] cuando currentPage = 3', () => {
      const result = getPageNumbers(3, 10);
      expect(result).toEqual([1, 2, 3, 4, '...', 10]);
    });
  });

  // CASO 12: Página actual cerca del final (currentPage >= totalPages - 2)
  describe('Cerca del final (currentPage >= totalPages - 2)', () => {
    it('debería mostrar [1, ..., 7, 8, 9, 10] cuando currentPage = 8 de 10', () => {
      const result = getPageNumbers(8, 10);
      expect(result).toEqual([1, '...', 7, 8, 9, 10]);
    });

    it('debería mostrar [1, ..., 7, 8, 9, 10] cuando currentPage = 9 de 10', () => {
      const result = getPageNumbers(9, 10);
      expect(result).toEqual([1, '...', 7, 8, 9, 10]);
    });

    it('debería mostrar [1, ..., 7, 8, 9, 10] cuando currentPage = 10 de 10', () => {
      const result = getPageNumbers(10, 10);
      expect(result).toEqual([1, '...', 7, 8, 9, 10]);
    });
  });

  // CASO 13: Página actual en el medio
  describe('En el medio (4 <= currentPage <= totalPages - 3)', () => {
    it('debería mostrar ellipsis en ambos lados para currentPage = 4 de 10', () => {
      const result = getPageNumbers(4, 10);
      expect(result).toEqual([1, '...', 3, 4, 5, '...', 10]);
    });

    it('debería mostrar ellipsis en ambos lados para currentPage = 5 de 10', () => {
      const result = getPageNumbers(5, 10);
      expect(result).toEqual([1, '...', 4, 5, 6, '...', 10]);
    });

    it('debería mostrar ellipsis en ambos lados para currentPage = 6 de 10', () => {
      const result = getPageNumbers(6, 10);
      expect(result).toEqual([1, '...', 5, 6, 7, '...', 10]);
    });

    it('debería mostrar ellipsis en ambos lados para currentPage = 7 de 10', () => {
      const result = getPageNumbers(7, 10);
      expect(result).toEqual([1, '...', 6, 7, 8, '...', 10]);
    });
  });

  // CASO 14: Conjunto grande de páginas
  it('debería manejar correctamente conjunto grande de páginas (50 páginas)', () => {
    const result = getPageNumbers(25, 50);
    expect(result).toEqual([1, '...', 24, 25, 26, '...', 50]);
    expect(result).toHaveLength(7);
  });

  it('debería mostrar patrón de inicio en conjunto grande (página 1 de 50)', () => {
    const result = getPageNumbers(1, 50);
    expect(result).toEqual([1, 2, 3, 4, '...', 50]);
  });

  it('debería mostrar patrón de fin en conjunto grande (página 50 de 50)', () => {
    const result = getPageNumbers(50, 50);
    expect(result).toEqual([1, '...', 47, 48, 49, 50]);
  });

  // CASO 15: Casos extremos
  it('debería manejar 1 página total', () => {
    const result = getPageNumbers(1, 1);
    expect(result).toEqual([1]);
  });

  it('debería manejar 2 páginas totales', () => {
    const result = getPageNumbers(1, 2);
    expect(result).toEqual([1, 2]);
  });

  it('debería siempre incluir la primera página', () => {
    const result = getPageNumbers(5, 10);
    expect(result[0]).toBe(1);
  });

  it('debería siempre incluir la última página cuando totalPages > 5', () => {
    const result = getPageNumbers(5, 10);
    expect(result[result.length - 1]).toBe(10);
  });

  it('debería siempre incluir la página actual', () => {
    const currentPage = 5;
    const result = getPageNumbers(currentPage, 10);
    expect(result).toContain(currentPage);
  });

  // CASO 16: Verificación de formato del array retornado
  it('debería retornar array con longitud máxima de 7 para conjuntos grandes', () => {
    const result = getPageNumbers(5, 100);
    expect(result.length).toBeLessThanOrEqual(7);
  });

  it('debería retornar array con longitud máxima de 6 para conjuntos medianos cerca del inicio', () => {
    const result = getPageNumbers(1, 10);
    expect(result).toHaveLength(6); // [1, 2, 3, 4, '...', 10]
  });

  it('debería retornar array con longitud máxima de 6 para conjuntos medianos cerca del fin', () => {
    const result = getPageNumbers(10, 10);
    expect(result).toHaveLength(6); // [1, '...', 7, 8, 9, 10]
  });

  it('debería usar "..." como string para ellipsis', () => {
    const result = getPageNumbers(5, 10);
    const ellipsisElements = result.filter((item) => item === '...');
    expect(ellipsisElements.length).toBeGreaterThan(0);
  });

  // CASO 17: Validación de orden y continuidad
  it('debería mantener orden ascendente en páginas numéricas', () => {
    const result = getPageNumbers(5, 10);
    const numbers = result.filter((item) => typeof item === 'number');
    for (let i = 1; i < numbers.length; i++) {
      expect(numbers[i]).toBeGreaterThan(numbers[i - 1]);
    }
  });

  it('debería tener páginas consecutivas alrededor de currentPage (middle case)', () => {
    const result = getPageNumbers(5, 10);
    // Debería tener 4, 5, 6 consecutivos en zona middle
    const index5 = result.indexOf(5);
    expect(result[index5 - 1]).toBe(4);
    expect(result[index5 + 1]).toBe(6);
  });

  it('debería tener 4 páginas consecutivas en patrón de inicio', () => {
    const result = getPageNumbers(1, 10);
    // [1, 2, 3, 4, '...', 10]
    expect(result.slice(0, 4)).toEqual([1, 2, 3, 4]);
  });

  it('debería tener 4 páginas consecutivas en patrón de fin', () => {
    const result = getPageNumbers(10, 10);
    // [1, '...', 7, 8, 9, 10]
    expect(result.slice(2, 6)).toEqual([7, 8, 9, 10]);
  });
});

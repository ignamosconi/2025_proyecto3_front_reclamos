import { describe, it, expect } from 'vitest';
import { validatePassword, formatPasswordErrors } from './validate-password';

describe('validatePassword', () => {
  // CASO 1: Contraseña válida
  describe('Contraseñas válidas', () => {
    it('debería aceptar contraseña que cumple todos los requisitos', () => {
      const errors = validatePassword('Zx9!mNp2@');
      expect(errors).toHaveLength(0);
    });

    it('debería aceptar contraseña larga y compleja', () => {
      const errors = validatePassword('A1b@C3d$E5f&G7h*');
      expect(errors).toHaveLength(0);
    });
  });

  // CASO 2: Validación de longitud (Análisis de Valores Límite)
  describe('Validación de longitud mínima', () => {
    it('debería rechazar contraseña con menos de 8 caracteres', () => {
      const errors = validatePassword('Abc12!');
      expect(errors.some(e => e.field === 'length')).toBe(true);
    });

    it('debería aceptar contraseña con exactamente 8 caracteres', () => {
      const errors = validatePassword('Abc123!@');
      expect(errors.some(e => e.field === 'length')).toBe(false);
    });
  });

  // CASO 3: Validación de mayúsculas (Partición de Equivalencia)
  describe('Validación de mayúsculas', () => {
    it('debería rechazar contraseña sin mayúsculas', () => {
      const errors = validatePassword('zx9!mnp2@');
      expect(errors.some(e => e.field === 'uppercase')).toBe(true);
    });

    it('debería aceptar contraseña con mayúscula', () => {
      const errors = validatePassword('Zx9!mNp2@');
      expect(errors.some(e => e.field === 'uppercase')).toBe(false);
    });
  });

  // CASO 4: Validación de minúsculas (Partición de Equivalencia)
  describe('Validación de minúsculas', () => {
    it('debería rechazar contraseña sin minúsculas', () => {
      const errors = validatePassword('ZX9!MNP2@');
      expect(errors.some(e => e.field === 'lowercase')).toBe(true);
    });

    it('debería aceptar contraseña con minúscula', () => {
      const errors = validatePassword('Zx9!mNp2@');
      expect(errors.some(e => e.field === 'lowercase')).toBe(false);
    });
  });

  // CASO 5: Validación de números (Partición de Equivalencia)
  describe('Validación de números', () => {
    it('debería rechazar contraseña sin números', () => {
      const errors = validatePassword('Zxmnp@!#');
      expect(errors.some(e => e.field === 'number')).toBe(true);
    });

    it('debería aceptar contraseña con números', () => {
      const errors = validatePassword('Zx9!mNp2@');
      expect(errors.some(e => e.field === 'number')).toBe(false);
    });
  });

  // CASO 6: Validación de caracteres especiales (Partición de Equivalencia)
  describe('Validación de caracteres especiales', () => {
    it('debería rechazar contraseña sin caracteres especiales', () => {
      const errors = validatePassword('Zx9mNp2K');
      expect(errors.some(e => e.field === 'special')).toBe(true);
    });

    it('debería aceptar contraseña con caracteres especiales', () => {
      const errors = validatePassword('Zx9!mNp2@');
      expect(errors.some(e => e.field === 'special')).toBe(false);
    });
  });

  // CASO 7: Detección de patrones débiles (Tabla de Decisión)
  describe('Detección de patrones débiles', () => {
    it('debería rechazar contraseña con "password"', () => {
      const errors = validatePassword('Password123!');
      expect(errors.some(e => e.field === 'weak')).toBe(true);
    });

    it('debería rechazar contraseña con "123456"', () => {
      const errors = validatePassword('Abc123456!');
      expect(errors.some(e => e.field === 'weak')).toBe(true);
    });

    it('debería rechazar contraseña con "qwerty"', () => {
      const errors = validatePassword('Qwerty123!');
      expect(errors.some(e => e.field === 'weak')).toBe(true);
    });

    it('debería rechazar contraseña con "abc123"', () => {
      const errors = validatePassword('Abc123!@#');
      expect(errors.some(e => e.field === 'weak')).toBe(true);
    });

    it('debería rechazar contraseña con "admin"', () => {
      const errors = validatePassword('Admin12345!');
      expect(errors.some(e => e.field === 'weak')).toBe(true);
    });
  });

  // CASO 8: Validación de datos personales (Tabla de Decisión)
  describe('Validación de datos personales', () => {
    it('debería rechazar contraseña que contiene firstName', () => {
      const errors = validatePassword('John123!@', { firstName: 'John' });
      expect(errors.some(e => e.field === 'weak')).toBe(true);
    });

    it('debería rechazar contraseña que contiene lastName', () => {
      const errors = validatePassword('Smith123!@', { lastName: 'Smith' });
      expect(errors.some(e => e.field === 'weak')).toBe(true);
    });

    it('debería aceptar contraseña sin datos personales', () => {
      const errors = validatePassword('M7k$pQx9!', {
        email: 'user@example.com',
        firstName: 'John',
        lastName: 'Smith',
      });
      expect(errors.some(e => e.field === 'weak')).toBe(false);
    });

    it('debería verificar datos personales de forma case-insensitive', () => {
      const errors = validatePassword('john123!@', { firstName: 'John' });
      expect(errors.some(e => e.field === 'weak')).toBe(true);
    });
  });

  // CASO 9: Múltiples errores
  describe('Contraseñas con múltiples errores', () => {
    it('debería retornar múltiples errores para contraseña muy débil', () => {
      const errors = validatePassword('abc');
      expect(errors.length).toBeGreaterThan(1);
      expect(errors.some(e => e.field === 'length')).toBe(true);
      expect(errors.some(e => e.field === 'uppercase')).toBe(true);
      expect(errors.some(e => e.field === 'number')).toBe(true);
      expect(errors.some(e => e.field === 'special')).toBe(true);
    });
  });
});

describe('formatPasswordErrors', () => {
  // CASO 10: Formateo de mensajes
  it('debería retornar string vacío cuando no hay errores', () => {
    const formatted = formatPasswordErrors([]);
    expect(formatted).toBe('');
  });

  it('debería formatear un solo error sin numeración', () => {
    const errors = [
      { field: 'length', message: 'La contraseña debe tener al menos 8 caracteres.' }
    ];
    const formatted = formatPasswordErrors(errors);
    expect(formatted).toBe('La contraseña debe tener al menos 8 caracteres.');
  });

  it('debería formatear múltiples errores con numeración', () => {
    const errors = [
      { field: 'length', message: 'La contraseña debe tener al menos 8 caracteres.' },
      { field: 'uppercase', message: 'La contraseña debe contener al menos una letra mayúscula.' },
    ];
    const formatted = formatPasswordErrors(errors);
    expect(formatted).toContain('1.');
    expect(formatted).toContain('2.');
    expect(formatted.split('\n')).toHaveLength(2);
  });
});

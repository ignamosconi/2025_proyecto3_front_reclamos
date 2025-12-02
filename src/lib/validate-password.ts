/**
 * Validación de contraseña que devuelve todos los errores encontrados
 * Basado en las reglas del backend validatePasswordStrength
 */

export interface PasswordValidationError {
  field: string;
  message: string;
}

export function validatePassword(
  password: string,
  options?: {
    email?: string;
    firstName?: string;
    lastName?: string;
  }
): PasswordValidationError[] {
  const errors: PasswordValidationError[] = [];
  const minLength = 8;

  // Reglas básicas de formato
  if (password.length < minLength) {
    errors.push({
      field: 'length',
      message: `La contraseña debe tener al menos ${minLength} caracteres.`,
    });
  }

  if (!/[A-Z]/.test(password)) {
    errors.push({
      field: 'uppercase',
      message: 'La contraseña debe contener al menos una letra mayúscula.',
    });
  }

  if (!/[a-z]/.test(password)) {
    errors.push({
      field: 'lowercase',
      message: 'La contraseña debe contener al menos una letra minúscula.',
    });
  }

  if (!/\d/.test(password)) {
    errors.push({
      field: 'number',
      message: 'La contraseña debe contener al menos un número.',
    });
  }

  if (!/[!@#$%^&*(),.?":{}|<>_\-+=/\\[\]~`]/.test(password)) {
    errors.push({
      field: 'special',
      message: 'La contraseña debe contener al menos un carácter especial.',
    });
  }

  // Patrones débiles comunes
  const defaultWeakPatterns = [
    'password',
    '123456',
    'qwerty',
    'abc123',
    'letmein',
    'welcome',
    'admin',
  ];

  // Si se proporcionan datos del usuario, agregarlos a los patrones débiles
  const weakPatterns = [...defaultWeakPatterns];
  if (options?.email) {
    weakPatterns.push(options.email.toLowerCase());
  }
  if (options?.firstName) {
    weakPatterns.push(options.firstName.toLowerCase());
  }
  if (options?.lastName) {
    weakPatterns.push(options.lastName.toLowerCase());
  }

  // Verificar si la contraseña contiene un patrón débil
  const lowerPassword = password.toLowerCase();
  for (const pattern of weakPatterns) {
    if (pattern && lowerPassword.includes(pattern)) {
      errors.push({
        field: 'weak',
        message: `La contraseña no debe contener patrones comunes o datos personales (como "${pattern}").`,
      });
      break; // Solo mostrar el primer patrón débil encontrado
    }
  }

  return errors;
}

/**
 * Formatea los errores de validación de contraseña en un solo mensaje
 */
export function formatPasswordErrors(errors: PasswordValidationError[]): string {
  if (errors.length === 0) return '';
  if (errors.length === 1) return errors[0].message;
  
  return errors.map((error, index) => `${index + 1}. ${error.message}`).join('\n');
}

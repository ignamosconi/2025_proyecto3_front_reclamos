# Implementación del Flujo de Restablecimiento de Contraseña

## Archivos Creados

### 1. `/src/lib/validate-password.ts`
Helper para validación de contraseñas que implementa todas las reglas del backend:
- Mínimo 8 caracteres
- Al menos una mayúscula
- Al menos una minúscula
- Al menos un número
- Al menos un carácter especial
- No debe contener patrones débiles o datos personales

**Funciones exportadas:**
- `validatePassword(password, options?)`: Retorna array de errores encontrados
- `formatPasswordErrors(errors)`: Formatea los errores en un solo mensaje multi-línea

### 2. `/src/features/auth/reset-password/components/reset-password-form.tsx`
Formulario para ingresar la nueva contraseña con:
- Validación completa usando el helper `validate-password`
- Muestra todos los errores de validación juntos
- Campos: nueva contraseña y confirmación
- Manejo de errores del backend (token expirado, inválido, etc.)
- Redirección automática al login después del éxito

### 3. `/src/features/auth/reset-password/index.tsx`
Página principal del reset de contraseña:
- Valida que exista el token en los query params
- Muestra error si no hay token o es inválido
- Renderiza el formulario cuando el token es válido
- Links de navegación (volver a solicitar enlace, ir al login)

### 4. `/src/routes/(auth)/reset-password.tsx`
Archivo de ruta de TanStack Router:
- Define la ruta `/(auth)/reset-password`
- Schema de validación para query params (token)
- Pasa el token como prop al componente

## Archivos Modificados

### 1. `/src/features/auth/forgot-password/components/forgot-password-form.tsx`
Mejoras:
- Eliminado console.log
- Agregado try-catch para mejor manejo de errores
- Mejores mensajes de toast con descripción
- Usa finally para setIsLoading

### 2. `/src/features/auth/sign-up/components/sign-up-form.tsx`
Mejoras:
- Ahora usa el helper `validate-password` para validación consistente
- Muestra todos los errores de contraseña juntos (igual que reset-password)
- Valida patrones débiles y datos personales
- Clase `whitespace-pre-line` en FormMessage para mostrar errores multi-línea

## Flujo de Usuario

### Paso 1: Olvidó contraseña
1. Usuario va a `/forgot-password`
2. Ingresa su email
3. Backend envía email con enlace formato: `http://tu-dominio/reset-password?token=xxx`

### Paso 2: Reset contraseña
1. Usuario hace clic en el enlace del email
2. Es redirigido a `/reset-password?token=xxx`
3. Si token es válido, muestra formulario
4. Usuario ingresa nueva contraseña (debe cumplir todos los requisitos)
5. Se muestran todos los errores de validación juntos
6. Al enviar, se hace POST a `auth/reset-password` con:
   ```json
   {
     "token": "c8737d2479183629023dcd2f4e608fb5d9fc976591beb9d7b4256a4b936a0f42",
     "password": "miNuevapwdUtn123!"
   }
   ```
7. Si es exitoso, se redirige a `/sign-in`

## Características Implementadas

✅ **Validación de contraseña reutilizable**
- Mismo código de validación para register y reset-password
- Muestra todos los errores juntos (no uno a uno)

✅ **Manejo de tokens**
- Token se obtiene de query params
- Validación de existencia del token
- Mensajes específicos para token expirado/inválido

✅ **UX mejorada**
- Mensajes claros y descriptivos
- Toast notifications con título y descripción
- Redirección automática tras éxito
- Formulario disabled durante carga

✅ **Compatibilidad con backend**
- Usa el mismo endpoint `POST auth/reset-password`
- Formato de request idéntico al requerido
- Token expira en 1 hora (manejado por backend)

## Para Probar

1. Ir a `/forgot-password` e ingresar email
2. Revisar email (o logs del backend para obtener el token)
3. Visitar `/reset-password?token=TU_TOKEN_AQUI`
4. Ingresar contraseña que cumpla requisitos
5. Verificar redirección a login

## Requisitos de Contraseña

La contraseña debe cumplir con:
- ✓ Mínimo 8 caracteres
- ✓ Al menos 1 mayúscula
- ✓ Al menos 1 minúscula
- ✓ Al menos 1 número
- ✓ Al menos 1 carácter especial (!@#$%^&*...)
- ✓ No contener patrones comunes (password, 123456, qwerty, etc.)
- ✓ No contener datos personales (email, nombre, apellido)

Todos estos errores se muestran simultáneamente al usuario para que sepa exactamente qué debe corregir.

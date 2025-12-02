# Email Template Reference

## Reset Password Email

El email que el backend debe enviar debe contener una URL del frontend con el token como query parameter:

### URL Format
```
http://tu-dominio-frontend.com/reset-password?token={GENERATED_TOKEN}
```

### Email Template Example (HTML)

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Restablecer Contraseña</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2>Restablecer tu contraseña</h2>
        
        <p>Hola,</p>
        
        <p>Recibimos una solicitud para restablecer la contraseña de tu cuenta.</p>
        
        <p>Para crear una nueva contraseña, haz clic en el siguiente botón:</p>
        
        <div style="text-align: center; margin: 30px 0;">
            <a href="http://localhost:5173/reset-password?token={{TOKEN}}" 
               style="background-color: #007bff; color: white; padding: 12px 30px; 
                      text-decoration: none; border-radius: 5px; display: inline-block;">
                Restablecer Contraseña
            </a>
        </div>
        
        <p>O copia y pega el siguiente enlace en tu navegador:</p>
        <p style="word-break: break-all; color: #007bff;">
            http://localhost:5173/reset-password?token={{TOKEN}}
        </p>
        
        <p><strong>Este enlace expirará en 1 hora.</strong></p>
        
        <p>Si no solicitaste restablecer tu contraseña, puedes ignorar este correo de forma segura.</p>
        
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
        
        <p style="font-size: 12px; color: #666;">
            Este es un correo automático, por favor no respondas a este mensaje.
        </p>
    </div>
</body>
</html>
```

### Email Template Example (Plain Text)

```text
Restablecer tu contraseña

Hola,

Recibimos una solicitud para restablecer la contraseña de tu cuenta.

Para crear una nueva contraseña, visita el siguiente enlace:

http://localhost:5173/reset-password?token={{TOKEN}}

Este enlace expirará en 1 hora.

Si no solicitaste restablecer tu contraseña, puedes ignorar este correo de forma segura.

---
Este es un correo automático, por favor no respondas a este mensaje.
```

## Backend Implementation Notes

### En el servicio de mailer (NestJS)

El backend debería:

1. Generar un token único y seguro
2. Guardar el token en la BD con timestamp de expiración (1 hora)
3. Enviar email con la URL del frontend + token
4. El enlace debe apuntar al frontend, no al backend

### Ejemplo de código backend (reference)

```typescript
// En auth.service.ts o similar

async forgotPassword(email: string) {
  const user = await this.usersService.findByEmail(email);
  
  if (!user) {
    // Por seguridad, no revelar si el email existe o no
    return { message: 'Si el correo existe, recibirás un enlace de recuperación' };
  }

  // Generar token seguro
  const token = crypto.randomBytes(32).toString('hex');
  
  // Guardar token con expiración de 1 hora
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 1);
  
  await this.usersService.savePasswordResetToken(user.id, token, expiresAt);
  
  // Construir URL del frontend
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
  
  // Enviar email
  await this.mailerService.sendPasswordReset(user.email, resetUrl);
  
  return { message: 'Si el correo existe, recibirás un enlace de recuperación' };
}
```

### Variables de entorno necesarias

```env
# .env
FRONTEND_URL=http://localhost:5173
# o en producción:
# FRONTEND_URL=https://tu-dominio.com
```

## Important Security Notes

1. **No revelar si el email existe**: Siempre retornar el mismo mensaje exitoso, independientemente de si el email está registrado

2. **Token único y seguro**: Usar `crypto.randomBytes()` o similar para generar tokens

3. **Expiración de tokens**: Los tokens deben expirar en 1 hora (ya implementado en backend)

4. **Un solo uso**: Los tokens deben invalidarse después de usarse

5. **Rate limiting**: Implementar límite de solicitudes para prevenir spam

## Testing the Email

Para testear durante desarrollo, puedes:

1. **Usar un servicio de email de prueba** como [Mailtrap](https://mailtrap.io/)

2. **Ver el token en los logs** del backend y construir la URL manualmente

3. **Usar variables de entorno** para cambiar entre localhost y producción:
   ```typescript
   const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
   const resetUrl = `${frontendUrl}/reset-password?token=${token}`;
   ```

## Production Considerations

### URL del frontend en producción

Actualizar la URL del frontend según el ambiente:

```typescript
// Development
const resetUrl = `http://localhost:5173/reset-password?token=${token}`;

// Production
const resetUrl = `https://tu-dominio.com/reset-password?token=${token}`;
```

### Ejemplo con variables de entorno

```typescript
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
const resetUrl = `${FRONTEND_URL}/reset-password?token=${token}`;
```

Configurar en `.env`:
```env
# Development
FRONTEND_URL=http://localhost:5173

# Production
FRONTEND_URL=https://tu-dominio.com
```

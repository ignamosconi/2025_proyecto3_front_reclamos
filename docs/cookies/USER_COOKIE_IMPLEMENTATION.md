# Mejora en la Gestión de Datos de Usuario

## Cambios Realizados

### 1. **Auth Store** (`src/stores/auth-store.ts`)

#### Nueva cookie para datos de usuario
Se agregó una nueva constante para almacenar datos del usuario:
```typescript
const USER_DATA = 'user_data'
```

#### Modificaciones en `setUser`
Ahora cuando se establece un usuario, sus datos se guardan en una cookie:
```typescript
setUser: (user) => {
  if (!user) {
    // Removemos los datos del usuario de la cookie
    removeCookie(USER_DATA);
    set((state) => ({ ...state, auth: { ...state.auth, user: null } }));
    return;
  }
  
  // Convertimos el usuario y lo guardamos en cookie
  const authUser: AuthUser = { ... };
  setCookie(USER_DATA, JSON.stringify(authUser), 7 * 24 * 60 * 60); // 7 días
  
  set((state) => ({ ...state, auth: { ...state.auth, user: authUser } }));
}
```

#### Inicialización mejorada
Al iniciar la aplicación, primero intenta cargar los datos del usuario desde la cookie:
```typescript
// Primero intentamos obtener los datos completos del usuario desde la cookie
const userDataCookie = getCookie(USER_DATA);
if (userDataCookie) {
  try {
    initialUser = JSON.parse(userDataCookie);
  } catch (error) {
    console.error('Error parsing user data from cookie:', error);
  }
}

// Si no hay datos en cookie, los extraemos del token JWT
if (!initialUser && accessTokenCookie) {
  // ... lógica de decodificación del token
}
```

#### Limpieza en logout y reset
Todas las funciones que limpian el estado ahora también eliminan la cookie de usuario:
```typescript
resetTokens: () => {
  removeCookie(ACCESS_TOKEN);
  removeCookie(REFRESH_TOKEN);
  removeCookie(USER_DATA); // ✨ Nueva línea
  // ...
}

reset: () => {
  removeCookie(USER_DATA); // ✨ Nueva línea
  // ...
}

logout: () => {
  removeCookie(USER_DATA); // ✨ Nueva línea
  // ...
}
```

#### Actualización automática en setTokens
Cuando se establecen nuevos tokens y se decodifica el JWT, los datos del usuario también se guardan en cookie:
```typescript
const authUser: AuthUser = {
  email: decoded.email,
  role: decoded.role,
  exp: decoded.exp
};

// Guardamos los datos del usuario en cookie
setCookie(USER_DATA, JSON.stringify(authUser), 7 * 24 * 60 * 60); // ✨ Nueva línea
```

### 2. **NavUser Component** (`src/components/layout/nav-user.tsx`)

#### Migración de localStorage a auth store
**Antes:**
```typescript
const user = localStorage.getItem('user')
  ? JSON.parse(localStorage.getItem('user') || '{}')
  : { username: 'Sin Nombre', email: '<Email>', avatar: '<Avatar>' }
```

**Después:**
```typescript
const { auth } = useAuthStore()

// Obtenemos los datos del usuario desde el store
const userData = auth.user

// Construimos el objeto de usuario con valores por defecto
const user = {
  username: userData?.firstName && userData?.lastName 
    ? `${userData.firstName} ${userData.lastName}` 
    : userData?.email?.split('@')[0] || 'Sin Nombre',
  email: userData?.email || '<Email>',
  initials: userData?.firstName && userData?.lastName
    ? `${userData.firstName.charAt(0)}${userData.lastName.charAt(0)}`
    : userData?.email 
      ? userData.email.substring(0, 2).toUpperCase()
      : 'SN'
}
```

#### Mejoras en el avatar
Ahora muestra iniciales calculadas inteligentemente:
- Si hay `firstName` y `lastName`: Primera letra de cada uno (ej: "JD" para John Doe)
- Si solo hay email: Primeras 2 letras del email en mayúsculas
- Si no hay nada: "SN" (Sin Nombre)

**Uso en el código:**
```typescript
<AvatarFallback className='rounded-lg'>{user.initials}</AvatarFallback>
```

### 3. **App Sidebar** (`src/components/layout/app-sidebar.tsx`)

Eliminada la prop `user` ya que NavUser ahora obtiene los datos directamente del store:

**Antes:**
```typescript
<NavUser user={sidebarData.user} />
```

**Después:**
```typescript
<NavUser />
```

## Beneficios de los Cambios

### 1. **Persistencia Consistente**
- Los datos de usuario se guardan en cookies (no en localStorage)
- Consistente con el almacenamiento de tokens
- Los datos persisten durante 7 días

### 2. **Sincronización Automática**
- Cuando se actualiza el usuario en el store, automáticamente se guarda en cookie
- La UI siempre muestra los datos más recientes
- No hay necesidad de sincronización manual

### 3. **Código Más Limpio**
- NavUser es ahora más simple (no recibe props)
- Fuente única de verdad (auth store)
- Menos duplicación de lógica

### 4. **Mejor Experiencia de Usuario**
- Muestra nombre completo cuando está disponible
- Fallback inteligente a email si no hay nombre
- Iniciales calculadas automáticamente

### 5. **Seguridad**
- Cookies con duración limitada (7 días)
- Limpieza automática en logout
- Validación de datos antes de usar

## Flujo de Datos

### Login/Registro
1. Usuario se autentica
2. Backend retorna tokens + datos de usuario
3. `auth.setTokens()` guarda tokens en cookies y decodifica usuario del JWT
4. `auth.setUser()` actualiza con datos completos del usuario y guarda en cookie `user_data`
5. NavUser lee del store y muestra los datos

### Recarga de Página
1. App se inicializa
2. Auth store lee cookies: `access_token`, `refresh_token`, `user_data`
3. Si hay `user_data`, lo parsea y usa
4. Si no hay `user_data` pero hay token, lo decodifica
5. NavUser siempre tiene datos disponibles

### Logout
1. Usuario hace logout
2. Se eliminan todas las cookies: `access_token`, `refresh_token`, `user_data`
3. Se limpia localStorage
4. Se resetea el store
5. Redirección a login

## Testing

### Verificar que los datos se guardan en cookies
1. Login en la aplicación
2. Abrir DevTools > Application > Cookies
3. Verificar que existe la cookie `user_data` con los datos del usuario

### Verificar persistencia
1. Login en la aplicación
2. Recargar la página
3. Verificar que NavUser sigue mostrando los datos correctos

### Verificar limpieza en logout
1. Login en la aplicación
2. Hacer logout
3. Verificar en DevTools que la cookie `user_data` fue eliminada

## Migración desde localStorage

Si anteriormente guardabas datos de usuario en localStorage, este cambio migra automáticamente a cookies. No se requiere ninguna acción manual de los usuarios existentes ya que:

1. La cookie `user_data` se crea automáticamente en el próximo login
2. El store siempre intenta leer de cookies primero
3. Si no hay datos, los extrae del token JWT

## Notas Importantes

- ✅ La cookie `user_data` dura 7 días (igual que `refresh_token`)
- ✅ Los datos se almacenan en formato JSON
- ✅ Se incluye validación de errores al parsear
- ✅ Fallbacks inteligentes si faltan datos
- ✅ Compatibilidad total con el flujo existente de autenticación

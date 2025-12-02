# 🎨 Frontend - Sistema de Gestión de Ventas

Aplicación web moderna construida con React 19, TanStack Router, y Shadcn/ui para la gestión completa de ventas, productos, proveedores y más.

## 📋 Tabla de Contenidos

- [Características](#características)
- [Stack Tecnológico](#stack-tecnológico)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Desarrollo](#desarrollo)
- [Features y Módulos](#features-y-módulos)
- [Componentes UI](#componentes-ui)
- [Estado y Datos](#estado-y-datos)
- [Routing](#routing)
- [Estilos y Theming](#estilos-y-theming)
- [Formularios y Validación](#formularios-y-validación)
- [Build y Deploy](#build-y-deploy)
- [Buenas Prácticas](#buenas-prácticas)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)

## ✨ Características

### 🎯 Funcionalidades Principales

- ✅ **Dashboard Interactivo**: Métricas y estadísticas en tiempo real
- ✅ **Gestión de Productos**: CRUD completo con imágenes y categorización
- ✅ **Gestión de Proveedores**: Administración de proveedores y contactos
- ✅ **Gestión de Compras**: Registro de compras con detalle de productos
- ✅ **Gestión de Ventas**: Sistema de ventas con carrito y facturación
- ✅ **Gestión de Usuarios**: Administración de usuarios y roles
- ✅ **Sistema de Auditoría**: Visualización de logs y actividad del sistema
- ✅ **Catálogos**: Gestión de marcas y líneas de productos

### 🚀 Características Técnicas

- 🎨 **UI Moderna**: Componentes Shadcn/ui con diseño profesional
- 🌓 **Dark/Light Mode**: Tema claro y oscuro con persistencia
- 📱 **Responsive Design**: Adaptable a móvil, tablet y desktop
- ⚡ **Optimización**: Code splitting automático y lazy loading
- 🔄 **Estado Sincronizado**: TanStack Query para cache y sincronización
- 🔐 **Rutas Protegidas**: Sistema de autenticación con guards
- 📊 **Data Tables**: Tablas interactivas con filtros, paginación y ordenamiento
- 🎭 **Loading States**: Indicadores de carga y skeleton loaders
- 🔔 **Notificaciones**: Toast notifications con Sonner
- 🎨 **Animaciones**: Transiciones suaves con TailwindCSS
- 🌐 **Internacionalización**: Preparado para multi-idioma
- 📝 **Formularios Robustos**: Validación con Zod y manejo de errores

## 🛠️ Stack Tecnológico

### Core

| Tecnología | Versión | Uso |
|------------|---------|-----|
| **React** | 19.2.0 | Framework UI |
| **TypeScript** | 5.9.3 | Tipado estático |
| **Vite** | 7.1.9 | Build tool y dev server |

### Routing y Estado

| Tecnología | Versión | Uso |
|------------|---------|-----|
| **TanStack Router** | 1.132.47 | Routing con type-safety |
| **TanStack Query** | 5.90.2 | State management y cache |
| **Zustand** | 5.0.8 | Estado global ligero |

### UI y Estilos

| Tecnología | Versión | Uso |
|------------|---------|-----|
| **TailwindCSS** | 4.1.14 | Framework CSS utility-first |
| **Shadcn/ui** | Latest | Biblioteca de componentes |
| **Radix UI** | Latest | Componentes base accesibles |
| **Lucide React** | 0.545.0 | Iconos |

### Formularios y Validación

| Tecnología | Versión | Uso |
|------------|---------|-----|
| **React Hook Form** | 7.64.0 | Manejo de formularios |
| **Zod** | 4.1.12 | Validación de esquemas |
| **@hookform/resolvers** | 5.2.2 | Integración Zod + RHF |

### Utilidades

| Tecnología | Uso |
|------------|-----|
| **Axios** | Cliente HTTP |
| **date-fns** | Manipulación de fechas |
| **jwt-decode** | Decodificación de JWT |
| **Sonner** | Toast notifications |
| **cmdk** | Command palette |
| **Recharts** | Gráficos y visualizaciones |

### Desarrollo

| Tecnología | Uso |
|------------|-----|
| **ESLint** | Linting |
| **Prettier** | Formateo de código |
| **Knip** | Detección de código no usado |
| **TypeScript ESLint** | Linting para TypeScript |

## 📁 Estructura del Proyecto

```
front-ventas/
├── public/                        # Archivos estáticos
│   └── images/                    # Imágenes públicas
│
├── src/
│   ├── assets/                    # Assets (SVGs, iconos)
│   │   ├── brand-icons/          # Iconos de marcas
│   │   └── custom/               # Iconos personalizados
│   │
│   ├── components/               # Componentes reutilizables
│   │   ├── ui/                   # Componentes base Shadcn/ui
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── form.tsx
│   │   │   ├── table.tsx
│   │   │   └── ...
│   │   ├── layout/               # Componentes de layout
│   │   │   ├── header.tsx
│   │   │   ├── sidebar.tsx
│   │   │   └── ...
│   │   ├── data-table/           # Tabla de datos reutilizable
│   │   ├── command-menu.tsx      # Command palette
│   │   ├── date-picker.tsx       # Selector de fechas
│   │   ├── password-input.tsx    # Input de contraseña
│   │   ├── profile-dropdown.tsx  # Dropdown de perfil
│   │   └── theme-switch.tsx      # Switcher de tema
│   │
│   ├── config/                   # Configuración
│   │   └── fonts.ts              # Configuración de fuentes
│   │
│   ├── context/                  # Context providers
│   │   ├── theme-provider.tsx    # Proveedor de tema
│   │   ├── font-provider.tsx     # Proveedor de fuentes
│   │   ├── direction-provider.tsx # RTL/LTR
│   │   ├── layout-provider.tsx   # Layout state
│   │   └── search-provider.tsx   # Estado de búsqueda
│   │
│   ├── features/                 # Features por módulo
│   │   ├── auth/                 # Autenticación
│   │   │   ├── components/      # Componentes del módulo
│   │   │   ├── hooks/           # Hooks específicos
│   │   │   ├── services/        # Servicios API
│   │   │   └── types/           # Tipos TypeScript
│   │   ├── dashboard/           # Dashboard
│   │   ├── products/            # Productos
│   │   ├── suppliers/           # Proveedores
│   │   ├── purchases/           # Compras
│   │   ├── sales/               # Ventas
│   │   ├── users/               # Usuarios
│   │   ├── brands/              # Marcas
│   │   ├── lines/               # Líneas
│   │   ├── audit/               # Auditoría
│   │   ├── tasks/               # Tareas
│   │   └── errors/              # Páginas de error
│   │
│   ├── hooks/                    # Hooks globales
│   │   ├── use-mobile.tsx       # Hook para detectar móvil
│   │   ├── use-dialog-state.tsx # Estado de diálogos
│   │   ├── use-table-url-state.ts # Estado de tablas en URL
│   │   ├── use-dashboard-stats.ts # Stats del dashboard
│   │   ├── use-marcas.ts        # Hook de marcas
│   │   ├── use-lineas.ts        # Hook de líneas
│   │   └── use-proveedores.ts   # Hook de proveedores
│   │
│   ├── lib/                      # Utilidades y helpers
│   │   ├── axios.ts             # Configuración de Axios
│   │   ├── cookies.ts           # Manejo de cookies
│   │   ├── utils.ts             # Utilidades generales
│   │   ├── validate-password.ts # Validación de contraseñas
│   │   ├── handle-server-error.ts # Manejo de errores
│   │   └── show-submitted-data.tsx # Debug de formularios
│   │
│   ├── routes/                   # Rutas de la aplicación
│   │   ├── __root.tsx           # Root layout
│   │   ├── _authenticated/      # Rutas protegidas
│   │   ├── (auth)/              # Rutas de autenticación
│   │   ├── (errors)/            # Páginas de error
│   │   └── clerk/               # Clerk routes (opcional)
│   │
│   ├── services/                 # Servicios API
│   │   ├── endpoints.ts         # Definición de endpoints
│   │   ├── auth/                # Servicios de auth
│   │   ├── products/            # Servicios de productos
│   │   ├── suppliers/           # Servicios de proveedores
│   │   ├── purchases/           # Servicios de compras
│   │   ├── sales/               # Servicios de ventas
│   │   ├── users/               # Servicios de usuarios
│   │   ├── brands/              # Servicios de marcas
│   │   ├── lines/               # Servicios de líneas
│   │   ├── audit/               # Servicios de auditoría
│   │   └── dashboard/           # Servicios de dashboard
│   │
│   ├── stores/                   # Estado global (Zustand)
│   │   └── auth-store.ts        # Store de autenticación
│   │
│   ├── styles/                   # Estilos globales
│   │   ├── index.css            # Estilos principales
│   │   └── theme.css            # Variables de tema
│   │
│   ├── main.tsx                  # Entry point
│   ├── routeTree.gen.ts         # Árbol de rutas (generado)
│   └── vite-env.d.ts            # Types de Vite
│
├── docs/                         # Documentación técnica
│   ├── cookies/
│   ├── email/
│   ├── reset-password/
│   └── testing-front/
│
├── .prettierrc                   # Config Prettier
├── .prettierignore
├── eslint.config.js              # Config ESLint
├── tsconfig.json                 # Config TypeScript
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.config.ts                # Config Vite
├── components.json               # Config Shadcn
├── knip.config.ts                # Config Knip
└── package.json
```

## 📋 Requisitos Previos

- **Node.js**: >= 18.0.0
- **npm**: >= 9.0.0
- **Backend API**: Servidor backend corriendo en `http://localhost:3000`

## 🔧 Instalación

### 1. Clonar e instalar

```bash
# Navegar al directorio del frontend
cd front-ventas

# Instalar dependencias
npm install
```

### 2. Configurar variables de entorno

Crear archivo `.env` en la raíz del proyecto:

```env
# API Backend
VITE_API_URL=http://localhost:3000/api

# Clerk (Opcional - si usas Clerk para autenticación)
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...

# Otras configuraciones
VITE_APP_NAME=Sistema de Ventas
VITE_APP_VERSION=2.2.0
```

### 3. Instalar componentes Shadcn (si es necesario)

```bash
# Agregar un nuevo componente
npx shadcn@latest add button
npx shadcn@latest add dialog
npx shadcn@latest add form
# etc...
```

## ⚙️ Configuración

### Configuración de Axios

El cliente HTTP está configurado en `src/lib/axios.ts`:

```typescript
// Interceptores para añadir token JWT
// Manejo de errores centralizado
// Base URL desde variables de entorno
```

### Configuración de TanStack Query

En `src/main.tsx`:

```typescript
// Cache time: 10 segundos
// Retry automático con lógica personalizada
// Manejo de errores 401, 403, 500
```

### Configuración de Rutas

Las rutas se definen en `src/routes/`:

- `__root.tsx`: Layout principal
- `_authenticated/`: Rutas que requieren autenticación
- `(auth)/`: Rutas públicas de autenticación
- `(errors)/`: Páginas de error

## 🚀 Desarrollo

### Comandos disponibles

```bash
# Servidor de desarrollo (http://localhost:5173)
npm run dev

# Build para producción
npm run build

# Preview del build de producción
npm run preview

# Linting
npm run lint

# Formateo de código
npm run format

# Verificar formato
npm run format:check

# Detectar código no usado
npm run knip
```

### Hot Module Replacement (HMR)

Vite proporciona HMR instantáneo. Los cambios se reflejan inmediatamente sin perder el estado de la aplicación.

### DevTools

Durante el desarrollo, tienes acceso a:

- **React Query DevTools**: Panel para inspeccionar queries y mutations
- **TanStack Router DevTools**: Visualización del árbol de rutas
- **Redux DevTools**: Para inspeccionar Zustand stores (si está configurado)

## 🎯 Features y Módulos

### 🔐 Auth (Autenticación)

**Ubicación**: `src/features/auth/`

- Login con email y contraseña
- Registro de nuevos usuarios
- Recuperación de contraseña
- Cambio de contraseña
- Logout
- Persistencia de sesión con JWT

**Componentes principales**:
- `sign-in-form.tsx`: Formulario de login
- `sign-up-form.tsx`: Formulario de registro
- `forgot-password-form.tsx`: Recuperar contraseña
- `reset-password-form.tsx`: Cambiar contraseña

### 📊 Dashboard

**Ubicación**: `src/features/dashboard/`

- Estadísticas generales del negocio
- Gráficos de ventas
- Productos más vendidos
- Resumen de inventario
- Actividad reciente

### 📦 Products (Productos)

**Ubicación**: `src/features/products/`

- Lista de productos con filtros
- Creación de productos
- Edición de productos
- Eliminación de productos
- Upload de imágenes
- Gestión de stock
- Categorización por marca y línea

**Componentes principales**:
- `products-table.tsx`: Tabla de productos
- `products-mutate-drawer.tsx`: Drawer para crear/editar
- `product-card.tsx`: Card de producto

### 🏢 Suppliers (Proveedores)

**Ubicación**: `src/features/suppliers/`

- Lista de proveedores
- CRUD completo
- Gestión de contactos
- Historial de compras

### 🛒 Purchases (Compras)

**Ubicación**: `src/features/purchases/`

- Registro de compras
- Selección de proveedor
- Selección de productos
- Cálculo de totales
- Actualización de stock

### 💰 Sales (Ventas)

**Ubicación**: `src/features/sales/`

- Registro de ventas
- Carrito de compras
- Cálculo de totales
- Generación de facturas
- Descuento de stock

### 👥 Users (Usuarios)

**Ubicación**: `src/features/users/`

- Lista de usuarios
- CRUD de usuarios
- Gestión de roles (OWNER, ADMIN, EMPLOYEE)
- Cambio de contraseña
- Activación/desactivación

### 🏷️ Brands (Marcas) y Lines (Líneas)

**Ubicación**: `src/features/brands/` y `src/features/lines/`

- Gestión de catálogos
- Creación y edición
- Asignación a productos

### 🔍 Audit (Auditoría)

**Ubicación**: `src/features/audit/`

- Visualización de logs
- Filtros por usuario, módulo, fecha
- Detalle de acciones realizadas

## 🎨 Componentes UI

### Componentes Base (Shadcn/ui)

Todos ubicados en `src/components/ui/`:

#### Inputs y Forms
- `input.tsx`: Input básico
- `textarea.tsx`: Textarea
- `select.tsx`: Select dropdown
- `checkbox.tsx`: Checkbox
- `radio-group.tsx`: Radio buttons
- `switch.tsx`: Toggle switch
- `form.tsx`: Form wrapper con validación
- `label.tsx`: Label

#### Feedback
- `alert.tsx`: Alertas
- `alert-dialog.tsx`: Diálogos de confirmación
- `sonner.tsx`: Toast notifications
- `skeleton.tsx`: Loading skeletons

#### Overlays
- `dialog.tsx`: Modal dialog
- `sheet.tsx`: Side panel
- `popover.tsx`: Popover
- `tooltip.tsx`: Tooltip
- `dropdown-menu.tsx`: Dropdown menu

#### Data Display
- `table.tsx`: Tabla básica
- `card.tsx`: Card container
- `badge.tsx`: Badge
- `avatar.tsx`: Avatar
- `separator.tsx`: Separador

#### Navigation
- `tabs.tsx`: Tabs
- `command.tsx`: Command palette
- `collapsible.tsx`: Sección colapsable
- `scroll-area.tsx`: Scroll container

#### Buttons
- `button.tsx`: Botón con variantes

### Componentes Compuestos

#### DataTable

**Ubicación**: `src/components/data-table/`

Tabla de datos reutilizable con:
- Paginación
- Ordenamiento
- Filtros
- Selección múltiple
- Acciones por fila
- Responsive

**Uso**:

```tsx
import { DataTable } from '@/components/data-table'

const columns = [
  { accessorKey: 'name', header: 'Nombre' },
  { accessorKey: 'email', header: 'Email' },
]

<DataTable 
  columns={columns} 
  data={data}
  searchKey="name"
/>
```

#### Layout Components

**Ubicación**: `src/components/layout/`

- `header.tsx`: Header principal
- `sidebar.tsx`: Barra lateral
- `footer.tsx`: Footer
- `breadcrumb.tsx`: Breadcrumbs

### Componentes Personalizados

- `command-menu.tsx`: Command palette (Ctrl+K)
- `date-picker.tsx`: Selector de fechas con date-fns
- `password-input.tsx`: Input de contraseña con toggle
- `profile-dropdown.tsx`: Dropdown de perfil de usuario
- `theme-switch.tsx`: Switcher de tema claro/oscuro
- `search.tsx`: Barra de búsqueda
- `confirm-dialog.tsx`: Diálogo de confirmación reutilizable

## 🗂️ Estado y Datos

### TanStack Query (React Query)

**Para qué se usa**:
- Cache de datos del servidor
- Sincronización automática
- Invalidación de cache
- Retry automático
- Optimistic updates

**Ejemplo de uso**:

```tsx
import { useQuery, useMutation } from '@tanstack/react-query'

// Query
const { data, isLoading, error } = useQuery({
  queryKey: ['products'],
  queryFn: getProducts,
})

// Mutation
const mutation = useMutation({
  mutationFn: createProduct,
  onSuccess: () => {
    queryClient.invalidateQueries(['products'])
  },
})
```

### Zustand

**Para qué se usa**:
- Estado global ligero
- Autenticación
- Preferencias de usuario
- Estado de UI

**Ejemplo**: `src/stores/auth-store.ts`

```tsx
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      setAuth: (user, token) => set({ user, token }),
      reset: () => set({ user: null, token: null }),
    }),
    { name: 'auth-storage' }
  )
)
```

### Custom Hooks

**Ubicación**: `src/hooks/`

- `use-mobile.tsx`: Detecta si es móvil
- `use-dialog-state.tsx`: Manejo de estado de diálogos
- `use-table-url-state.ts`: Sincroniza estado de tabla con URL
- `use-dashboard-stats.ts`: Stats del dashboard
- `use-marcas.ts`, `use-lineas.ts`, `use-proveedores.ts`: Hooks de datos

## 🧭 Routing

### TanStack Router

El routing está basado en archivos. Las rutas se definen en `src/routes/`:

```
routes/
├── __root.tsx                    # Layout raíz
├── _authenticated/               # Rutas protegidas
│   ├── index.tsx                # /dashboard
│   ├── products/
│   │   └── index.tsx            # /products
│   ├── suppliers/
│   │   └── index.tsx            # /suppliers
│   └── ...
├── (auth)/
│   ├── sign-in.tsx              # /sign-in
│   └── sign-up.tsx              # /sign-up
└── (errors)/
    ├── 404.tsx                  # /404
    └── 500.tsx                  # /500
```

### Rutas Protegidas

Las rutas bajo `_authenticated/` requieren autenticación:

```tsx
// En __root.tsx o layout
const { user } = useAuthStore()

if (!user) {
  return <Navigate to="/sign-in" />
}
```

### Navegación

```tsx
import { Link, useNavigate } from '@tanstack/react-router'

// Componente Link
<Link to="/products">Productos</Link>

// Navegación programática
const navigate = useNavigate()
navigate({ to: '/products', search: { page: 1 } })
```

## 🎨 Estilos y Theming

### TailwindCSS

Archivo de configuración incluido. Clases utility-first:

```tsx
<div className="flex items-center gap-4 p-4 bg-white dark:bg-gray-900">
  <Button className="bg-primary text-white hover:bg-primary/90">
    Click me
  </Button>
</div>
```

### Tema Claro/Oscuro

**Implementación**: `src/context/theme-provider.tsx`

```tsx
import { useTheme } from '@/context/theme-provider'

const { theme, setTheme } = useTheme()

<Button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
  Toggle Theme
</Button>
```

### Variables CSS

**Ubicación**: `src/styles/theme.css`

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 221.2 83.2% 53.3%;
  /* ... */
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  /* ... */
}
```

### Personalización de Componentes

Usa `class-variance-authority` (CVA):

```tsx
import { cva } from 'class-variance-authority'

const buttonVariants = cva(
  'inline-flex items-center justify-center',
  {
    variants: {
      variant: {
        default: 'bg-primary text-white',
        destructive: 'bg-red-500 text-white',
      },
      size: {
        default: 'h-10 px-4',
        sm: 'h-8 px-3',
      },
    },
  }
)
```

## 📝 Formularios y Validación

### React Hook Form + Zod

**Ejemplo completo**:

```tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

// Schema de validación
const formSchema = z.object({
  name: z.string().min(3, 'Mínimo 3 caracteres'),
  email: z.string().email('Email inválido'),
  age: z.number().min(18, 'Debe ser mayor de edad'),
})

function MyForm() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      age: 0,
    },
  })

  const onSubmit = (data) => {
    console.log(data)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        
        <Button type="submit">Enviar</Button>
      </form>
    </Form>
  )
}
```

### Validaciones Personalizadas

**Ubicación**: `src/lib/validate-password.ts`

```typescript
export function validatePassword(password: string) {
  const minLength = 8
  const hasUpperCase = /[A-Z]/.test(password)
  const hasLowerCase = /[a-z]/.test(password)
  const hasNumber = /\d/.test(password)
  
  return {
    isValid: password.length >= minLength && hasUpperCase && hasLowerCase && hasNumber,
    errors: [],
  }
}
```

## 🏗️ Build y Deploy

### Build para Producción

```bash
# Build
npm run build

# Output en carpeta dist/
# - HTML, CSS, JS optimizados
# - Assets con hash para cache
# - Source maps (opcional)
```

### Preview del Build

```bash
npm run preview
# Servidor en http://localhost:4173
```

### Variables de Entorno por Ambiente

```bash
# .env.development
VITE_API_URL=http://localhost:3000/api

# .env.production
VITE_API_URL=https://api.produccion.com/api
```

### Deploy

#### Vercel

```bash
# Instalar CLI
npm i -g vercel

# Deploy
vercel

# Deploy a producción
vercel --prod
```

#### Netlify

```bash
# Instalar CLI
npm i -g netlify-cli

# Deploy
netlify deploy

# Deploy a producción
netlify deploy --prod
```

#### Docker

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=0 /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## 💡 Buenas Prácticas

### Organización de Código

1. **Un componente por archivo**
2. **Colocar types cerca del código que los usa**
3. **Agrupar por feature, no por tipo de archivo**
4. **Usar barrel exports** (`index.ts`) para módulos

### Nomenclatura

```tsx
// Componentes: PascalCase
function UserProfile() {}

// Hooks: camelCase con prefijo 'use'
function useUserData() {}

// Utilidades: camelCase
function formatDate() {}

// Constantes: UPPER_SNAKE_CASE
const API_BASE_URL = ''

// Types/Interfaces: PascalCase
interface User {}
type UserRole = 'admin' | 'user'
```

### Performance

1. **Lazy loading de rutas**:
```tsx
const Products = lazy(() => import('./features/products'))
```

2. **Memoización**:
```tsx
const MemoizedComponent = memo(Component)
const memoizedValue = useMemo(() => compute(), [deps])
const memoizedCallback = useCallback(() => {}, [deps])
```

3. **Code splitting automático** con TanStack Router

4. **Optimización de imágenes**:
```tsx
<img loading="lazy" />
```

### Accesibilidad

1. **Usar componentes Radix UI** (ya incluyen ARIA)
2. **Labels en todos los inputs**
3. **Keyboard navigation**
4. **Focus management**
5. **Color contrast** adecuado

### Seguridad

1. **No exponer secrets** en variables `VITE_*`
2. **Sanitizar inputs** de usuario
3. **Validar en backend** también
4. **HTTPS en producción**
5. **Content Security Policy**

## 🧪 Testing

### Jest (Configuración futura)

```bash
npm install -D @testing-library/react @testing-library/jest-dom vitest
```

### Ejemplo de test:

```tsx
import { render, screen } from '@testing-library/react'
import { Button } from '@/components/ui/button'

test('renders button', () => {
  render(<Button>Click me</Button>)
  expect(screen.getByText('Click me')).toBeInTheDocument()
})
```

## 🔧 Troubleshooting

### Problemas Comunes

#### 1. Error de CORS

```
Access to XMLHttpRequest blocked by CORS policy
```

**Solución**: Verificar que el backend tenga configurado CORS correctamente.

#### 2. 401 Unauthorized

**Solución**: 
- Verificar que el token JWT esté presente
- Verificar que el token no haya expirado
- Limpiar cookies/localStorage y volver a hacer login

#### 3. Build falla

```
Error: Cannot find module
```

**Solución**:
- Verificar imports con alias `@/`
- Ejecutar `npm install` nuevamente
- Limpiar cache: `rm -rf node_modules .vite && npm install`

#### 4. HMR no funciona

**Solución**:
- Reiniciar el servidor de desarrollo
- Verificar que el puerto no esté en uso
- Verificar configuración de Vite

#### 5. Componentes no se actualizan

**Solución**:
- Verificar que las dependencias de useEffect/useMemo estén correctas
- Usar React DevTools para inspeccionar el estado
- Verificar que TanStack Query esté invalidando correctamente

### Logs y Debug

```tsx
// Modo desarrollo
if (import.meta.env.DEV) {
  console.log('Debug info:', data)
}

// React Query DevTools
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

<ReactQueryDevtools initialIsOpen={false} />

// TanStack Router DevTools
import { TanStackRouterDevtools } from '@tanstack/router-devtools'

<TanStackRouterDevtools />
```

## 📚 Recursos Adicionales

### Documentación

- [React 19](https://react.dev/)
- [TanStack Router](https://tanstack.com/router)
- [TanStack Query](https://tanstack.com/query)
- [Shadcn/ui](https://ui.shadcn.com/)
- [TailwindCSS](https://tailwindcss.com/)
- [Zod](https://zod.dev/)
- [React Hook Form](https://react-hook-form.com/)

### Documentación del Proyecto

- [`docs/cookies/USER_COOKIE_IMPLEMENTATION.md`](docs/cookies/USER_COOKIE_IMPLEMENTATION.md)
- [`docs/email/EMAIL_TEMPLATE_REFERENCE.md`](docs/email/EMAIL_TEMPLATE_REFERENCE.md)
- [`docs/reset-password/RESET_PASSWORD_IMPLEMENTATION.md`](docs/reset-password/RESET_PASSWORD_IMPLEMENTATION.md)
- [`docs/testing-front/TESTING_GUIDE.md`](docs/testing-front/TESTING_GUIDE.md)

## 📄 Licencia

Este proyecto es privado.

## 🤝 Contribuir

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

---

Hecho con ❤️ usando React, TanStack y Shadcn/ui

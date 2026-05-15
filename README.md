# Gestor del Mundial

Aplicación web para administrar equipos participantes del Mundial, gestionar grupos y generar asignaciones aleatorias de equipos a grupos.

## Funcionalidades

- **CRUD de equipos**: país, código FIFA (3 letras), director técnico, jugadores (23–26), ranking.
- **CRUD de grupos**: nombre y descripción.
- **Generación de distribuciones**: asignación aleatoria de equipos a N grupos con validación de reglas.
- **Persistencia**: las distribuciones se guardan y se consultan después.

## Stack

| Capa | Tecnologías |
|------|-------------|
| Frontend | React 19, Vite, TypeScript, Tailwind CSS v4, React Router, TanStack Query, React Hook Form, Zod |
| Backend | Node.js, Express, TypeScript, Prisma, Zod |
| Base de datos | PostgreSQL |
| Despliegue | Vercel (frontend + serverless functions) + Neon (PostgreSQL) |

## Estructura

```
gestor-mundial/
├── api/                 # Entrypoint serverless de Vercel
│   └── index.ts         # Re-exporta la app de Express
├── client/              # Frontend React (Vite)
│   ├── src/
│   │   ├── api/         # Cliente HTTP
│   │   ├── components/  # UI reutilizable + features
│   │   ├── hooks/       # useTeams, useGroups, useDistributions (React Query)
│   │   ├── lib/         # utils, schemas Zod
│   │   ├── pages/       # Home, Teams, Groups, Distributions, Formation, NotFound
│   │   └── types/       # Tipos compartidos del dominio
├── server/              # Backend Express
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.ts      # Equipos y grupos de ejemplo
│   └── src/
│       ├── controllers/
│       ├── services/    # Lógica de negocio (distribución aleatoria, validaciones)
│       ├── validators/  # Schemas Zod
│       ├── routes/
│       ├── middleware/  # Manejo de errores
│       ├── lib/         # Prisma client singleton
│       ├── app.ts       # Factory de la Express app
│       └── index.ts     # Entry standalone (dev local)
├── pnpm-workspace.yaml
├── vercel.json
└── README.md
```
## API

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET    | `/api/health` | Health check |
| GET    | `/api/teams` | Lista equipos |
| POST   | `/api/teams` | Crea equipo |
| GET    | `/api/teams/:id` | Detalle |
| PUT    | `/api/teams/:id` | Actualiza |
| DELETE | `/api/teams/:id` | Elimina |
| GET    | `/api/groups` | Lista grupos |
| POST   | `/api/groups` | Crea grupo |
| GET    | `/api/groups/:id` | Detalle |
| PUT    | `/api/groups/:id` | Actualiza |
| DELETE | `/api/groups/:id` | Elimina |
| GET    | `/api/distributions` | Lista distribuciones guardadas |
| GET    | `/api/distributions/:id` | Detalle |
| POST   | `/api/distributions/preview` | Genera vista previa aleatoria (no guarda) |
| POST   | `/api/distributions` | Guarda una distribución |
| DELETE | `/api/distributions/:id` | Elimina |


### Requisitos

- Node.js 20+
- pnpm 10+
- PostgreSQL

### Setup

```bash
# 1. Instalar dependencias
pnpm install

# 3. Crear el esquema en la BD
pnpm --filter server prisma:migrate

# 4. Sembrar datos de ejemplo
pnpm --filter server seed

# 5. Levantar todo
pnpm dev
```

### Comandos útiles

```bash
pnpm dev                              # Cliente y servidor en paralelo
pnpm --filter client dev              # Solo cliente
pnpm --filter server dev              # Solo servidor
pnpm --filter server prisma:studio    # Explorar la BD visualmente
pnpm --filter server seed             # Sembrar datos de ejemplo
pnpm build                            # Build de producción
```
# Fresco Market

Inventario de supermercado fullstack: autenticación JWT y CRUD de productos (imagen, precio, estado y vencimiento). React, TypeScript, Vite, Tailwind, Express y SQL Server.

**Fresco Market** es una app web de inventario de supermercado. Permite registrarse, iniciar sesión con JWT y gestionar productos propios: nombre, imagen, precio, estado y fecha de vencimiento.

- **Frontend:** React + TypeScript + Vite + Tailwind CSS
- **Backend:** Node.js + Express (JavaScript)
- **Base de datos:** SQL Server

## Credenciales de prueba

- Email: `demo@demo.com`
- Contraseña: `Demo123!`

## Estructura

```
/
├── Backend/      # API Express
├── Frontend/     # App React
└── database/
    └── backup.sql
```

## 1. Base de datos

SQL Server ya queda conectado con **Windows Authentication** (`Trusted_Connection=True`) a `localhost`.

La base `Supermarket` se crea ejecutando `database/backup.sql` (ya está importada en este proyecto). El archivo está en UTF-8; si lo vuelves a importar con `sqlcmd`, usa `-f 65001` para que las tildes se guarden bien.

`Backend/.env` usa:

```
DB_SERVER=localhost
DB_DATABASE=Supermarket
DB_TRUSTED_CONNECTION=true
```

## 2. Backend

```bash
cd Backend
copy .env.example .env
npm install
npm run dev
```

La API queda en `http://localhost:4000`.

Rutas:

| Método       | Ruta                 | Auth |
| ------------ | -------------------- | ---- |
| POST         | `/api/auth/register` | No   |
| POST         | `/api/auth/login`    | No   |
| GET / POST   | `/api/products`      | JWT  |
| PUT / DELETE | `/api/products/:id`  | JWT  |

Las rutas de productos usan `authMiddleware`: sin token Bearer válido responden `401`. Cada usuario solo ve y modifica sus productos.

## Cómo explicar el código (mapa rápido)

1. `Backend/src/app.js` — Express, CORS, estáticos de `/uploads` y registro de rutas.
2. `Backend/src/middleware/auth.middleware.js` — lee el JWT y deja el usuario en `req.user`.
3. `Backend/src/modules/auth` — registro/login con bcrypt + JWT. Cada controller usa `try/catch` y `next(error)`.
4. `Backend/src/middleware/error.middleware.js` — convierte el error en `{ message, field }` para el frontend.
5. `Backend/src/modules/products` — CRUD, imagen con multer, ownership por `userId`.
6. `Frontend/src/context/AuthContext.tsx` — guarda token en `localStorage`.
7. `Frontend/src/components/ProtectedRoute.tsx` — redirige a login si no hay token.
8. `Frontend/src/pages/ProductsPage.tsx` — listado y formulario de productos.

## 3. Frontend

```bash
cd Frontend
copy .env.example .env
npm install
npm run dev
```

La app queda en `http://localhost:5173`.

## Stack

- Frontend: React, TypeScript, Vite, Tailwind CSS, React Router
- Backend: Node.js, Express, mssql, jsonwebtoken, bcrypt, multer
- Base de datos: SQL Server

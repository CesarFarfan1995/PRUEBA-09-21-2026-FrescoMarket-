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

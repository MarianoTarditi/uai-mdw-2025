# 🏋️‍♂️ AgustínTurriEDF APP

Gestión de rutinas, clientes y ejercicios — **MERN + Firebase + shadcn/ui**

Este proyecto es una aplicación web creada para un personal trainer que necesita llevar un control eficiente de sus clientes, rutinas, ejercicios y progreso físico.

La plataforma combina un stack moderno y escalable, con autenticación segura y una interfaz profesional.

---

# 🚀 Tecnologías utilizadas

## 🎨 Frontend

- ⚛️ React + Vite
- 🎨 shadcn/ui - MantineUI (UI moderna, accesible y altamente personalizable)
- 🧭 React Router
- 📝 React Hook Form + Zod (formularios y validaciones)
- 🗂️ Redux Toolkit (manejo global de estado)

---

## 🔧 Backend

- Node.js + Express
- MongoDB + Mongoose
- Middlewares de seguridad (validaciónes firebase en backend - ckeckeo de roles)

---

## 🔐 Autenticación

- 🔥 Firebase Authentication (Email/Password)
- Manejo seguro de sesiones
- Verificación de identidad

---

# 📌 Funcionalidades principales

## 🔐 Autenticación

- Registro y login con Firebase Auth
- Protección de rutas en frontend y backend
- Roles de usuario (admin, trainer, client)

---

## 🧑‍🤝‍🧑 Gestión de Usuarios / Clientes

- Crear, editar y eliminar clientes
- Activar/desactivar usuarios (soft delete)
- Actualización de perfil:
  - Foto
  - Altura
  - Peso
  - Fecha de nacimiento
  - Género

---

## 🏋️‍♀️ Gestión de Ejercicios

- Crear, editar, listar y eliminar ejercicios

Cada ejercicio incluye:
- Descripción
- Grupo muscular
- Imagen
- Video (opcional)

---

## 📅 Rutinas de entrenamiento

- Asignación de rutinas a clientes
- Rutinas personalizadas por día
- Historial de rutinas y progresos

---

## 📊 Dashboard del Trainer

- Estadísticas de clientes activos
- Ejercicios creados
- Rutinas asignadas
- Información general rápida

---

# 🔗 Links del Proyecto

- 🌐 **Aplicación Web:** [https://TU-LINK-DEPLOY.com](https://uai-mdw-2025.vercel.app/home)


---

# Entornos (Local + Deploy sin romper)

## Frontend (`frontend2`)

1. Crear `frontend2/.env.local` tomando como base `frontend2/.env.local.example`.
2. En local, usar:
   - `VITE_API_URL=http://localhost:3001/api`
   - `VITE_STATIC_URL=http://localhost:3001`
3. En deploy, usar variables de entorno de Vercel tomando como base `frontend2/.env.production.example`.
4. El dev server de Vite proxyea tanto `"/api"` como `"/uploads"` al backend local (`http://localhost:3001`).

Tomar como referencia: `frontend2/.env.example`.

## Backend (`backend`)

1. Crear `backend/.env` con `PORT`, `MONGO_URI`, credenciales de Firebase Admin.
2. Configurar `CORS_ORIGINS` con lista separada por comas:
   - `http://localhost:5173`
   - `https://tu-frontend.vercel.app`

Tomar como referencia: `backend/.env.example`.

Importante para archivos subidos (Excel/PDF/videos/imágenes):
- Definir `UPLOADS_DIR`.
- En Render, usar una ruta de disco persistente (por ejemplo `/var/data/uploads`) para evitar `404` después de reinicios/deploy.

## Variables en Render / Vercel

- Render (backend): definir `PORT`, `MONGO_URI`, `CORS_ORIGINS`, `FIREBASE_*`.
- Vercel (frontend): definir `VITE_API_URL`, `VITE_STATIC_URL`, `VITE_FIREBASE_*`.

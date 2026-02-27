# Estación Meteorológica – Sistema Web (Laravel)

Este proyecto es una aplicación web desarrollada con **Laravel**, **Inertia + React**, **Vite** y **TailwindCSS**, diseñada como parte del proyecto de Servicio Social.  
Incluye autenticación, panel administrador, gestión de usuarios, auditoría y módulo de lanzamientos.

> **Nota:** este es un proyecto **privado** de uso interno.

---

## Requisitos del sistema

Asegúrate de tener instalado:

- **PHP 8.1 o superior**
- **Composer**
- **Node.js y NPM**
- **MySQL o MariaDB**
- (Opcional) XAMPP o Laragon para entorno local

---

## Instalación del proyecto

Sigue estos pasos en tu terminal:

### 1. Clonar o descomprimir el proyecto

Si lo descargaste en ZIP o ya está en tu entorno local:

```
C:\xampp\htdocs\Estacion-Meteorologica
```

---

### 2. Instalar dependencias PHP (Composer)

```
composer install
```

---

### 3. Instalar dependencias frontend (Vite)

```
npm install
```

---

### 4. Crear el archivo de entorno

Copia el archivo de ejemplo (Windows):

```
copy .env.example .env
```

---

### 5. Configurar base de datos

Edita el archivo `.env`:

```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=estacion_meteorologica
DB_USERNAME=root
DB_PASSWORD=
```

Crea la base en MySQL/MariaDB:

```
CREATE DATABASE estacion_meteorologica;
```

---

### 6. Generar APP_KEY

```
php artisan key:generate
```

---

### 7. Ejecutar migraciones y seeders

Este proyecto incluye la creación automática del usuario administrador.

```
php artisan migrate --seed
```

---

## Usuario administrador (según seeder)

Al ejecutar el seeder se crea el usuario administrador definido en `database/seeders/AdminUserSeeder.php`.

Revisa/ajusta estos datos directamente en el seeder antes de usar en producción.

---

## Notificaciones por Telegram

Para habilitar notificaciones por Telegram:

1. Crea un bot con **@BotFather** y copia el token.
2. En tu archivo `.env` agrega:

```
TELEGRAM_BOT_TOKEN=tu_token_de_bot
TELEGRAM_DEFAULT_CHAT_ID=
TELEGRAM_PARSE_MODE=HTML
```

3. En el perfil de usuario activa notificaciones y guarda tu `telegram_username`.

Las notificaciones se envían cuando un administrador activa, rechaza, reabre, cambia estado o elimina usuarios.

---

## Ejecutar el proyecto

### Levantar backend Laravel:

```
php artisan serve
```

### Levantar frontend (Vite):

```
npm run dev
```

Abrir en navegador:

```
http://localhost:8000
```

---

## Estructura principal del proyecto

```
app/
database/
routes/
resources/js/
resources/views/
public/
vite.config.js
tailwind.config.js
```

### Rutas modulares

```
routes/web.php
routes/dashboard.php
routes/lanzamientos.php
routes/admin.php
routes/auth.php
```

---

## Tecnologías utilizadas

- **Laravel**
- **Laravel Breeze (auth)**
- **Inertia.js + React**
- **TailwindCSS**
- **Vite**
- **MySQL/MariaDB**

---

## Autores

- **Oscar Salazar**
- **Mario Flores**
- **Ximena Amador**

Proyecto de Servicio Social — Desarrollo Web y IoT

# Servicio Social – Sistema Web (Laravel 10)

Este proyecto es una aplicación web desarrollada con **Laravel 10**, **Vite**, **TailwindCSS** y **Blade**, diseñada como parte del proyecto de Servicio Social.  
Incluye autenticación, panel administrador, gestión de usuarios y las migraciones completas necesarias para levantar el sistema desde cero.

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

Si lo descargaste en ZIP:

```
C:\xampp\htdocs\Servicio-Social
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

Copia el archivo de ejemplo:

```
cp .env.example .env
```

---

### 5. Configurar base de datos

Edita el archivo `.env`:

```
DB_CONNECTION=mysql o pgsql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=servicio_social
DB_USERNAME=root post
DB_PASSWORD=
```

Crea la base en MySQL o PostgreSQL pero mejor postgres:

```
CREATE DATABASE servicio_social;
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

## Usuario administrador generado automáticamente

Al ejecutar el seeder se creará este usuario:

- **Email:** `admin@demo.com`
- **Contraseña:** `password`
- **Rol:** Administrador
- **Email verificado:** Sí

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

Las notificaciones se envían cuando un administrador activa, rechaza, cambia estado o elimina usuarios.

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
resources/views/
public/
vite.config.js
tailwind.config.js
```

---

## Tecnologías utilizadas

- **Laravel 10**
- **Laravel Breeze (auth)**
- **TailwindCSS**
- **Vite**
- **MySQL**
- **Blade Templates**

---

## Autores

- **Oscar Salazar**
- **Mario Flores**
- **Ximena Amador**

Proyecto de Servicio Social — Desarrollo Web y IoT

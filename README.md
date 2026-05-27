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
- **PostgreSQL** para la app principal y **InfluxDB 2.x** para las lecturas IoT
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
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=estacion_meteorologica
DB_USERNAME=postgres
DB_PASSWORD=
```

Crea la base en PostgreSQL:

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

## Separación de datos

La arquitectura queda separada así:

- PostgreSQL: usuarios, roles, auditoría y configuración de la aplicación.
- InfluxDB: telemetría, sensores, métricas e históricos del ESP32.

Laravel usa PostgreSQL como base relacional principal y conserva InfluxDB solo para las lecturas de tiempo real.

## Lecturas del ESP32 con InfluxDB

El endpoint del ESP32 sigue siendo el mismo: `POST /api/lecturas`. Laravel actúa como intermediario y usa la API v2 de InfluxDB con token para guardar y leer las mediciones.

### Flujo simple

1. El ESP32 envía JSON al endpoint `POST /api/lecturas`.
2. Laravel valida y normaliza los datos.
3. El sistema escribe los puntos en InfluxDB usando `bucket`, `org` y `token`.
4. El dashboard consulta `GET /api/lecturas` y Laravel lee los últimos datos desde InfluxDB.

### Variables de entorno

Agrega esto en tu archivo `.env`:

```env
INFLUXDB_URL=http://localhost:8086
INFLUXDB_ORG=mi_organizacion
INFLUXDB_BUCKET=estacion_meteorologica
INFLUXDB_TOKEN=tu_token_de_influxdb
INFLUXDB_MEASUREMENT=lecturas
INFLUXDB_PRECISION=ms
INFLUXDB_TIMEOUT=10
```

### Crear el bucket y el token

1. Entra a la interfaz web de InfluxDB 2.x.
2. Crea o selecciona tu organización.
3. Ve a **Buckets** y crea uno nuevo, por ejemplo `estacion_meteorologica`.
4. Ve a **API Tokens** o **Load Data > Tokens**.
5. Crea un token con permisos de **read** y **write** sobre ese bucket.
6. Copia el token y pégalo en `INFLUXDB_TOKEN`.

### Código PHP ya integrado

La integración quedó en estos archivos:

- [app/Http/Controllers/Api/LecturasController.php](app/Http/Controllers/Api/LecturasController.php)
- [app/Services/InfluxDbService.php](app/Services/InfluxDbService.php)
- [config/services.php](config/services.php)

El controlador conserva la misma respuesta JSON para no romper el frontend. El servicio escribe en InfluxDB cuando la configuración existe y, si todavía no la completas, mantiene compatibilidad con la tabla `lecturas` existente.

### Ejemplo de payload esperado

```json
{
	"id": "ESP32",
	"temp": 24.5,
	"hum": 61.2,
	"pres": 1011.4,
	"rs": 345.2,
	"viento": 8.4,
	"dir": 180,
	"Vibracion": 0,
	"Sonido": 1
}
```

### Ejemplo de uso

`POST /api/lecturas` guarda una lectura o un arreglo de lecturas. `GET /api/lecturas?limit=24` devuelve la serie más reciente con el formato que ya consume el dashboard.

### Paso a paso resumido

1. Crea la base de datos en PostgreSQL.
2. Crea el bucket en InfluxDB.
3. Crea el token con permisos de lectura y escritura.
4. Copia las variables al `.env`.
5. Ejecuta las migraciones en PostgreSQL.
6. Reinicia Laravel o limpia la caché de configuración si hace falta.
7. Envía datos desde el ESP32 al endpoint de Laravel.
8. Verifica el dashboard y la data en InfluxDB.

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

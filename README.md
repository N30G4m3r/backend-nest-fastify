# NestJS + Fastify en Node.js 24 con Docker Multi-Entorno

Proyecto de demostración estructurado para ejecutar NestJS de alto rendimiento sobre Fastify y Node.js 24 (`node:24-alpine`), configurado para soportar múltiples entornos mediante Docker Compose (`development`, `qa` y `production` con actualización Zero-Downtime).

---

## 🛠️ Stack Tecnológico
- **Runtime:** Node.js 24 (`node:24-alpine`)
- **Framework:** NestJS 11
- **Motor HTTP:** Fastify Adapter (`@nestjs/platform-fastify`)
- **Gestor de Paquetes:** `pnpm`
- **Logger:** `Logger` nativo de `@nestjs/common`
- **Contenedores:** Docker & Docker Compose (Multi-stage build)

---

## 🚀 Endpoints Disponibles

| Método | Ruta | Descripción | Ejemplo de Respuesta |
|---|---|---|---|
| `GET` | `/` | Devuelve texto plano con saludo e imprime log en consola. | `"Hola Mundo"` |
| `GET` | `/health` | Verificación de salud (Healthcheck de Docker). | `{"status":"ok","environment":"development","uptime":12.34}` |

---

## 📁 Archivos de Variables de Entorno

Existen plantillas predefinidas:
- `.env.dev.example`
- `.env.qa.example`
- `.env.prod.example`

Para usarlas, puedes copiarlas según el entorno deseado:
```bash
cp .env.dev.example .env.dev
cp .env.qa.example .env.qa
cp .env.prod.example .env.prod
```

*(Nota: Los archivos compose están configurados con fallback automático a los archivos `.example` si los archivos locales `.env.*` aún no han sido creados).*

---

## 🐳 Comandos Docker Compose por Entorno

### 1. Entorno de Desarrollo (Hot-Reload)
Compila en la etapa `development`, monta el volumen `./src` para recargar en vivo cualquier cambio y expone el puerto `3000`.

```bash
# Iniciar contenedor en segundo plano
docker compose --env-file .env.dev.example -f docker-compose.dev.yml up -d --build

# Ver logs en tiempo real (auditoría de endpoints)
docker compose -f docker-compose.dev.yml logs -f

# Detener el entorno
docker compose -f docker-compose.dev.yml down
```

### 2. Entorno de Pruebas / QA
Ejecuta la imagen ligera de producción en el puerto dinámico `4000` con `healthcheck` activo.

```bash
# Iniciar contenedor en segundo plano
docker compose --env-file .env.qa.example -f docker-compose.qa.yml up -d --build

# Comprobar salud del contenedor
docker ps --filter "name=backend-qa"

# Probar endpoint healthcheck en el puerto 4000
curl http://localhost:4000/health

# Detener el entorno
docker compose -f docker-compose.qa.yml down
```

### 3. Entorno de Producción (Zero-Downtime)
Ejecuta la versión compilada en el puerto `3000` con política de actualización `start-first`.

```bash
# Iniciar contenedor en producción
docker compose --env-file .env.prod.example -f docker-compose.prod.yml up -d --build

# Probar despliegue Zero-Downtime al actualizar:
# Docker levantará primero el nuevo contenedor, esperará que responda exitosamente
# al healthcheck (/health) antes de apagar el contenedor anterior.
docker compose --env-file .env.prod.example -f docker-compose.prod.yml up -d --build --no-deps backend-prod

# Detener el entorno
docker compose -f docker-compose.prod.yml down
```

---

## 💻 Ejecución Local (Sin Docker)

Si deseas ejecutarlo directamente en tu máquina host:

```bash
# Instalar dependencias
pnpm install

# Modo desarrollo (watch mode)
pnpm run start:dev

# Compilar para producción
pnpm run build

# Ejecutar producción
pnpm run start:prod
```

---

## 📄 Licencia

Este proyecto es una demostración de código abierto y está distribuido bajo la licencia [MIT](LICENSE).

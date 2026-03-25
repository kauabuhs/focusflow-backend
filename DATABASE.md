# 🗄️ Database Configuration - FocusFlow

## Overview

This document explains the PostgreSQL database setup for FocusFlow backend development using Docker Compose and Prisma ORM.

## Prerequisites

- ✅ Docker & Docker Compose installed
- ✅ Node.js 18+ with npm
- ✅ Prisma CLI (`npm install -D prisma`)

## Database Credentials

```
Database: focusflow
User: focusflow
Password: focusflow2026
Host: localhost:5432
```

## Quick Start

### 1. Start PostgreSQL Container

```bash
cd FocusFlow
docker-compose up -d
```

This command:
- Creates a PostgreSQL 16 (Alpine) container named `focusflow-db`
- Initializes the `focusflow` database
- Creates the `focusflow` user with authentication
- Maps port `5432` on localhost
- Enables health checks
- Persists data in volume `focusflow_postgres_data`

### 2. Verify Database Connection

```bash
# Check container status
docker ps | grep focusflow-db

# Test connection
docker exec focusflow-db psql -U focusflow -d focusflow -c "SELECT version();"
```

### 3. Run Prisma Migrations

```bash
cd focusflow-backend

# Create/apply migrations
npx prisma migrate dev --name <migration_name>

# Reset database (CAUTION: deletes all data)
npx prisma migrate reset
```

### 4. View Database UI (Optional)

```bash
npx prisma studio
```

Opens interactive UI at `http://localhost:5555`

## Environment Configuration

### `.env` Setup

File: `focusflow-backend/.env`

```ini
DATABASE_URL="postgresql://focusflow:focusflow2026@localhost:5432/focusflow?schema=public"
```

### `prisma.config.ts` Setup

File: `focusflow-backend/prisma.config.ts`

```typescript
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env["DATABASE_URL"],
  },
});
```

**Key Points:**
- `import "dotenv/config"` loads environment variables from `.env`
- `schema` points to Prisma schema file
- `datasoure.url` reads `DATABASE_URL` from environment

### `docker-compose.yml` Setup

```yaml
services:
  postgres:
    image: postgres:16-alpine
    container_name: focusflow-db
    environment:
      POSTGRES_USER: focusflow
      POSTGRES_PASSWORD: focusflow2026
      POSTGRES_DB: focusflow
      POSTGRES_INITDB_ARGS: "--encoding=UTF8 --locale=en_US.UTF-8"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U focusflow -d focusflow"]
      interval: 10s
      timeout: 5s
      retries: 5
```

**Key Configuration:**
- `postgres:16-alpine`: Lightweight PostgreSQL image
- `POSTGRES_USER/PASSWORD/DB`: Initial credentials
- `postgres_data` volume: Persistent storage
- Health check: Ensures readiness before use

## Prisma Schema Structure

File: `focusflow-backend/prisma/schema.prisma`

### Current Models

1. **Usuario** - User accounts
   - Fields: id, nome, email, senha, criadoEm
   - Relations: tarefas, projetos, sessoesFoco

2. **Projeto** - Task grouping
   - Fields: id, nome, usuarioId, criadoEm
   - Relations: usuario (owner), tarefas (tasks)

3. **Tarefa** - Individual tasks
   - Fields: id, titulo, descricao, status, prioridade, usuarioId, projetoId, timestamps
   - Relations: usuario, projeto, tags, sessoesFoco
   - Enums: StatusTarefa (PENDENTE, EM_ANDAMENTO, CONCLUIDA)

4. **Tag** - Task classification
   - Fields: id, nome
   - Relations: tarefas (N:N via TarefaTag)

5. **TarefaTag** - Junction table
   - Links Tarefa and Tag (many-to-many)

6. **SessaoFoco** - Focus session tracking
   - Fields: id, inicio, fim, duracao, usuarioId, tarefaId
   - Relations: usuario, tarefa

## Common Commands

### Development Workflow

```bash
# Generate Prisma Client
npx prisma generate

# Create migration from schema changes
npx prisma migrate dev --name <description>

# View pending migrations
npx prisma migrate status

# Check schema with database
npx prisma db push

# Reset database (careful!)
npx prisma migrate reset --force
```

### Troubleshooting

#### Password Authentication Failed

**Error:** `P1000: Authentication failed against database server`

**Solution:**
```bash
# Reset database completely
docker-compose down -v
docker-compose up -d
npm run prisma migrate dev
```

#### Cannot Connect to Server

**Error:** `connection to server at "localhost" (127.0.0.1), port 5432 failed`

**Solution:**
```bash
# Check if container is running
docker ps

# View container logs
docker logs focusflow-db

# Restart container
docker restart focusflow-db
```

#### Port Already in Use

**Error:** `bind: address already in use`

**Solution:**
```bash
# Find process using port 5432
netstat -ano | findstr :5432

# Kill process (Windows)
taskkill /PID <PID> /F

# Or change port in docker-compose.yml
ports:
  - "5433:5432"  # Map to 5433 instead
```

## Backup & Restore

### Backup Database

```bash
docker exec focusflow-db pg_dump -U focusflow focusflow > backup.sql
```

### Restore Database

```bash
docker exec -i focusflow-db psql -U focusflow focusflow < backup.sql
```

## Production Setup

For production deployment:

1. **Use Environment Variables:**
   - Set `DATABASE_URL` via hosting platform config
   - Don't commit `.env` to version control

2. **Use Managed Database:**
   - Consider Managed PostgreSQL (AWS RDS, Heroku, etc.)
   - Update `DATABASE_URL` accordingly

3. **Enable SSL:**
   ```
   DATABASE_URL="postgresql://user:pass@host:5432/db?ssl=require"
   ```

4. **Connection Pooling:**
   - Use PgBouncer or Prisma Accelerate for production
   - Reduces connection overhead

## References

- [Prisma Documentation](https://www.prisma.io/docs/)
- [PostgreSQL Docker Hub](https://hub.docker.com/_/postgres)
- [Docker Compose Documentation](https://docs.docker.com/compose/)

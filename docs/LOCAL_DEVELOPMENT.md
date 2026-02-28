# Local Development Guide

> Hands-on setup for running the Mobile Fit App stack locally using Docker Compose and Kind.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Repository Setup](#repository-setup)
3. [Environment Variables](#environment-variables)
4. [Option A: Docker Compose (Recommended)](#option-a-docker-compose-recommended)
5. [Option B: Local Kind Cluster](#option-b-local-kind-cluster)
6. [Running the Mobile App](#running-the-mobile-app)
7. [Database Migrations](#database-migrations)
8. [Common Makefile Commands](#common-makefile-commands)
9. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Install the following tools before starting:

| Tool | Version | Install |
|------|---------|---------|
| Docker Desktop | Latest | https://www.docker.com/products/docker-desktop |
| Node.js | 20+ | https://nodejs.org |
| Python | 3.12 | https://www.python.org |
| uv | Latest | https://docs.astral.sh/uv/getting-started/installation |
| pnpm | Latest | `npm install -g pnpm` |
| Kind | Latest | https://kind.sigs.k8s.io/docs/user/quick-start |
| kubectl | Latest | https://kubernetes.io/docs/tasks/tools |
| Helm | v3.14+ | https://helm.sh/docs/intro/install |
| Expo CLI | Latest | `npm install -g expo-cli` |

---

## Repository Setup

```bash
git clone https://github.com/yourorg/mobile-fit-app.git
cd mobile-fit-app

# Install Node dependencies for all packages
pnpm install

# Install Python dependencies for the backend
cd backend && uv sync && cd ..
```

---

## Environment Variables

Copy the example file and fill in your values:

```bash
cp .env.example .env
```

```env
# .env

# Required
OPENAI_API_KEY=sk-...

# OAuth (optional for local dev — disable social login if not set)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
APPLE_CLIENT_ID=
APPLE_CLIENT_SECRET=

# Auto-populated by Docker Compose — do not change unless running bare-metal
DATABASE_URL=postgresql+asyncpg://fitapp:fitapp_dev@localhost:5432/fitapp
JWT_SECRET=dev-secret-change-in-prod
```

> **Never commit your `.env` file.** It is listed in `.gitignore` by default.

---

## Option A: Docker Compose (Recommended)

This starts PostgreSQL, the FastAPI backend, and the Better Auth service in containers. No Kubernetes needed.

### Start

```bash
make dev
```

Services available after startup:

| Service | URL |
|---------|-----|
| FastAPI API | http://localhost:8080 |
| API Docs (Swagger) | http://localhost:8080/docs |
| Better Auth | http://localhost:3000 |
| PostgreSQL | localhost:5432 |

### Stop

```bash
make dev-down
```

### View logs

```bash
make dev-logs

# Single service
docker compose logs -f api
docker compose logs -f auth
docker compose logs -f postgres
```

### Rebuild after code changes

```bash
docker compose up -d --build api
```

---

## Option B: Local Kind Cluster

Use this option to test Kubernetes manifests and Helm charts locally before pushing to AWS EKS.

### 1. Create the cluster

```bash
make kind-create
```

This creates a Kind cluster named `fitapp` and installs the NGINX ingress controller.

```yaml
# scripts/kind-config.yaml (reference)
kind: Cluster
apiVersion: kind.x-k8s.io/v1alpha4
nodes:
  - role: control-plane
    kubeadmConfigPatches:
      - |
        kind: InitConfiguration
        nodeRegistration:
          kubeletExtraArgs:
            node-labels: "ingress-ready=true"
    extraPortMappings:
      - containerPort: 80
        hostPort: 80
      - containerPort: 443
        hostPort: 443
  - role: worker
  - role: worker
```

### 2. Build and load images

```bash
make build

kind load docker-image fit-api:local --name fitapp
kind load docker-image better-auth:local --name fitapp
```

### 3. Deploy with Helm

```bash
# Deploy backend API
helm upgrade --install fit-api ./helm/fit-api \
  --namespace fitapp \
  --create-namespace \
  -f ./helm/fit-api/values.yaml \
  --set image.repository=fit-api \
  --set image.tag=local

# Deploy auth service
helm upgrade --install better-auth ./helm/better-auth \
  --namespace fitapp \
  -f ./helm/better-auth/values.yaml \
  --set image.repository=better-auth \
  --set image.tag=local
```

### 4. Verify pods

```bash
kubectl get pods -n fitapp
kubectl get ingress -n fitapp
```

### 5. Delete the cluster

```bash
make kind-delete
```

---

## Running the Mobile App

The Expo app connects to the local backend via the `EXPO_PUBLIC_API_URL` variable.

```bash
cd apps/mobile

# Copy environment
cp .env.example .env.local
# Set EXPO_PUBLIC_API_URL=http://localhost:8080

# Start the dev server
npx expo start
```

- Press `i` to open iOS Simulator (macOS only)
- Press `a` to open Android Emulator
- Scan the QR code with **Expo Go** on a physical device

> For physical device testing, replace `localhost` with your machine's local IP address (e.g., `192.168.1.x`).

---

## Database Migrations

Migrations are managed with Alembic.

```bash
cd backend

# Apply all pending migrations
uv run alembic upgrade head

# Create a new migration after changing a SQLAlchemy model
uv run alembic revision --autogenerate -m "add_user_progress_table"

# Rollback one migration
uv run alembic downgrade -1

# Check current migration state
uv run alembic current
```

To seed the database with sample data:

```bash
bash scripts/seed-db.sh
```

---

## Common Makefile Commands

```bash
make help          # List all available commands

# Development
make dev           # Start Docker Compose stack
make dev-down      # Stop Docker Compose stack
make dev-logs      # Tail all service logs

# Testing
make test          # Run all tests (backend + auth + mobile)
make test-coverage # Run backend tests with HTML coverage report

# Linting
make lint          # Run ruff, mypy, ESLint across all services

# Building
make build         # Build all Docker images locally

# Kind (local K8s)
make kind-create   # Create Kind cluster
make kind-delete   # Delete Kind cluster
make kind-deploy   # Apply local K8s manifests

# Database
make db-migrate    # Apply pending Alembic migrations
make db-rollback   # Rollback last migration

# Mobile
make mobile-start  # Start Expo dev server
```

---

## Troubleshooting

### Postgres container fails to start

Check if port 5432 is already in use:

```bash
# macOS / Linux
lsof -i :5432

# Windows
netstat -ano | findstr :5432
```

Stop any conflicting service or change the host port in `docker-compose.yaml`:

```yaml
ports:
  - "5433:5432"   # Use 5433 on host instead
```

Then update `DATABASE_URL` in `.env` accordingly.

---

### API returns 401 Unauthorized

Ensure the `JWT_SECRET` in your `.env` matches the one the auth service is using.  
For local development, both services share the same default: `dev-secret-change-in-prod`.

---

### OpenAI API errors

The diet and workout generation endpoints require a valid `OPENAI_API_KEY`.  
Without it, those endpoints return a 500 error. Calculator and health endpoints still work.

---

### Kind cluster — images not found (ErrImagePull)

Images must be loaded into Kind before deploying:

```bash
kind load docker-image fit-api:local --name fitapp
kind load docker-image better-auth:local --name fitapp
```

---

### Mobile app cannot reach the backend

- **Emulator:** Use `http://10.0.2.2:8080` (Android) or `http://localhost:8080` (iOS Simulator)
- **Physical device:** Use your machine's local IP (`http://192.168.x.x:8080`)
- Ensure Docker Compose ports are exposed and no firewall is blocking them

---

### Backend hot-reload not working

For live reload during development without rebuilding the image, mount the source directory:

```bash
docker compose -f docker-compose.yaml -f docker-compose.dev.yaml up
```

`docker-compose.dev.yaml`:

```yaml
services:
  api:
    volumes:
      - ./backend:/app
    command: uvicorn app.main:app --host 0.0.0.0 --port 8080 --reload
```

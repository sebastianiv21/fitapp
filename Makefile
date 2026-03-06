.PHONY: dev dev-down dev-logs build test lint help web-dev web-install

help:
	@echo "Available commands:"
	@echo "  make dev        - Start the full stack (postgres + api + auth + web)"
	@echo "  make dev-down   - Stop the stack"
	@echo "  make dev-logs   - Tail logs from all services"
	@echo "  make build      - Build Docker images"
	@echo "  make test       - Run backend tests"
	@echo "  make lint       - Run linter and type checker"
	@echo "  make web-install- Install web dependencies"
	@echo "  make web-dev    - Start web dev server locally"

dev:
	docker compose up -d

dev-down:
	docker compose down

dev-logs:
	docker compose logs -f

build:
	docker compose build

test:
	cd backend && uv run pytest

lint:
	cd backend && uv run ruff check . && uv run mypy app

web-install:
	cd web && pnpm install

web-dev:
	cd web && pnpm dev

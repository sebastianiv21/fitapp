# Stage 1: build dependencies
FROM python:3.14-slim AS builder

WORKDIR /app

RUN pip install uv

COPY pyproject.toml uv.lock ./
RUN uv sync --frozen --no-dev

# Stage 2: runtime
FROM python:3.14-slim

WORKDIR /app

# Non-root user for security
RUN useradd -m appuser

# Copy installed packages and app code
COPY --from=builder /app/.venv /app/.venv
COPY app/ app/

USER appuser

ENV PATH="/app/.venv/bin:$PATH"

EXPOSE 8080

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8080"]

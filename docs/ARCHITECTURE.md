# Fit App - Technical Architecture & DevOps Guide

> A hands-on DevOps portfolio project: AI-powered Fitness & Nutrition web app with Python/FastAPI backend, Next.js frontend, Kubernetes, GitOps, and production-grade CI/CD practices.

---

## Table of Contents

1. [Overview](#overview)
2. [Technology Stack](#technology-stack)
3. [Architecture Diagram](#architecture-diagram)
4. [Project Structure](#project-structure)
5. [Infrastructure (Terraform)](#infrastructure-terraform)
6. [Kubernetes Resources (Helm)](#kubernetes-resources-helm)
7. [CI/CD Pipeline](#cicd-pipeline)
8. [GitOps with ArgoCD](#gitops-with-argocd)
9. [Deployment Strategies](#deployment-strategies)
10. [Authentication (Better Auth)](#authentication-better-auth)
11. [Backend API (Go)](#backend-api-go)
12. [Web Frontend (Next.js)](#web-frontend-nextjs)
13. [Observability](#observability)
14. [Disaster Recovery](#disaster-recovery)
15. [Incident Response](#incident-response)
16. [Security](#security)
17. [Local Development](#local-development)
18. [Implementation Phases](#implementation-phases)
19. [Cost Estimation](#cost-estimation)
20. [DevOps Skills Checklist](#devops-skills-checklist)

---

## Overview

### Goals
- Build a production-ready fitness/nutrition SaaS web app
- Showcase DevOps skills: IaC, K8s, CI/CD, monitoring
- Avoid vendor lock-in with portable, open-source solutions
- Practice real-world cloud engineering patterns

### Product Features (from PRD)
- Calorie/BMR calculator (Mifflin-St Jeor formula)
- **AI-powered diet generation** (OpenAI GPT-4o-mini)
- **AI-powered workout routines** (personalized to goals/limitations)
- Progress tracking
- Smart reminders
- Social login (Google, Apple)

### Why This Stack for DevOps Portfolio?
- **Python + AI:** Realistic for modern SaaS (most AI startups use Python)
- **Minimal backend code:** Focus on infrastructure, not debugging code
- **FastAPI:** Auto-generates OpenAPI docs, async-native, type-safe
- **Real AI integration:** Shows you can deploy ML/AI workloads

---

## Technology Stack

| Layer | Technology | Why |
|-------|------------|-----|
| **Frontend** | Next.js (App Router) + React | SSR/SSG, realistic web DevOps patterns |
| **State Management** | Zustand | Simple, minimal boilerplate |
| **Backend** | Python 3.12 + FastAPI | AI-native, realistic for AI-SaaS, minimal code |
| **AI/LLM** | OpenAI / LangChain | Diet & workout generation, recommendations |
| **Auth** | Better Auth (self-hosted) | No vendor lock-in, free, social login |
| **Database** | PostgreSQL | Reliable, widely used |
| **ORM** | SQLAlchemy + Alembic | Type-safe queries, migrations |
| **Container Registry** | Amazon ECR | (Portable: DockerHub, GHCR) |
| **Kubernetes** | Amazon EKS | Managed K8s (Portable: GKE, AKS) |
| **K8s Manifests** | Helm | Charts, templating, DevOps standard |
| **IaC** | Terraform | Industry standard, multi-cloud |
| **CI/CD** | GitHub Actions | Free, integrates with everything |
| **Local K8s** | Kind | Lightweight, fast |
| **API Docs** | OpenAPI (auto-generated) | FastAPI generates docs automatically |
| **Secrets** | External Secrets Operator | Syncs from AWS Secrets Manager |
| **Monitoring** | Prometheus + Grafana | Open-source, portable |
| **Logging** | CloudWatch / Loki | Centralized logs |
| **Admin** | React (Vite) | Simple admin dashboard |

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              INTERNET                                        │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         AWS Application Load Balancer                        │
│                            (via Ingress Controller)                          │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    ▼               ▼               ▼
              ┌──────────┐   ┌──────────┐   ┌──────────┐
              │ fit-api  │   │  better  │   │  admin   │
              │   (Go)   │   │   auth   │   │dashboard │
              │ 2+ pods  │   │ (Node)   │   │ (React)  │
              └────┬─────┘   └────┬─────┘   └──────────┘
                   │              │
                   └──────┬───────┘
                          ▼
              ┌─────────────────────┐
              │  Amazon RDS         │
              │  (PostgreSQL)       │
              └─────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                           Amazon EKS Cluster                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │  Prometheus │  │   Grafana   │  │  External   │  │    HPA      │        │
│  │             │  │             │  │   Secrets   │  │ (Autoscale) │        │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘        │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                           Supporting Services                                │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │  Amazon S3  │  │ Amazon ECR  │  │   Secrets   │  │ CloudWatch  │        │
│  │  (Assets)   │  │ (Images)    │  │   Manager   │  │   (Logs)    │        │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘        │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                           Web Client                                         │
│  ┌──────────────────────────┐                                               │
│  │  Next.js (App Router)   │  ← SSR/SSG + React                            │
│  └──────────────────────────┘                                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Project Structure

```
fitapp/
├── web/                                # Next.js frontend (App Router)
│   ├── app/                            # App Router pages
│   │   ├── layout.tsx                  # Root layout
│   │   ├── page.tsx                    # Landing page
│   │   ├── (auth)/                     # Auth pages (login, register)
│   │   │   ├── login/page.tsx
│   │   │   └── register/page.tsx
│   │   ├── dashboard/                  # Main dashboard
│   │   │   ├── page.tsx
│   │   │   ├── diet/page.tsx
│   │   │   ├── workout/page.tsx
│   │   │   └── progress/page.tsx
│   │   └── onboarding/page.tsx         # User data collection
│   ├── components/                     # Reusable UI components
│   ├── lib/                            # API client, auth helpers, utils
│   ├── store/                          # Zustand stores
│   ├── types/                          # TypeScript types
│   ├── public/                         # Static assets
│   ├── next.config.ts
│   ├── package.json
│   ├── Dockerfile
│   └── tsconfig.json
│
├── backend/                        # Python FastAPI service
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py                 # FastAPI entry point
│   │   ├── config.py               # Settings (pydantic-settings)
│   │   ├── routers/                # API routes
│   │   │   ├── __init__.py
│   │   │   ├── health.py
│   │   │   ├── users.py
│   │   │   ├── nutrition.py
│   │   │   └── workout.py
│   │   ├── services/               # Business logic
│   │   │   ├── __init__.py
│   │   │   ├── calculator.py       # BMR/TDEE calculations
│   │   │   ├── diet_ai.py          # AI-powered diet generation
│   │   │   └── workout_ai.py       # AI-powered workout generation
│   │   ├── models/                 # SQLAlchemy models
│   │   │   ├── __init__.py
│   │   │   ├── user.py
│   │   │   └── progress.py
│   │   ├── schemas/                # Pydantic schemas (DTOs)
│   │   │   ├── __init__.py
│   │   │   ├── user.py
│   │   │   └── nutrition.py
│   │   ├── middleware/             # Auth, logging
│   │   │   ├── __init__.py
│   │   │   └── auth.py             # JWT validation
│   │   └── db/                     # Database
│   │       ├── __init__.py
│   │       └── session.py
│   ├── alembic/                    # Database migrations
│   │   ├── versions/
│   │   └── env.py
│   ├── tests/
│   │   ├── __init__.py
│   │   ├── test_nutrition.py
│   │   └── test_workout.py
│   ├── alembic.ini
│   ├── Dockerfile
│   ├── pyproject.toml              # Dependencies (Poetry/uv)
│   └── requirements.txt
│
├── auth/                           # Better Auth service
│   ├── src/
│   │   ├── index.ts                # Entry point
│   │   └── auth.ts                 # Better Auth config
│   ├── Dockerfile
│   ├── package.json
│   └── tsconfig.json
│
├── infra/                          # Infrastructure as Code
│   └── terraform/
│       ├── modules/
│       │   ├── vpc/
│       │   │   ├── main.tf
│       │   │   ├── variables.tf
│       │   │   └── outputs.tf
│       │   ├── eks/
│       │   │   ├── main.tf
│       │   │   ├── variables.tf
│       │   │   └── outputs.tf
│       │   ├── rds/
│       │   │   ├── main.tf
│       │   │   ├── variables.tf
│       │   │   └── outputs.tf
│       │   ├── ecr/
│       │   │   ├── main.tf
│       │   │   ├── variables.tf
│       │   │   └── outputs.tf
│       │   └── s3/
│       │       ├── main.tf
│       │       ├── variables.tf
│       │       └── outputs.tf
│       ├── environments/
│       │   ├── dev/
│       │   │   ├── main.tf
│       │   │   ├── variables.tf
│       │   │   ├── terraform.tfvars
│       │   │   └── backend.tf
│       │   ├── staging/
│       │   │   └── ...
│       │   └── prod/
│       │       └── ...
│       └── README.md
│
├── helm/                           # Kubernetes Helm charts
│   ├── fit-api/
│   │   ├── Chart.yaml
│   │   ├── values.yaml
│   │   ├── values-dev.yaml
│   │   ├── values-staging.yaml
│   │   ├── values-prod.yaml
│   │   └── templates/
│   │       ├── deployment.yaml
│   │       ├── service.yaml
│   │       ├── ingress.yaml
│   │       ├── hpa.yaml
│   │       ├── configmap.yaml
│   │       └── external-secret.yaml
│   ├── better-auth/
│   │   ├── Chart.yaml
│   │   ├── values.yaml
│   │   └── templates/
│   │       └── ...
│   ├── admin/
│   │   ├── Chart.yaml
│   │   ├── values.yaml
│   │   └── templates/
│   │       └── ...
│   └── monitoring/
│       ├── Chart.yaml
│       └── values.yaml             # Prometheus + Grafana config
│
├── .github/
│   └── workflows/
│       ├── ci.yaml                 # Lint, test, build
│       ├── cd-infra.yaml           # Terraform plan/apply
│       ├── cd-images.yaml          # Build & push images
│       ├── cd-web.yaml             # Web frontend build & deploy
│       └── security-scan.yaml      # Trivy, dependency scan
│
├── gitops/                         # ArgoCD GitOps
│   ├── applications/
│   │   ├── fit-api.yaml
│   │   ├── better-auth.yaml
│   │   └── admin.yaml
│   ├── environments/
│   │   ├── dev/
│   │   ├── staging/
│   │   └── prod/
│   └── app-of-apps/
│       ├── dev.yaml
│       ├── staging.yaml
│       └── prod.yaml
│
├── scripts/
│   ├── setup-local.sh              # Local dev setup
│   ├── create-kind-cluster.sh      # Kind cluster creation
│   ├── seed-db.sh                  # Database seeding
│   └── dr/                         # Disaster recovery scripts
│       ├── restore-database.sh
│       └── full-cluster-recovery.sh
│
├── runbooks/                       # Incident runbooks
│   ├── high-error-rate.md
│   ├── database-connection-exhaustion.md
│   ├── pod-crash-looping.md
│   └── post-mortem-template.md
│
├── docker-compose.yaml             # Local development
├── Makefile                        # Common commands
├── .gitignore
├── .env.example
├── PRD.md                          # Product Requirements
├── ARCHITECTURE.md                 # This file
└── README.md                       # Project README
```

---

## Infrastructure (Terraform)

### Module: VPC

```hcl
# infra/terraform/modules/vpc/main.tf

module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "~> 5.0"

  name = "${var.project_name}-vpc"
  cidr = var.vpc_cidr

  azs             = var.availability_zones
  private_subnets = var.private_subnet_cidrs
  public_subnets  = var.public_subnet_cidrs

  enable_nat_gateway   = true
  single_nat_gateway   = var.environment != "prod"
  enable_dns_hostnames = true
  enable_dns_support   = true

  # Tags required for EKS
  public_subnet_tags = {
    "kubernetes.io/role/elb"                    = 1
    "kubernetes.io/cluster/${var.cluster_name}" = "owned"
  }

  private_subnet_tags = {
    "kubernetes.io/role/internal-elb"           = 1
    "kubernetes.io/cluster/${var.cluster_name}" = "owned"
  }

  tags = var.tags
}
```

### Module: EKS

```hcl
# infra/terraform/modules/eks/main.tf

module "eks" {
  source  = "terraform-aws-modules/eks/aws"
  version = "~> 20.0"

  cluster_name    = var.cluster_name
  cluster_version = "1.29"

  vpc_id     = var.vpc_id
  subnet_ids = var.private_subnet_ids

  cluster_endpoint_public_access = true

  eks_managed_node_groups = {
    default = {
      name           = "default-ng"
      instance_types = var.node_instance_types
      
      min_size     = var.node_min_size
      max_size     = var.node_max_size
      desired_size = var.node_desired_size

      labels = {
        Environment = var.environment
      }
    }
  }

  # Enable IRSA for External Secrets Operator
  enable_irsa = true

  tags = var.tags
}

# IAM role for External Secrets Operator
module "external_secrets_irsa" {
  source  = "terraform-aws-modules/iam/aws//modules/iam-role-for-service-accounts-eks"
  version = "~> 5.0"

  role_name = "${var.cluster_name}-external-secrets"

  attach_external_secrets_policy = true

  oidc_providers = {
    main = {
      provider_arn               = module.eks.oidc_provider_arn
      namespace_service_accounts = ["external-secrets:external-secrets"]
    }
  }
}
```

### Module: RDS

```hcl
# infra/terraform/modules/rds/main.tf

module "rds" {
  source  = "terraform-aws-modules/rds/aws"
  version = "~> 6.0"

  identifier = "${var.project_name}-postgres"

  engine               = "postgres"
  engine_version       = "15.4"
  family               = "postgres15"
  major_engine_version = "15"
  instance_class       = var.instance_class

  allocated_storage     = var.allocated_storage
  max_allocated_storage = var.max_allocated_storage

  db_name  = var.database_name
  username = var.database_username
  port     = 5432

  # Store password in Secrets Manager
  manage_master_user_password = true

  vpc_security_group_ids = [aws_security_group.rds.id]
  subnet_ids             = var.private_subnet_ids

  backup_retention_period = var.environment == "prod" ? 7 : 1
  deletion_protection     = var.environment == "prod"
  skip_final_snapshot     = var.environment != "prod"

  tags = var.tags
}

resource "aws_security_group" "rds" {
  name_prefix = "${var.project_name}-rds-"
  vpc_id      = var.vpc_id

  ingress {
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [var.eks_node_security_group_id]
  }

  tags = var.tags
}
```

### Module: ECR

```hcl
# infra/terraform/modules/ecr/main.tf

resource "aws_ecr_repository" "repos" {
  for_each = toset(var.repository_names)

  name                 = "${var.project_name}/${each.key}"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }

  encryption_configuration {
    encryption_type = "AES256"
  }

  tags = var.tags
}

resource "aws_ecr_lifecycle_policy" "cleanup" {
  for_each   = aws_ecr_repository.repos
  repository = each.value.name

  policy = jsonencode({
    rules = [{
      rulePriority = 1
      description  = "Keep last 10 images"
      selection = {
        tagStatus   = "any"
        countType   = "imageCountMoreThan"
        countNumber = 10
      }
      action = {
        type = "expire"
      }
    }]
  })
}
```

### Environment Configuration

```hcl
# infra/terraform/environments/dev/main.tf

terraform {
  required_version = ">= 1.5.0"
  
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  backend "s3" {
    bucket         = "fitapp-terraform-state"
    key            = "dev/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "terraform-locks"
    encrypt        = true
  }
}

provider "aws" {
  region = var.aws_region
  
  default_tags {
    tags = {
      Project     = "fitapp"
      Environment = "dev"
      ManagedBy   = "terraform"
    }
  }
}

module "vpc" {
  source = "../../modules/vpc"
  
  project_name       = var.project_name
  cluster_name       = "${var.project_name}-${var.environment}"
  vpc_cidr           = "10.0.0.0/16"
  availability_zones = ["us-east-1a", "us-east-1b"]
  private_subnet_cidrs = ["10.0.1.0/24", "10.0.2.0/24"]
  public_subnet_cidrs  = ["10.0.101.0/24", "10.0.102.0/24"]
  environment        = var.environment
  tags               = var.tags
}

module "eks" {
  source = "../../modules/eks"
  
  cluster_name          = "${var.project_name}-${var.environment}"
  vpc_id                = module.vpc.vpc_id
  private_subnet_ids    = module.vpc.private_subnet_ids
  node_instance_types   = ["t3.medium"]
  node_min_size         = 1
  node_max_size         = 3
  node_desired_size     = 2
  environment           = var.environment
  tags                  = var.tags
}

module "rds" {
  source = "../../modules/rds"
  
  project_name               = var.project_name
  vpc_id                     = module.vpc.vpc_id
  private_subnet_ids         = module.vpc.private_subnet_ids
  eks_node_security_group_id = module.eks.node_security_group_id
  instance_class             = "db.t3.micro"
  allocated_storage          = 20
  max_allocated_storage      = 100
  database_name              = "fitapp"
  database_username          = "fitapp_admin"
  environment                = var.environment
  tags                       = var.tags
}

module "ecr" {
  source = "../../modules/ecr"
  
  project_name     = var.project_name
  repository_names = ["fit-api", "better-auth", "web"]
  tags             = var.tags
}
```

---

## Kubernetes Resources (Helm)

### fit-api Chart

```yaml
# helm/fit-api/values.yaml

replicaCount: 2

image:
  repository: ""  # Set by CI/CD
  tag: ""         # Set by CI/CD
  pullPolicy: IfNotPresent

service:
  type: ClusterIP
  port: 8080

ingress:
  enabled: true
  className: alb
  annotations:
    alb.ingress.kubernetes.io/scheme: internet-facing
    alb.ingress.kubernetes.io/target-type: ip
    alb.ingress.kubernetes.io/healthcheck-path: /health
  hosts:
    - host: api.fitapp.example.com
      paths:
        - path: /
          pathType: Prefix

resources:
  requests:
    cpu: 100m
    memory: 128Mi
  limits:
    cpu: 500m
    memory: 512Mi

autoscaling:
  enabled: true
  minReplicas: 2
  maxReplicas: 10
  targetCPUUtilizationPercentage: 70
  targetMemoryUtilizationPercentage: 80

env:
  - name: GIN_MODE
    value: release
  - name: PORT
    value: "8080"

externalSecret:
  enabled: true
  secretStoreRef:
    name: aws-secrets-manager
    kind: ClusterSecretStore
  data:
    - secretKey: DATABASE_URL
      remoteRef:
        key: fitapp/dev/database
        property: url
    - secretKey: JWT_SECRET
      remoteRef:
        key: fitapp/dev/jwt
        property: secret
```

```yaml
# helm/fit-api/templates/deployment.yaml

apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{ include "fit-api.fullname" . }}
  labels:
    {{- include "fit-api.labels" . | nindent 4 }}
spec:
  {{- if not .Values.autoscaling.enabled }}
  replicas: {{ .Values.replicaCount }}
  {{- end }}
  selector:
    matchLabels:
      {{- include "fit-api.selectorLabels" . | nindent 6 }}
  template:
    metadata:
      labels:
        {{- include "fit-api.selectorLabels" . | nindent 8 }}
    spec:
      containers:
        - name: {{ .Chart.Name }}
          image: "{{ .Values.image.repository }}:{{ .Values.image.tag }}"
          imagePullPolicy: {{ .Values.image.pullPolicy }}
          ports:
            - name: http
              containerPort: 8080
              protocol: TCP
          livenessProbe:
            httpGet:
              path: /health
              port: http
            initialDelaySeconds: 10
            periodSeconds: 10
          readinessProbe:
            httpGet:
              path: /health
              port: http
            initialDelaySeconds: 5
            periodSeconds: 5
          resources:
            {{- toYaml .Values.resources | nindent 12 }}
          envFrom:
            - secretRef:
                name: {{ include "fit-api.fullname" . }}-secrets
          env:
            {{- toYaml .Values.env | nindent 12 }}
```

```yaml
# helm/fit-api/templates/hpa.yaml

{{- if .Values.autoscaling.enabled }}
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: {{ include "fit-api.fullname" . }}
  labels:
    {{- include "fit-api.labels" . | nindent 4 }}
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: {{ include "fit-api.fullname" . }}
  minReplicas: {{ .Values.autoscaling.minReplicas }}
  maxReplicas: {{ .Values.autoscaling.maxReplicas }}
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: {{ .Values.autoscaling.targetCPUUtilizationPercentage }}
    - type: Resource
      resource:
        name: memory
        target:
          type: Utilization
          averageUtilization: {{ .Values.autoscaling.targetMemoryUtilizationPercentage }}
{{- end }}
```

```yaml
# helm/fit-api/templates/external-secret.yaml

{{- if .Values.externalSecret.enabled }}
apiVersion: external-secrets.io/v1beta1
kind: ExternalSecret
metadata:
  name: {{ include "fit-api.fullname" . }}-secrets
spec:
  refreshInterval: 1h
  secretStoreRef:
    name: {{ .Values.externalSecret.secretStoreRef.name }}
    kind: {{ .Values.externalSecret.secretStoreRef.kind }}
  target:
    name: {{ include "fit-api.fullname" . }}-secrets
    creationPolicy: Owner
  data:
    {{- range .Values.externalSecret.data }}
    - secretKey: {{ .secretKey }}
      remoteRef:
        key: {{ .remoteRef.key }}
        property: {{ .remoteRef.property }}
    {{- end }}
{{- end }}
```

---

## CI/CD Pipeline

### CI Workflow (Lint, Test, Build)

```yaml
# .github/workflows/ci.yaml

name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

env:
  PYTHON_VERSION: '3.12'
  NODE_VERSION: '20'

jobs:
  lint-backend:
    name: Lint Backend (Python)
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Set up Python
        uses: actions/setup-python@v5
        with:
          python-version: ${{ env.PYTHON_VERSION }}
      
      - name: Install dependencies
        working-directory: backend
        run: |
          pip install ruff mypy
          pip install -r requirements.txt
      
      - name: Ruff lint
        working-directory: backend
        run: ruff check .
      
      - name: Type check
        working-directory: backend
        run: mypy app --ignore-missing-imports

  test-backend:
    name: Test Backend (Python)
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_USER: test
          POSTGRES_PASSWORD: test
          POSTGRES_DB: fitapp_test
        ports:
          - 5432:5432
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    steps:
      - uses: actions/checkout@v4
      
      - name: Set up Python
        uses: actions/setup-python@v5
        with:
          python-version: ${{ env.PYTHON_VERSION }}
      
      - name: Install dependencies
        working-directory: backend
        run: pip install -r requirements.txt
      
      - name: Run tests
        working-directory: backend
        env:
          DATABASE_URL: postgresql+asyncpg://test:test@localhost:5432/fitapp_test
          JWT_SECRET: test-secret
          OPENAI_API_KEY: test-key
        run: |
          pytest -v --cov=app --cov-report=xml
      
      - name: Upload coverage
        uses: codecov/codecov-action@v4
        with:
          files: backend/coverage.xml
          flags: backend

  lint-auth:
    name: Lint Auth Service
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Set up Node
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
      
      - name: Install dependencies
        working-directory: auth
        run: npm ci
      
      - name: Lint
        working-directory: auth
        run: npm run lint

  lint-web:
    name: Lint Web Frontend
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Set up Node
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
      
      - name: Install dependencies
        working-directory: web
        run: pnpm install --frozen-lockfile
      
      - name: Lint
        working-directory: web
        run: pnpm lint
      
      - name: Type check
        working-directory: web
        run: pnpm typecheck

  build-images:
    name: Build Docker Images
    runs-on: ubuntu-latest
    needs: [lint-backend, test-backend, lint-auth, lint-web]
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'
    strategy:
      matrix:
        service: [fit-api, better-auth, web]
        include:
          - service: fit-api
            context: backend
          - service: better-auth
            context: auth
          - service: web
            context: web
    steps:
      - uses: actions/checkout@v4
      
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3
      
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1
      
      - name: Login to ECR
        id: login-ecr
        uses: aws-actions/amazon-ecr-login@v2
      
      - name: Build and push
        uses: docker/build-push-action@v5
        with:
          context: ${{ matrix.context }}
          push: true
          tags: |
            ${{ steps.login-ecr.outputs.registry }}/fitapp/${{ matrix.service }}:${{ github.sha }}
            ${{ steps.login-ecr.outputs.registry }}/fitapp/${{ matrix.service }}:latest
          cache-from: type=gha
          cache-to: type=gha,mode=max
```

### CD Infrastructure Workflow (Terraform)

```yaml
# .github/workflows/cd-infra.yaml

name: CD - Infrastructure

on:
  push:
    branches: [main]
    paths:
      - 'infra/terraform/**'
  workflow_dispatch:
    inputs:
      environment:
        description: 'Environment to deploy'
        required: true
        default: 'dev'
        type: choice
        options:
          - dev
          - staging
          - prod
      action:
        description: 'Terraform action'
        required: true
        default: 'plan'
        type: choice
        options:
          - plan
          - apply
          - destroy

permissions:
  id-token: write
  contents: read
  pull-requests: write

jobs:
  terraform:
    name: Terraform ${{ inputs.action || 'plan' }}
    runs-on: ubuntu-latest
    environment: ${{ inputs.environment || 'dev' }}
    defaults:
      run:
        working-directory: infra/terraform/environments/${{ inputs.environment || 'dev' }}
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: ${{ secrets.AWS_ROLE_ARN }}
          aws-region: us-east-1
      
      - name: Setup Terraform
        uses: hashicorp/setup-terraform@v3
        with:
          terraform_version: 1.7.0
      
      - name: Terraform Init
        run: terraform init
      
      - name: Terraform Validate
        run: terraform validate
      
      - name: Terraform Plan
        id: plan
        run: terraform plan -out=tfplan -no-color
        continue-on-error: true
      
      - name: Comment PR
        if: github.event_name == 'pull_request'
        uses: actions/github-script@v7
        with:
          script: |
            const output = `#### Terraform Plan 📖
            \`\`\`
            ${{ steps.plan.outputs.stdout }}
            \`\`\``;
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: output
            })
      
      - name: Terraform Apply
        if: inputs.action == 'apply' || (github.ref == 'refs/heads/main' && github.event_name == 'push')
        run: terraform apply -auto-approve tfplan
      
      - name: Terraform Destroy
        if: inputs.action == 'destroy'
        run: terraform destroy -auto-approve
```

### CD Backend Workflow (Deploy to EKS)

```yaml
# .github/workflows/cd-backend.yaml

name: CD - Backend

on:
  workflow_run:
    workflows: [CI]
    types: [completed]
    branches: [main]
  workflow_dispatch:
    inputs:
      environment:
        description: 'Environment'
        required: true
        default: 'dev'
        type: choice
        options:
          - dev
          - staging
          - prod

jobs:
  deploy:
    name: Deploy to EKS
    runs-on: ubuntu-latest
    if: ${{ github.event.workflow_run.conclusion == 'success' || github.event_name == 'workflow_dispatch' }}
    environment: ${{ inputs.environment || 'dev' }}
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1
      
      - name: Login to ECR
        id: login-ecr
        uses: aws-actions/amazon-ecr-login@v2
      
      - name: Update kubeconfig
        run: |
          aws eks update-kubeconfig --name fitapp-${{ inputs.environment || 'dev' }} --region us-east-1
      
      - name: Install Helm
        uses: azure/setup-helm@v3
        with:
          version: v3.14.0
      
      - name: Deploy fit-api
        run: |
          helm upgrade --install fit-api ./helm/fit-api \
            --namespace fitapp \
            --create-namespace \
            -f ./helm/fit-api/values-${{ inputs.environment || 'dev' }}.yaml \
            --set image.repository=${{ steps.login-ecr.outputs.registry }}/fitapp/fit-api \
            --set image.tag=${{ github.sha }}
      
      - name: Deploy better-auth
        run: |
          helm upgrade --install better-auth ./helm/better-auth \
            --namespace fitapp \
            -f ./helm/better-auth/values-${{ inputs.environment || 'dev' }}.yaml \
            --set image.repository=${{ steps.login-ecr.outputs.registry }}/fitapp/better-auth \
            --set image.tag=${{ github.sha }}
      
      - name: Verify deployment
        run: |
          kubectl rollout status deployment/fit-api -n fitapp --timeout=300s
          kubectl rollout status deployment/better-auth -n fitapp --timeout=300s
```

---

## GitOps with ArgoCD

### Why GitOps?
In real-world scenarios, you don't want CI pipelines directly applying changes to production clusters. GitOps provides:
- **Audit trail:** Every change is a git commit
- **Rollback:** Just revert a commit
- **Drift detection:** ArgoCD alerts if cluster state differs from git
- **Separation of concerns:** CI builds, CD deploys

### ArgoCD Installation (Terraform)

```hcl
# infra/terraform/modules/argocd/main.tf

resource "helm_release" "argocd" {
  name             = "argocd"
  repository       = "https://argoproj.github.io/argo-helm"
  chart            = "argo-cd"
  version          = "5.51.6"
  namespace        = "argocd"
  create_namespace = true

  values = [
    yamlencode({
      server = {
        extraArgs = ["--insecure"] # For dev; use TLS in prod
        service = {
          type = "LoadBalancer"
        }
      }
      configs = {
        repositories = {
          fitapp = {
            url      = var.git_repo_url
            password = var.git_token
            username = "git"
          }
        }
      }
    })
  ]
}
```

### ArgoCD Application Definitions

```yaml
# gitops/applications/fit-api.yaml

apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: fit-api
  namespace: argocd
  finalizers:
    - resources-finalizer.argocd.argoproj.io
spec:
  project: default
  
  source:
    repoURL: https://github.com/yourorg/fitapp.git
    targetRevision: main
    path: helm/fit-api
    helm:
      valueFiles:
        - values-dev.yaml  # Change per environment
      parameters:
        - name: image.tag
          value: latest  # Overridden by Image Updater

  destination:
    server: https://kubernetes.default.svc
    namespace: fitapp

  syncPolicy:
    automated:
      prune: true      # Delete resources removed from git
      selfHeal: true   # Fix drift automatically
    syncOptions:
      - CreateNamespace=true
    retry:
      limit: 5
      backoff:
        duration: 5s
        factor: 2
        maxDuration: 3m
```

### ArgoCD Image Updater

Auto-updates image tags when new images are pushed to ECR:

```yaml
# gitops/applications/fit-api.yaml (add annotations)

metadata:
  annotations:
    argocd-image-updater.argoproj.io/image-list: fit-api=123456789.dkr.ecr.us-east-1.amazonaws.com/fitapp/fit-api
    argocd-image-updater.argoproj.io/fit-api.update-strategy: latest
    argocd-image-updater.argoproj.io/fit-api.allow-tags: regexp:^[a-f0-9]{40}$
    argocd-image-updater.argoproj.io/write-back-method: git
```

### App of Apps Pattern (Multi-Environment)

```yaml
# gitops/app-of-apps/dev.yaml

apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: dev-apps
  namespace: argocd
spec:
  project: default
  source:
    repoURL: https://github.com/yourorg/fitapp.git
    targetRevision: main
    path: gitops/environments/dev
  destination:
    server: https://kubernetes.default.svc
    namespace: argocd
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
```

```
gitops/
├── applications/           # Individual app definitions
│   ├── fit-api.yaml
│   ├── better-auth.yaml
│   └── admin.yaml
├── environments/
│   ├── dev/
│   │   ├── fit-api.yaml   # Dev-specific overrides
│   │   └── kustomization.yaml
│   ├── staging/
│   └── prod/
└── app-of-apps/
    ├── dev.yaml
    ├── staging.yaml
    └── prod.yaml
```

### Updated CI/CD Flow with GitOps

```
┌─────────────────────────────────────────────────────────────────┐
│  Developer pushes code                                          │
└──────────────────────────────┬──────────────────────────────────┘
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│  GitHub Actions CI                                              │
│  - Lint, Test                                                   │
│  - Build Docker image                                           │
│  - Push to ECR with git SHA tag                                 │
│  - Update image tag in gitops/environments/dev/                 │
└──────────────────────────────┬──────────────────────────────────┘
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│  ArgoCD detects git change                                      │
│  - Syncs new image to cluster                                   │
│  - Performs health checks                                       │
│  - Rolls back if health check fails                             │
└─────────────────────────────────────────────────────────────────┘
```

---

## Deployment Strategies

### Blue-Green Deployment

Zero-downtime deployment with instant rollback capability.

```yaml
# helm/fit-api/templates/blue-green.yaml

{{- if .Values.blueGreen.enabled }}
apiVersion: argoproj.io/v1alpha1
kind: Rollout
metadata:
  name: {{ include "fit-api.fullname" . }}
spec:
  replicas: {{ .Values.replicaCount }}
  selector:
    matchLabels:
      {{- include "fit-api.selectorLabels" . | nindent 6 }}
  template:
    metadata:
      labels:
        {{- include "fit-api.selectorLabels" . | nindent 8 }}
    spec:
      containers:
        - name: {{ .Chart.Name }}
          image: "{{ .Values.image.repository }}:{{ .Values.image.tag }}"
          ports:
            - containerPort: 8080
  strategy:
    blueGreen:
      activeService: {{ include "fit-api.fullname" . }}-active
      previewService: {{ include "fit-api.fullname" . }}-preview
      autoPromotionEnabled: false  # Manual promotion
      prePromotionAnalysis:
        templates:
          - templateName: success-rate
        args:
          - name: service-name
            value: {{ include "fit-api.fullname" . }}-preview
      postPromotionAnalysis:
        templates:
          - templateName: success-rate
{{- end }}
```

### Canary Deployment

Gradual rollout with traffic shifting.

```yaml
# helm/fit-api/templates/canary.yaml

{{- if .Values.canary.enabled }}
apiVersion: argoproj.io/v1alpha1
kind: Rollout
metadata:
  name: {{ include "fit-api.fullname" . }}
spec:
  replicas: {{ .Values.replicaCount }}
  selector:
    matchLabels:
      {{- include "fit-api.selectorLabels" . | nindent 6 }}
  template:
    metadata:
      labels:
        {{- include "fit-api.selectorLabels" . | nindent 8 }}
    spec:
      containers:
        - name: {{ .Chart.Name }}
          image: "{{ .Values.image.repository }}:{{ .Values.image.tag }}"
  strategy:
    canary:
      steps:
        - setWeight: 10
        - pause: { duration: 5m }
        - analysis:
            templates:
              - templateName: success-rate
              - templateName: latency
        - setWeight: 30
        - pause: { duration: 5m }
        - analysis:
            templates:
              - templateName: success-rate
        - setWeight: 50
        - pause: { duration: 5m }
        - setWeight: 100
      analysis:
        templates:
          - templateName: success-rate
        startingStep: 2
        args:
          - name: service-name
            value: {{ include "fit-api.fullname" . }}-canary
{{- end }}
```

### Analysis Templates (Automated Rollback)

```yaml
# helm/fit-api/templates/analysis-templates.yaml

apiVersion: argoproj.io/v1alpha1
kind: AnalysisTemplate
metadata:
  name: success-rate
spec:
  args:
    - name: service-name
  metrics:
    - name: success-rate
      interval: 1m
      count: 5
      successCondition: result[0] >= 0.95
      failureLimit: 3
      provider:
        prometheus:
          address: http://prometheus-server.monitoring:80
          query: |
            sum(rate(http_requests_total{service="{{args.service-name}}",status=~"2.."}[5m])) /
            sum(rate(http_requests_total{service="{{args.service-name}}"}[5m]))

---
apiVersion: argoproj.io/v1alpha1
kind: AnalysisTemplate
metadata:
  name: latency
spec:
  args:
    - name: service-name
  metrics:
    - name: latency-p95
      interval: 1m
      count: 5
      successCondition: result[0] <= 500
      failureLimit: 3
      provider:
        prometheus:
          address: http://prometheus-server.monitoring:80
          query: |
            histogram_quantile(0.95, 
              sum(rate(http_request_duration_seconds_bucket{service="{{args.service-name}}"}[5m])) by (le)
            ) * 1000
```

### Feature Flags (Gradual Rollout)

```go
// backend/internal/middleware/feature_flags.go

package middleware

import (
    "github.com/gin-gonic/gin"
    "hash/fnv"
)

type FeatureFlags struct {
    flags map[string]int // feature name -> rollout percentage
}

func NewFeatureFlags() *FeatureFlags {
    return &FeatureFlags{
        flags: map[string]int{
            "new_diet_algorithm": 10,  // 10% of users
            "workout_v2":         25,  // 25% of users
        },
    }
}

func (ff *FeatureFlags) IsEnabled(feature string, userID string) bool {
    percentage, exists := ff.flags[feature]
    if !exists {
        return false
    }
    
    // Consistent hashing - same user always gets same result
    h := fnv.New32a()
    h.Write([]byte(userID + feature))
    hash := h.Sum32()
    
    return (hash % 100) < uint32(percentage)
}

func FeatureFlagMiddleware(ff *FeatureFlags) gin.HandlerFunc {
    return func(c *gin.Context) {
        userID := c.GetString("userID")
        
        c.Set("features", map[string]bool{
            "new_diet_algorithm": ff.IsEnabled("new_diet_algorithm", userID),
            "workout_v2":         ff.IsEnabled("workout_v2", userID),
        })
        
        c.Next()
    }
}
```

---

## Authentication (Better Auth)

### Better Auth Server Configuration

```typescript
// auth/src/auth.ts

import { betterAuth } from 'better-auth';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const auth = betterAuth({
  database: pool,
  
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },
  
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
    apple: {
      clientId: process.env.APPLE_CLIENT_ID!,
      clientSecret: process.env.APPLE_CLIENT_SECRET!,
    },
  },
  
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24,     // 1 day
  },
  
  rateLimit: {
    enabled: true,
    window: 60,
    max: 100,
  },
  
  advanced: {
    generateId: () => crypto.randomUUID(),
  },
});
```

```typescript
// auth/src/index.ts

import express from 'express';
import { toNodeHandler } from 'better-auth/node';
import { auth } from './auth';

const app = express();
const PORT = process.env.PORT || 3000;

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Better Auth handles all /api/auth/* routes
app.all('/api/auth/*', toNodeHandler(auth));

app.listen(PORT, () => {
  console.log(`Auth server running on port ${PORT}`);
});
```

### Go JWT Middleware

```go
// backend/internal/middleware/auth.go

package middleware

import (
    "errors"
    "net/http"
    "strings"

    "github.com/gin-gonic/gin"
    "github.com/golang-jwt/jwt/v5"
)

type Claims struct {
    UserID string `json:"sub"`
    Email  string `json:"email"`
    jwt.RegisteredClaims
}

func AuthMiddleware(jwtSecret string) gin.HandlerFunc {
    return func(c *gin.Context) {
        authHeader := c.GetHeader("Authorization")
        if authHeader == "" {
            c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
                "error": "missing authorization header",
            })
            return
        }

        tokenString := strings.TrimPrefix(authHeader, "Bearer ")
        if tokenString == authHeader {
            c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
                "error": "invalid authorization format",
            })
            return
        }

        token, err := jwt.ParseWithClaims(tokenString, &Claims{}, func(token *jwt.Token) (interface{}, error) {
            if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
                return nil, errors.New("unexpected signing method")
            }
            return []byte(jwtSecret), nil
        })

        if err != nil || !token.Valid {
            c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
                "error": "invalid token",
            })
            return
        }

        claims, ok := token.Claims.(*Claims)
        if !ok {
            c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
                "error": "invalid claims",
            })
            return
        }

        // Set user info in context
        c.Set("userID", claims.UserID)
        c.Set("email", claims.Email)
        c.Next()
    }
}
```

---

## Backend API (Python FastAPI)

### Main Entry Point

```python
# backend/app/main.py

from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

from app.config import settings
from app.db.session import engine
from app.models import Base
from app.routers import health, users, nutrition, workout


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    # Shutdown
    await engine.dispose()


app = FastAPI(
    title="FitApp API",
    description="AI-powered nutrition and workout planning",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(health.router, tags=["Health"])
app.include_router(users.router, prefix="/api/v1", tags=["Users"])
app.include_router(nutrition.router, prefix="/api/v1", tags=["Nutrition"])
app.include_router(workout.router, prefix="/api/v1", tags=["Workout"])


if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8080, reload=True)
```

### Configuration

```python
# backend/app/config.py

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: str
    jwt_secret: str
    openai_api_key: str
    cors_origins: list[str] = ["*"]
    environment: str = "development"

    class Config:
        env_file = ".env"


settings = Settings()
```

### Calculator Service (BMR/TDEE)

```python
# backend/app/services/calculator.py

from enum import Enum
from pydantic import BaseModel, Field


class Gender(str, Enum):
    MALE = "male"
    FEMALE = "female"


class ActivityLevel(str, Enum):
    SEDENTARY = "sedentary"    # 1.2
    LIGHT = "light"            # 1.375
    MODERATE = "moderate"      # 1.55
    HIGH = "high"              # 1.725


class Goal(str, Enum):
    MAINTAIN = "maintain"
    LOSE_FAT = "lose_fat"
    GAIN_MASS = "gain_mass"


class CalculatorInput(BaseModel):
    age: int = Field(..., ge=13, le=100)
    gender: Gender
    height_cm: float = Field(..., ge=100, le=250)
    weight_kg: float = Field(..., ge=30, le=300)
    activity_level: ActivityLevel
    goal: Goal


class CalculatorResult(BaseModel):
    bmr: int
    tdee: int
    target_calories: int
    protein_grams: int
    carbs_grams: int
    fat_grams: int
    calorie_adjustment: int
    adjustment_percent: float


ACTIVITY_MULTIPLIERS = {
    ActivityLevel.SEDENTARY: 1.2,
    ActivityLevel.LIGHT: 1.375,
    ActivityLevel.MODERATE: 1.55,
    ActivityLevel.HIGH: 1.725,
}


def calculate_nutrition(input: CalculatorInput) -> CalculatorResult:
    """Calculate BMR, TDEE, and macros using Mifflin-St Jeor formula."""
    
    # BMR calculation
    if input.gender == Gender.MALE:
        bmr = (10 * input.weight_kg) + (6.25 * input.height_cm) - (5 * input.age) + 5
    else:
        bmr = (10 * input.weight_kg) + (6.25 * input.height_cm) - (5 * input.age) - 161

    # TDEE
    tdee = bmr * ACTIVITY_MULTIPLIERS[input.activity_level]

    # Goal adjustment
    adjustment_percent = {
        Goal.MAINTAIN: 0,
        Goal.LOSE_FAT: -0.20,
        Goal.GAIN_MASS: 0.15,
    }[input.goal]
    
    target_calories = max(1200, int(tdee * (1 + adjustment_percent)))

    # Macros
    protein_per_kg = {Goal.LOSE_FAT: 2.2, Goal.GAIN_MASS: 2.0, Goal.MAINTAIN: 1.8}[input.goal]
    protein = int(input.weight_kg * protein_per_kg)
    fat = int((target_calories * 0.27) / 9)
    carbs = int((target_calories - (protein * 4) - (fat * 9)) / 4)

    return CalculatorResult(
        bmr=int(bmr),
        tdee=int(tdee),
        target_calories=target_calories,
        protein_grams=protein,
        carbs_grams=carbs,
        fat_grams=fat,
        calorie_adjustment=target_calories - int(tdee),
        adjustment_percent=adjustment_percent * 100,
    )
```

### AI-Powered Diet Generation

```python
# backend/app/services/diet_ai.py

from openai import AsyncOpenAI
from pydantic import BaseModel

from app.config import settings
from app.services.calculator import CalculatorResult


client = AsyncOpenAI(api_key=settings.openai_api_key)


class Meal(BaseModel):
    name: str
    foods: list[str]
    calories: int
    protein: int
    carbs: int
    fat: int


class DietPlan(BaseModel):
    breakfast: Meal
    lunch: Meal
    dinner: Meal
    snacks: list[Meal]
    total_calories: int
    notes: str


async def generate_diet_plan(
    nutrition: CalculatorResult,
    preferences: str = "omnivore",
    restrictions: list[str] | None = None,
) -> DietPlan:
    """Generate a personalized diet plan using AI."""
    
    restrictions_text = ", ".join(restrictions) if restrictions else "none"
    
    prompt = f"""Generate a daily meal plan with these requirements:
- Target calories: {nutrition.target_calories}
- Protein: {nutrition.protein_grams}g
- Carbs: {nutrition.carbs_grams}g
- Fat: {nutrition.fat_grams}g
- Diet preference: {preferences}
- Restrictions: {restrictions_text}

Return a JSON object with breakfast, lunch, dinner, and 1-2 snacks.
Each meal should have: name, foods (list), calories, protein, carbs, fat.
Include a 'notes' field with tips.
Use common, accessible foods with approximate portions."""

    response = await client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "You are a nutrition expert. Return only valid JSON."},
            {"role": "user", "content": prompt},
        ],
        response_format={"type": "json_object"},
        temperature=0.7,
    )

    import json
    data = json.loads(response.choices[0].message.content)
    
    return DietPlan(**data)
```

### AI-Powered Workout Generation

```python
# backend/app/services/workout_ai.py

from openai import AsyncOpenAI
from pydantic import BaseModel

from app.config import settings


client = AsyncOpenAI(api_key=settings.openai_api_key)


class Exercise(BaseModel):
    name: str
    sets: int
    reps: str  # e.g., "8-12" or "30 seconds"
    rest_seconds: int
    notes: str | None = None


class WorkoutDay(BaseModel):
    day: str
    focus: str  # e.g., "Upper Body", "Cardio"
    exercises: list[Exercise]
    duration_minutes: int


class WorkoutPlan(BaseModel):
    days: list[WorkoutDay]
    weekly_notes: str


async def generate_workout_plan(
    goal: str,
    days_per_week: int,
    experience_level: str = "beginner",
    limitations: list[str] | None = None,
) -> WorkoutPlan:
    """Generate a personalized workout plan using AI."""
    
    limitations_text = ", ".join(limitations) if limitations else "none"
    
    prompt = f"""Create a {days_per_week}-day weekly workout plan:
- Goal: {goal}
- Experience: {experience_level}
- Physical limitations: {limitations_text}

Return JSON with 'days' array and 'weekly_notes'.
Each day: day name, focus area, exercises list, duration_minutes.
Each exercise: name, sets, reps (string like "8-12"), rest_seconds, optional notes.
Include warm-up and cool-down recommendations in notes.
Keep exercises safe and appropriate for {experience_level} level."""

    response = await client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "You are a certified personal trainer. Return only valid JSON."},
            {"role": "user", "content": prompt},
        ],
        response_format={"type": "json_object"},
        temperature=0.7,
    )

    import json
    data = json.loads(response.choices[0].message.content)
    
    return WorkoutPlan(**data)
```

### Nutrition Router

```python
# backend/app/routers/nutrition.py

from fastapi import APIRouter, Depends

from app.middleware.auth import get_current_user
from app.services.calculator import CalculatorInput, CalculatorResult, calculate_nutrition
from app.services.diet_ai import DietPlan, generate_diet_plan


router = APIRouter(prefix="/nutrition")


@router.post("/calculate", response_model=CalculatorResult)
async def calculate_tdee(
    input: CalculatorInput,
    user_id: str = Depends(get_current_user),
):
    """Calculate BMR, TDEE, and recommended macros."""
    return calculate_nutrition(input)


@router.post("/diet", response_model=DietPlan)
async def create_diet_plan(
    input: CalculatorInput,
    preferences: str = "omnivore",
    restrictions: list[str] | None = None,
    user_id: str = Depends(get_current_user),
):
    """Generate an AI-powered personalized diet plan."""
    nutrition = calculate_nutrition(input)
    return await generate_diet_plan(nutrition, preferences, restrictions)
```

### JWT Middleware

```python
# backend/app/middleware/auth.py

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import jwt

from app.config import settings


security = HTTPBearer()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
) -> str:
    """Validate JWT and return user ID."""
    try:
        payload = jwt.decode(
            credentials.credentials,
            settings.jwt_secret,
            algorithms=["HS256"],
        )
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token payload",
            )
        return user_id
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token expired",
        )
    except jwt.InvalidTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
        )
```

### Dockerfile

```dockerfile
# backend/Dockerfile

FROM python:3.12-slim AS builder

WORKDIR /app

# Install build dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Runtime stage
FROM python:3.12-slim

WORKDIR /app

# Copy installed packages
COPY --from=builder /usr/local/lib/python3.12/site-packages /usr/local/lib/python3.12/site-packages
COPY --from=builder /usr/local/bin /usr/local/bin

# Copy application
COPY . .

# Non-root user
RUN useradd -m appuser
USER appuser

EXPOSE 8080

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8080"]
```

### Dependencies

```txt
# backend/requirements.txt

fastapi==0.109.0
uvicorn[standard]==0.27.0
pydantic==2.5.3
pydantic-settings==2.1.0
sqlalchemy[asyncio]==2.0.25
asyncpg==0.29.0
alembic==1.13.1
openai==1.10.0
PyJWT==2.8.0
httpx==0.26.0
pytest==7.4.4
pytest-asyncio==0.23.3
```

---

## Web Frontend (Next.js)

### API Client

```typescript
// web/lib/api.ts

import { useAuthStore } from '@/store/auth';

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

class ApiClient {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = useAuthStore.getState().token;
    
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return response.json();
  }

  // User
  getProfile = () => this.request<User>('/api/v1/user/profile');
  updateProfile = (data: UpdateProfileInput) =>
    this.request<User>('/api/v1/user/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });

  // Nutrition
  calculateTDEE = (data: CalculatorInput) =>
    this.request<CalculatorResult>('/api/v1/nutrition/calculate', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  
  generateDiet = (data: DietInput) =>
    this.request<Diet>('/api/v1/nutrition/diet', {
      method: 'POST',
      body: JSON.stringify(data),
    });

  // Workout
  generateWorkout = (data: WorkoutInput) =>
    this.request<Workout>('/api/v1/workout/generate', {
      method: 'POST',
      body: JSON.stringify(data),
    });

  // Progress
  recordProgress = (data: ProgressInput) =>
    this.request<Progress>('/api/v1/user/progress', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  
  getProgressHistory = () =>
    this.request<Progress[]>('/api/v1/user/progress');
}

export const api = new ApiClient();
```

### Auth Store

```typescript
// web/store/auth.ts

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  setAuth: (token: string, user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      setAuth: (token, user) =>
        set({ token, user, isAuthenticated: true }),
      logout: () =>
        set({ token: null, user: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
```

### Dockerfile

```dockerfile
# web/Dockerfile

FROM node:20-alpine AS base
RUN corepack enable && corepack prepare pnpm@latest --activate

FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3001
ENV PORT=3001
CMD ["node", "server.js"]
```

---

## Observability

### Prometheus + Grafana Setup

```yaml
# helm/monitoring/values.yaml

prometheus:
  enabled: true
  alertmanager:
    enabled: true
  server:
    persistentVolume:
      size: 10Gi
    retention: 15d
  
  serverFiles:
    prometheus.yml:
      scrape_configs:
        - job_name: 'fit-api'
          kubernetes_sd_configs:
            - role: pod
          relabel_configs:
            - source_labels: [__meta_kubernetes_pod_label_app]
              action: keep
              regex: fit-api
            - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_scrape]
              action: keep
              regex: true
            - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_path]
              action: replace
              target_label: __metrics_path__
              regex: (.+)

grafana:
  enabled: true
  adminPassword: "${GRAFANA_ADMIN_PASSWORD}"
  
  datasources:
    datasources.yaml:
      apiVersion: 1
      datasources:
        - name: Prometheus
          type: prometheus
          url: http://prometheus-server
          isDefault: true
  
  dashboardProviders:
    dashboardproviders.yaml:
      apiVersion: 1
      providers:
        - name: 'default'
          folder: ''
          type: file
          options:
            path: /var/lib/grafana/dashboards/default

  dashboards:
    default:
      fit-api:
        json: |
          {
            "title": "Fit API Dashboard",
            "panels": [
              {
                "title": "Request Rate",
                "type": "graph",
                "targets": [
                  {
                    "expr": "rate(http_requests_total{app=\"fit-api\"}[5m])"
                  }
                ]
              },
              {
                "title": "Request Duration",
                "type": "graph",
                "targets": [
                  {
                    "expr": "histogram_quantile(0.95, rate(http_request_duration_seconds_bucket{app=\"fit-api\"}[5m]))"
                  }
                ]
              }
            ]
          }
```

---

## Disaster Recovery

### Backup Strategy

#### Database Backups (RDS)

```hcl
# infra/terraform/modules/rds/backup.tf

resource "aws_db_instance" "main" {
  # ... existing config ...
  
  # Automated backups
  backup_retention_period = var.environment == "prod" ? 30 : 7
  backup_window           = "03:00-04:00"  # UTC, low-traffic period
  
  # Enable deletion protection in prod
  deletion_protection = var.environment == "prod"
  
  # Enable Performance Insights
  performance_insights_enabled = true
  performance_insights_retention_period = 7
}

# Manual snapshot before major changes
resource "aws_db_snapshot" "pre_migration" {
  count                  = var.create_snapshot ? 1 : 0
  db_instance_identifier = aws_db_instance.main.id
  db_snapshot_identifier = "${var.project_name}-pre-migration-${formatdate("YYYY-MM-DD", timestamp())}"
}
```

#### S3 Cross-Region Replication

```hcl
# infra/terraform/modules/s3/disaster_recovery.tf

resource "aws_s3_bucket" "primary" {
  bucket = "${var.project_name}-assets-${var.environment}"
}

resource "aws_s3_bucket" "replica" {
  provider = aws.dr_region  # us-west-2
  bucket   = "${var.project_name}-assets-${var.environment}-replica"
}

resource "aws_s3_bucket_replication_configuration" "replication" {
  bucket = aws_s3_bucket.primary.id
  role   = aws_iam_role.replication.arn

  rule {
    id     = "replicate-all"
    status = "Enabled"

    destination {
      bucket        = aws_s3_bucket.replica.arn
      storage_class = "STANDARD_IA"
    }
  }
}
```

#### EKS/K8s State Backup (Velero)

```yaml
# k8s/velero/schedule.yaml

apiVersion: velero.io/v1
kind: Schedule
metadata:
  name: daily-backup
  namespace: velero
spec:
  schedule: "0 2 * * *"  # Daily at 2 AM
  template:
    includedNamespaces:
      - fitapp
      - argocd
    excludedResources:
      - events
      - pods
    storageLocation: default
    ttl: 720h  # 30 days retention
    
---
apiVersion: velero.io/v1
kind: BackupStorageLocation
metadata:
  name: default
  namespace: velero
spec:
  provider: aws
  objectStorage:
    bucket: fitapp-velero-backups
    prefix: eks
  config:
    region: us-east-1
```

### Recovery Procedures

#### RTO/RPO Targets

| Component | RPO (Data Loss) | RTO (Downtime) |
|-----------|-----------------|----------------|
| Database (RDS) | 5 minutes | 30 minutes |
| Object Storage (S3) | 0 (real-time replication) | 5 minutes |
| K8s Workloads | 24 hours | 15 minutes |
| Configuration | 0 (GitOps) | 10 minutes |

#### Database Recovery Runbook

```bash
#!/bin/bash
# scripts/dr/restore-database.sh

set -euo pipefail

SNAPSHOT_ID=$1
NEW_INSTANCE_ID="${PROJECT_NAME}-restored-$(date +%Y%m%d%H%M)"

echo "=== Database Disaster Recovery ==="
echo "Restoring from snapshot: $SNAPSHOT_ID"

# 1. Restore from snapshot
aws rds restore-db-instance-from-db-snapshot \
    --db-instance-identifier "$NEW_INSTANCE_ID" \
    --db-snapshot-identifier "$SNAPSHOT_ID" \
    --db-instance-class db.t3.medium \
    --vpc-security-group-ids "$SECURITY_GROUP_ID" \
    --db-subnet-group-name "$SUBNET_GROUP"

# 2. Wait for instance to be available
echo "Waiting for instance to be available..."
aws rds wait db-instance-available \
    --db-instance-identifier "$NEW_INSTANCE_ID"

# 3. Get new endpoint
NEW_ENDPOINT=$(aws rds describe-db-instances \
    --db-instance-identifier "$NEW_INSTANCE_ID" \
    --query 'DBInstances[0].Endpoint.Address' \
    --output text)

echo "New database endpoint: $NEW_ENDPOINT"

# 4. Update secret in AWS Secrets Manager
aws secretsmanager update-secret \
    --secret-id "fitapp/${ENVIRONMENT}/database" \
    --secret-string "{\"host\":\"$NEW_ENDPOINT\",\"port\":5432,\"database\":\"fitapp\"}"

# 5. Trigger External Secrets sync
kubectl annotate externalsecret fit-api-secrets \
    force-sync=$(date +%s) \
    -n fitapp --overwrite

# 6. Restart pods to pick up new connection
kubectl rollout restart deployment/fit-api -n fitapp

echo "=== Recovery Complete ==="
```

#### Full Cluster Recovery

```bash
#!/bin/bash
# scripts/dr/full-cluster-recovery.sh

set -euo pipefail

echo "=== Full Cluster Disaster Recovery ==="

# 1. Provision new EKS cluster
cd infra/terraform/environments/prod
terraform apply -target=module.eks -auto-approve

# 2. Install Velero in new cluster
helm install velero vmware-tanzu/velero \
    --namespace velero \
    --create-namespace \
    --set configuration.provider=aws \
    --set configuration.backupStorageLocation.bucket=fitapp-velero-backups

# 3. Restore from latest backup
LATEST_BACKUP=$(velero backup get -o json | jq -r '.items | sort_by(.status.startTimestamp) | last | .metadata.name')
echo "Restoring from backup: $LATEST_BACKUP"

velero restore create --from-backup "$LATEST_BACKUP" --wait

# 4. Restore ArgoCD and let it sync everything
kubectl apply -f gitops/app-of-apps/prod.yaml

# 5. Update DNS to point to new cluster
# (This would be automated with Route53 health checks in prod)

echo "=== Cluster Recovery Complete ==="
```

---

## Incident Response

### Severity Levels

| Level | Description | Response Time | Example |
|-------|-------------|---------------|---------|
| **SEV1** | Complete outage, all users affected | 15 min | API down, DB unreachable |
| **SEV2** | Major feature broken, many users affected | 30 min | Auth failing, slow responses |
| **SEV3** | Minor feature broken, some users affected | 4 hours | Single endpoint errors |
| **SEV4** | Cosmetic/minor issue | 24 hours | UI glitch, log noise |

### On-Call Rotation

```yaml
# pagerduty/schedules.yaml (or OpsGenie equivalent)

schedules:
  - name: primary-oncall
    type: weekly
    rotation:
      - week 1: engineer-a
      - week 2: engineer-b
      - week 3: engineer-c
    
  - name: secondary-oncall
    type: weekly
    rotation:
      # Previous week's primary becomes secondary
      
escalation_policy:
  - level: 1
    timeout: 5m
    targets: [primary-oncall]
  - level: 2
    timeout: 10m
    targets: [secondary-oncall]
  - level: 3
    timeout: 15m
    targets: [engineering-manager]
```

### Alerting Rules

```yaml
# helm/monitoring/alerting-rules.yaml

groups:
  - name: fit-api-critical
    rules:
      - alert: APIHighErrorRate
        expr: |
          sum(rate(http_requests_total{app="fit-api",status=~"5.."}[5m])) /
          sum(rate(http_requests_total{app="fit-api"}[5m])) > 0.05
        for: 2m
        labels:
          severity: critical
          team: backend
        annotations:
          summary: "High error rate on fit-api"
          description: "Error rate is {{ $value | humanizePercentage }} (threshold: 5%)"
          runbook_url: "https://wiki.company.com/runbooks/high-error-rate"

      - alert: APIHighLatency
        expr: |
          histogram_quantile(0.95, 
            sum(rate(http_request_duration_seconds_bucket{app="fit-api"}[5m])) by (le)
          ) > 1
        for: 5m
        labels:
          severity: warning
          team: backend
        annotations:
          summary: "High latency on fit-api"
          description: "P95 latency is {{ $value | humanizeDuration }}"

      - alert: PodCrashLooping
        expr: |
          rate(kube_pod_container_status_restarts_total{namespace="fitapp"}[15m]) > 0
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "Pod {{ $labels.pod }} is crash looping"
          
      - alert: DatabaseConnectionsHigh
        expr: |
          pg_stat_activity_count{datname="fitapp"} > 80
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "Database connections near limit"
          description: "{{ $value }} connections (max: 100)"
```

### Incident Runbooks

#### Runbook: High Error Rate

```markdown
# Runbook: High Error Rate (>5%)

## Symptoms
- AlertManager firing `APIHighErrorRate`
- Users reporting errors
- Grafana showing spike in 5xx responses

## Quick Diagnosis

1. **Check recent deployments:**
   ```bash
   kubectl rollout history deployment/fit-api -n fitapp
   argocd app history fit-api
   ```

2. **Check pod health:**
   ```bash
   kubectl get pods -n fitapp
   kubectl describe pod <pod-name> -n fitapp
   kubectl logs <pod-name> -n fitapp --tail=100
   ```

3. **Check database:**
   ```bash
   kubectl exec -it <pod-name> -n fitapp -- nc -zv $DB_HOST 5432
   ```

4. **Check external dependencies:**
   - Better Auth service health
   - AWS service health dashboard

## Mitigation

### If recent deployment caused it:
```bash
# Rollback with ArgoCD
argocd app rollback fit-api

# Or with kubectl
kubectl rollout undo deployment/fit-api -n fitapp
```

### If database issue:
```bash
# Check RDS metrics in AWS Console
# Consider failing over to read replica
aws rds failover-db-cluster --db-cluster-identifier fitapp-prod
```

### If capacity issue:
```bash
# Scale up immediately
kubectl scale deployment/fit-api --replicas=10 -n fitapp
```

## Post-Incident
1. Create incident ticket
2. Schedule post-mortem within 48 hours
3. Update this runbook if needed
```

#### Runbook: Database Connection Exhaustion

```markdown
# Runbook: Database Connection Exhaustion

## Symptoms
- `DatabaseConnectionsHigh` alert
- API returning 500 errors
- Logs showing "too many connections"

## Quick Diagnosis

1. **Check current connections:**
   ```sql
   SELECT count(*), state, application_name
   FROM pg_stat_activity
   WHERE datname = 'fitapp'
   GROUP BY state, application_name;
   ```

2. **Find long-running queries:**
   ```sql
   SELECT pid, now() - pg_stat_activity.query_start AS duration, query
   FROM pg_stat_activity
   WHERE state != 'idle'
   AND query_start < now() - interval '5 minutes';
   ```

## Mitigation

1. **Kill idle connections:**
   ```sql
   SELECT pg_terminate_backend(pid)
   FROM pg_stat_activity
   WHERE datname = 'fitapp'
   AND state = 'idle'
   AND query_start < now() - interval '10 minutes';
   ```

2. **Restart pods to reset connection pools:**
   ```bash
   kubectl rollout restart deployment/fit-api -n fitapp
   ```

3. **If persistent, reduce pool size temporarily:**
   ```bash
   # Update config and redeploy
   # In helm values: database.maxConnections: 10
   ```

## Root Cause Investigation
- Check for connection leaks in code
- Review connection pool settings
- Consider PgBouncer for connection pooling
```

### Post-Mortem Template

```markdown
# Incident Post-Mortem: [TITLE]

**Date:** YYYY-MM-DD
**Duration:** X hours Y minutes
**Severity:** SEV1/SEV2/SEV3
**Author:** [Name]

## Summary
Brief 2-3 sentence summary of what happened.

## Impact
- X users affected
- Y% error rate during incident
- $Z estimated revenue impact (if applicable)

## Timeline (all times UTC)
| Time | Event |
|------|-------|
| 14:00 | Deployment triggered |
| 14:05 | Error rate increased |
| 14:07 | Alert fired |
| 14:10 | On-call acknowledged |
| 14:25 | Root cause identified |
| 14:30 | Rollback initiated |
| 14:35 | Service restored |

## Root Cause
Technical explanation of what caused the incident.

## What Went Well
- Alert fired quickly
- Rollback was smooth
- Team communication was clear

## What Went Wrong
- Deployment wasn't tested in staging first
- Runbook was outdated
- Took too long to identify root cause

## Action Items
| Action | Owner | Due Date | Status |
|--------|-------|----------|--------|
| Add integration test for X | @engineer | 2024-02-01 | TODO |
| Update runbook | @sre | 2024-01-28 | TODO |
| Add canary deployment | @devops | 2024-02-15 | TODO |

## Lessons Learned
What did we learn that can prevent similar incidents?
```

---

## Security

### Network Policies

```yaml
# k8s/base/network-policies.yaml

apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: fit-api-network-policy
  namespace: fitapp
spec:
  podSelector:
    matchLabels:
      app: fit-api
  policyTypes:
    - Ingress
    - Egress
  ingress:
    - from:
        - namespaceSelector:
            matchLabels:
              name: ingress-nginx
        - podSelector:
            matchLabels:
              app: better-auth
      ports:
        - protocol: TCP
          port: 8080
  egress:
    - to:
        - namespaceSelector:
            matchLabels:
              name: fitapp
        - ipBlock:
            cidr: 10.0.0.0/16  # VPC CIDR for RDS
      ports:
        - protocol: TCP
          port: 5432
    - to:
        - namespaceSelector: {}
      ports:
        - protocol: UDP
          port: 53  # DNS
```

### Pod Security Standards

```yaml
# k8s/base/pod-security.yaml

apiVersion: v1
kind: Namespace
metadata:
  name: fitapp
  labels:
    pod-security.kubernetes.io/enforce: restricted
    pod-security.kubernetes.io/audit: restricted
    pod-security.kubernetes.io/warn: restricted
```

### Container Security Scanning

```yaml
# .github/workflows/security-scan.yaml

name: Security Scan

on:
  push:
    branches: [main]
  schedule:
    - cron: '0 6 * * *'  # Daily at 6 AM

jobs:
  trivy-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Build image
        run: docker build -t fit-api:scan ./backend
      
      - name: Run Trivy vulnerability scanner
        uses: aquasecurity/trivy-action@master
        with:
          image-ref: 'fit-api:scan'
          format: 'sarif'
          output: 'trivy-results.sarif'
          severity: 'CRITICAL,HIGH'
          
      - name: Upload Trivy scan results
        uses: github/codeql-action/upload-sarif@v2
        with:
          sarif_file: 'trivy-results.sarif'
          
      - name: Fail on critical vulnerabilities
        uses: aquasecurity/trivy-action@master
        with:
          image-ref: 'fit-api:scan'
          exit-code: '1'
          severity: 'CRITICAL'

  dependency-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Go dependency scan
        uses: golang/govulncheck-action@v1
        with:
          work-dir: backend
```

### RBAC Configuration

```yaml
# k8s/base/rbac.yaml

apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: fitapp-deployer
  namespace: fitapp
rules:
  - apiGroups: ["apps"]
    resources: ["deployments"]
    verbs: ["get", "list", "watch", "update", "patch"]
  - apiGroups: [""]
    resources: ["pods", "pods/log"]
    verbs: ["get", "list", "watch"]
  - apiGroups: [""]
    resources: ["configmaps", "secrets"]
    verbs: ["get", "list"]

---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: github-actions-deployer
  namespace: fitapp
subjects:
  - kind: ServiceAccount
    name: github-actions
    namespace: fitapp
roleRef:
  kind: Role
  name: fitapp-deployer
  apiGroup: rbac.authorization.k8s.io
```

---

## Local Development

### Docker Compose

```yaml
# docker-compose.yaml

version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: fitapp
      POSTGRES_PASSWORD: fitapp_dev
      POSTGRES_DB: fitapp
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U fitapp"]
      interval: 10s
      timeout: 5s
      retries: 5

  api:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "8080:8080"
    environment:
      - DATABASE_URL=postgresql+asyncpg://fitapp:fitapp_dev@postgres:5432/fitapp
      - JWT_SECRET=dev-secret-change-in-prod
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - ENVIRONMENT=development
    depends_on:
      postgres:
        condition: service_healthy

  auth:
    build:
      context: ./auth
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgres://fitapp:fitapp_dev@postgres:5432/fitapp?sslmode=disable
      - GOOGLE_CLIENT_ID=${GOOGLE_CLIENT_ID}
      - GOOGLE_CLIENT_SECRET=${GOOGLE_CLIENT_SECRET}
      - PORT=3000
    depends_on:
      postgres:
        condition: service_healthy

volumes:
  postgres_data:
```

### Makefile

```makefile
# Makefile

.PHONY: help dev dev-down test lint build deploy-dev

help:
	@echo "Available commands:"
	@echo "  dev          - Start local development environment"
	@echo "  dev-down     - Stop local development environment"
	@echo "  test         - Run all tests"
	@echo "  lint         - Run linters"
	@echo "  build        - Build Docker images"
	@echo "  kind-create  - Create Kind cluster"
	@echo "  kind-delete  - Delete Kind cluster"
	@echo "  deploy-dev   - Deploy to dev environment"

# Local development
dev:
	docker-compose up -d
	@echo "Services running:"
	@echo "  API: http://localhost:8080"
	@echo "  Auth: http://localhost:3000"
	@echo "  Postgres: localhost:5432"

dev-down:
	docker-compose down

dev-logs:
	docker-compose logs -f

# Testing
test:
	cd backend && pytest -v
	cd auth && pnpm test
	cd web && pnpm test

test-coverage:
	cd backend && pytest --cov=app --cov-report=html

# Linting
lint:
	cd backend && ruff check . && mypy app
	cd auth && pnpm lint
	cd web && pnpm lint

# Building
build:
	docker build -t fit-api:local ./backend
	docker build -t better-auth:local ./auth
	docker build -t admin:local ./apps/admin

# Kind cluster
kind-create:
	kind create cluster --name fitapp --config=scripts/kind-config.yaml
	kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/kind/deploy.yaml

kind-delete:
	kind delete cluster --name fitapp

kind-deploy:
	kubectl apply -f k8s/local/

# Terraform
tf-init:
	cd infra/terraform/environments/dev && terraform init

tf-plan:
	cd infra/terraform/environments/dev && terraform plan

tf-apply:
	cd infra/terraform/environments/dev && terraform apply

tf-destroy:
	cd infra/terraform/environments/dev && terraform destroy

# Database
db-migrate:
	cd backend && go run cmd/migrate/main.go up

db-rollback:
	cd backend && go run cmd/migrate/main.go down

# Mobile
mobile-start:
	cd apps/mobile && npx expo start

mobile-build-ios:
	cd apps/mobile && eas build --platform ios

mobile-build-android:
	cd apps/mobile && eas build --platform android
```

---

## Implementation Phases

### Phase 1: Foundation (Week 1-2)

**Goals:**
- Set up monorepo structure
- Create Terraform modules
- Basic FastAPI API with health endpoint
- Local Kind cluster working

**Tasks:**
- [ ] Initialize git repository
- [ ] Set up pnpm workspaces
- [ ] Create Terraform module: VPC
- [ ] Create Terraform module: EKS
- [ ] Create Terraform module: RDS
- [ ] Create Terraform module: ECR
- [ ] Create basic FastAPI API structure
- [ ] Add health check endpoint
- [ ] Create Dockerfile for API
- [ ] Set up docker-compose for local dev
- [ ] Create Kind cluster config
- [ ] Create basic Helm chart for API
- [ ] Set up GitHub Actions CI workflow

### Phase 2: Authentication (Week 3)

**Goals:**
- Better Auth service running
- Social login working
- JWT validation in FastAPI API

**Tasks:**
- [ ] Set up Better Auth project
- [ ] Configure Google OAuth
- [ ] Configure Apple OAuth
- [ ] Create Dockerfile for auth service
- [ ] Create Helm chart for auth
- [ ] Implement JWT middleware in FastAPI API
- [ ] Set up External Secrets Operator
- [ ] Test auth flow end-to-end

### Phase 3: Core Backend (Week 4-5)

**Goals:**
- All API endpoints working
- Database schema complete
- OpenAPI documentation

**Tasks:**
- [ ] Create PostgreSQL schema
- [ ] Set up golang-migrate
- [ ] Implement user repository (sqlc)
- [ ] Implement calculator service (BMR/TDEE)
- [ ] Implement diet generation service
- [ ] Implement workout generation service
- [ ] Create all HTTP handlers
- [ ] Add request validation
- [ ] Generate OpenAPI/Swagger docs
- [ ] Write unit tests (>80% coverage)
- [ ] Write integration tests

### Phase 4: Mobile App (Week 5-6)

**Goals:**
- Expo app with auth flow
- Core screens implemented
- Connected to backend

**Tasks:**
- [ ] Initialize Expo project
- [ ] Set up navigation (react-navigation)
- [ ] Set up state management (Zustand)
- [ ] Implement auth screens (login, register)
- [ ] Implement social login buttons
- [ ] Implement onboarding flow
- [ ] Implement dashboard screen
- [ ] Implement diet plan screen
- [ ] Implement workout screen
- [ ] Implement progress tracking
- [ ] Create API client service
- [ ] Add form validation (react-hook-form + zod)

### Phase 5: Admin & Monitoring (Week 7-8)

**Goals:**
- Admin dashboard working
- Monitoring stack deployed
- Alerting configured

**Tasks:**
- [ ] Create admin dashboard (React + Vite)
- [ ] User management features
- [ ] Basic analytics display
- [ ] Deploy Prometheus + Grafana
- [ ] Create Grafana dashboards
- [ ] Set up alerting rules (AlertManager)
- [ ] Configure PagerDuty/OpsGenie integration
- [ ] Create SLIs/SLOs

### Phase 6: GitOps & Advanced Deployments (Week 9-10)

**Goals:**
- ArgoCD managing all deployments
- Canary/Blue-Green strategies working
- Automated rollbacks on failure

**Tasks:**
- [ ] Install ArgoCD via Terraform
- [ ] Create Application manifests
- [ ] Set up App of Apps pattern
- [ ] Configure Image Updater
- [ ] Install Argo Rollouts
- [ ] Implement canary deployment for fit-api
- [ ] Create analysis templates (Prometheus)
- [ ] Test automated rollback
- [ ] Document GitOps workflow

### Phase 7: Disaster Recovery & Incident Response (Week 11-12)

**Goals:**
- Backup/recovery procedures documented and tested
- Incident response process established
- Security hardened

**Tasks:**
- [ ] Configure RDS automated backups
- [ ] Set up S3 cross-region replication
- [ ] Install and configure Velero
- [ ] Write DR runbooks
- [ ] Test database recovery procedure
- [ ] Test full cluster recovery
- [ ] Define severity levels
- [ ] Create incident runbooks
- [ ] Set up on-call rotation
- [ ] Create post-mortem template
- [ ] Implement network policies
- [ ] Set up container scanning in CI
- [ ] Configure Pod Security Standards
- [ ] Conduct security review

### Phase 8: Documentation & Portfolio Polish (Week 13)

**Goals:**
- Project fully documented
- Demo-ready for interviews

**Tasks:**
- [ ] Write comprehensive README
- [ ] Create architecture diagrams (draw.io/Mermaid)
- [ ] Record demo video (Loom)
- [ ] Write blog post about the project
- [ ] Prepare interview talking points
- [ ] Clean up code and comments
- [ ] Add badges to README (CI status, coverage)
- [ ] Create GitHub release

---

## Cost Estimation

### Development Environment (Monthly)

| Service | Specification | Cost |
|---------|--------------|------|
| EKS Control Plane | 1 cluster | $73 |
| EC2 (EKS Nodes) | 2x t3.medium | $60 |
| RDS PostgreSQL | db.t3.micro | $15 |
| NAT Gateway | 1 gateway | $32 |
| S3 | <1GB | $1 |
| ECR | <5GB | $1 |
| Secrets Manager | 5 secrets | $2 |
| **Total** | | **~$185/mo** |

### Cost Optimization Tips

1. **Destroy when not in use:** `terraform destroy` saves ~$150/mo
2. **Use spot instances:** 60-70% savings on EC2
3. **Scale down at night:** Reduce nodes to 1
4. **Use RDS free tier:** First 12 months free
5. **Single NAT Gateway:** Only in dev/staging

---

## DevOps Skills Checklist

Use this to track your learning progress:

### Infrastructure as Code
- [ ] Terraform basics (resources, variables, outputs)
- [ ] Terraform modules
- [ ] Terraform state management (S3 backend)
- [ ] Terraform workspaces/environments
- [ ] Terraform import (existing resources)
- [ ] Cost estimation with Infracost

### Kubernetes
- [ ] Core concepts (Pods, Deployments, Services)
- [ ] ConfigMaps and Secrets
- [ ] Ingress controllers
- [ ] Horizontal Pod Autoscaler (HPA)
- [ ] Helm chart creation
- [ ] Helm values per environment
- [ ] Network Policies
- [ ] Pod Security Standards
- [ ] Resource quotas and limits
- [ ] Pod Disruption Budgets

### GitOps
- [ ] ArgoCD installation and configuration
- [ ] Application definitions
- [ ] App of Apps pattern
- [ ] Image Updater automation
- [ ] Sync policies and waves
- [ ] Rollback procedures

### CI/CD
- [ ] GitHub Actions workflows
- [ ] Multi-job pipelines
- [ ] Environment secrets (OIDC)
- [ ] Artifact caching
- [ ] Docker layer caching
- [ ] Matrix builds

### Deployment Strategies
- [ ] Rolling updates
- [ ] Blue-Green deployments
- [ ] Canary deployments (Argo Rollouts)
- [ ] Analysis templates (automated rollback)
- [ ] Feature flags
- [ ] Traffic splitting

### AWS Services
- [ ] EKS cluster management
- [ ] RDS PostgreSQL
- [ ] ECR container registry
- [ ] S3 buckets (+ cross-region replication)
- [ ] Secrets Manager
- [ ] IAM roles and policies (IRSA)
- [ ] VPC networking
- [ ] Route53 (DNS)
- [ ] CloudWatch (logs, metrics)

### Observability
- [ ] Prometheus metrics collection
- [ ] Grafana dashboards
- [ ] Log aggregation (Loki/CloudWatch)
- [ ] Alerting rules (AlertManager)
- [ ] PagerDuty/OpsGenie integration
- [ ] Distributed tracing (optional: Jaeger)
- [ ] SLIs/SLOs definition

### Disaster Recovery
- [ ] RDS automated backups
- [ ] Point-in-time recovery
- [ ] S3 cross-region replication
- [ ] Velero for K8s backup
- [ ] Recovery runbooks
- [ ] RTO/RPO documentation
- [ ] DR drills (chaos engineering)

### Incident Response
- [ ] Severity level definitions
- [ ] On-call rotation setup
- [ ] Runbook creation
- [ ] Post-mortem process
- [ ] Escalation policies
- [ ] Status page (optional: Statuspage.io)

### Security
- [ ] Secrets management (External Secrets Operator)
- [ ] RBAC in Kubernetes
- [ ] Network policies
- [ ] Container security scanning (Trivy)
- [ ] Dependency scanning (Snyk/Dependabot)
- [ ] SAST/DAST basics
- [ ] Pod Security Standards
- [ ] Least privilege principle

---

## Resources

### Documentation
- [Terraform AWS Provider](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)
- [EKS User Guide](https://docs.aws.amazon.com/eks/latest/userguide/)
- [Helm Documentation](https://helm.sh/docs/)
- [Better Auth Docs](https://www.better-auth.com/docs)
- [Gin Web Framework](https://gin-gonic.com/docs/)
- [Expo Documentation](https://docs.expo.dev/)

### Tutorials
- [EKS Workshop](https://www.eksworkshop.com/)
- [Terraform Tutorials](https://developer.hashicorp.com/terraform/tutorials)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)

---

> **Note:** This architecture document is your hands-on practice guide. Work through each phase, commit frequently, and document your learnings. Good luck!

# Architecture & Tech Stack

## Overview

This document summarizes the decided technologies, architectural decisions, and requirements for the void-ec project.

## Tech Stack

### Backend Framework
- **void** (VoidZero's framework) — TypeScript-based full-stack framework built on Hono + Vite
- **Drizzle ORM** — Type-safe SQL ORM with built-in migration support
- **Bun** — Runtime for development and production (Node.js/Bun/Deno targets supported by void)

### Database
- **SQLite** — Used in development via Bun's native SQLite
- **D1 (SQLite)** — Cloudfare managed SQLite for production deployments via void deploy
- **Migration Tool**: Drizzle Kit (`drizzle-kit`)

### Authentication
- **better-auth** — Integrated auth framework with SSO support (Google, GitHub, etc.)
- Note: void-managed auth is Cloudflare-only; for Bun target, use better-auth directly

### Frontend
- **React** — UI library (can be swapped with Vue/Svelte/Solid)
- **Vite** — Build tool (integrated via void)

## Architecture Decisions

### 1. Monorepo Structure
```
void-ec/
├── db/
│   ├── schema.ts      # Drizzle ORM schema definitions
│   └── migrations/    # SQL migration files
├── routes/            # API endpoints (file-based routing)
├── pages/             # Server-rendered pages
├── middleware/        # Request middleware
├── docs/              # Documentation
├── package.json
├── vite.config.ts
└── void.json          # Void configuration
```

### 2. Database Design Principles
- Integer primary keys (auto-increment) for performance
- Foreign key constraints with explicit ON DELETE actions
- Composite indexes for frequently queried columns
- Logical deletion pattern (`deleted_at` column)
- Audit logging for important operations
- Integer representation of cents for monetary values
- Enum-like integer values for status fields

### 3. Deployment Strategy
- **Development**: Bun runtime with local SQLite
- **Production**: Cloudflare Workers + D1 (via `void deploy`)
- **Fallback**: Can deploy to Node.js/Bun/Deno with external database

### 4. Data Model
Key entities:
- Users, Wishlists, Categories, Products, Product Variants
- Cart, Orders, Order Items, Payments, Shipping
- Reviews, Discounts, Addresses, Inventory Logs, Audit Logs

See `docs/erd.mermaid` for the full ER diagram.

## Requirements

### Functional
1. User authentication via SSO (Google)
2. Product catalog with categories and variants
3. Shopping cart functionality
4. Checkout flow with order management
5. Payment processing integration
6. Order history and tracking
7. Product reviews and ratings
8. Wishlist functionality

### Non-Functional
1. Type safety from database to frontend
2. Data integrity through foreign key constraints
3. Audit trail for critical operations
4. Scalable architecture (Cloudflare Workers edge deployment)
5. Backup strategy for production data
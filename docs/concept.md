# Concept

## Project Name
**void-ec** — A type-safe, edge-deployable e-commerce platform built on the void framework.

## Vision
A modern, developer-first e-commerce platform that prioritizes type safety, data integrity, and edge deployment. Built for developers who want a fully customizable store without the bloat of traditional platforms like Shopify.

## Core Principles

1. **Type Safety End-to-End** — From database schema to frontend UI, TypeScript types flow through the entire stack via Drizzle ORM and void's type inference.
2. **Edge-Native** — Designed for Cloudflare Workers deployment via `void deploy`, with local SQLite for development.
3. **Data Integrity First** — Foreign key constraints, audit trails, and logical deletion patterns ensure data correctness.
4. **Minimal Dependencies** — Uses only what's needed: void (Hono + Vite), Drizzle ORM, better-auth, and React.
5. **Extensible Architecture** — Modular design allows swapping UI libraries, auth providers, and payment processors.

## Target Users
- Developers building custom e-commerce stores
- Teams deploying to edge infrastructure
- Projects requiring full control over data and business logic

## Key Features
- Product catalog with categories, variants, and options
- Shopping cart with guest-to-user merge
- Checkout flow with order management
- Payment processing integration
- Wishlist functionality
- Product reviews and ratings
- Discount code system
- Inventory tracking with audit logs
- User address management
- Order status history and tracking

## Tech Stack Summary
| Layer | Technology |
|-------|-----------|
| Framework | void (Hono + Vite) |
| ORM | Drizzle ORM |
| Database | SQLite (dev) / D1 (prod) |
| Auth | better-auth (Google SSO) |
| Frontend | React |
| Runtime | Bun |
| Deployment | Cloudflare Workers (via void deploy) |
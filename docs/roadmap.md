# Roadmap

## PR #1: Project Setup & Configuration

### Description
Initialize the void-ec project with all required configuration files and dependencies.

### Tasks
- [ ] Create `package.json` with void, drizzle-orm, drizzle-kit, better-auth, and React dependencies
- [ ] Create `void.json` configuration file
- [ ] Create `vite.config.ts` with proper SSR and build configuration
- [ ] Set up `drizzle.config.ts` for migration generation
- [ ] Initialize git hooks (lint-staged, husky)
- [ ] Add `.gitignore` for Node, Bun, and IDE files

### Acceptance Criteria
- `bun install` succeeds
- `void dev` starts the dev server
- `drizzle-kit generate` produces initial migration

---

## PR #2: Database Migrations

### Description
Generate and verify the initial database migration from `db/schema.ts`.

### Tasks
- [ ] Run `drizzle-kit generate` to produce migration SQL from schema
- [ ] Verify migration creates all 20 tables with correct columns, indexes, and foreign keys
- [ ] Add migration verification script
- [ ] Test migration against local SQLite database

### Acceptance Criteria
- Migration file exists in `db/migrations/`
- All tables, columns, indexes, and foreign key constraints match the schema
- Migration applies cleanly to a fresh SQLite database

---

## PR #3: Authentication System

### Description
Implement authentication using better-auth with Google SSO.

### Tasks
- [ ] Set up better-auth configuration (`src/lib/auth.ts`)
- [ ] Create auth routes (`routes/api/auth/*`) for sign-in, sign-out, session
- [ ] Create auth middleware for protected routes
- [ ] Add user profile management endpoints
- [ ] Wire up auth with the `users` table in the schema

### Acceptance Criteria
- Google SSO sign-in flow works
- Session management (create, read, destroy) functional
- Protected routes reject unauthenticated requests
- Auth endpoints return proper error responses

---

## PR #4: Product Catalog API

### Description
Implement the full product catalog: categories, products, variants, options, and images.

### Tasks
- [ ] Create category CRUD routes (`routes/api/categories/*`)
- [ ] Create product CRUD routes (`routes/api/products/*`)
- [ ] Create product variant routes (`routes/api/products/:id/variants`)
- [ ] Create product option routes (`routes/api/products/:id/options`)
- [ ] Create product image upload/ordering endpoints
- [ ] Add search and filtering by category, price, and rating
- [ ] Implement product rating aggregation on review events

### Acceptance Criteria
- All CRUD operations for categories and products work
- Variants and options can be managed per product
- Product images can be uploaded and ordered
- Search and filtering return correct results

---

## PR #5: Wishlist Functionality

### Description
Implement wishlist management including items and default wishlist handling.

### Tasks
- [ ] Create wishlist CRUD routes (`routes/api/wishlists/*`)
- [ ] Create wishlist item routes (`routes/api/wishlists/:id/items`)
- [ ] Implement default wishlist auto-creation on user registration
- [ ] Add move-to-cart endpoint from wishlist items
- [ ] Add wishlist item count endpoint

### Acceptance Criteria
- Users can create, list, update, and delete wishlists
- Items can be added/removed from wishlists
- Default wishlist is auto-created for new users
- Move-to-cart transfers items to the cart

---

## PR #6: Shopping Cart API

### Description
Implement shopping cart functionality with cart items and quantity management.

### Tasks
- [ ] Create cart CRUD routes (`routes/api/cart/*`)
- [ ] Create cart item routes (`routes/api/cart/items`)
- [ ] Implement add-to-cart from product/variant
- [ ] Add quantity update and remove endpoints
- [ ] Add cart merge logic for guest-to-logged-in user transition
- [ ] Implement cart total calculation endpoint

### Acceptance Criteria
- Cart is auto-created for authenticated users
- Items can be added, updated, and removed
- Cart totals are calculated correctly (including variant pricing)
- Merge logic handles guest cart → user cart transition

---

## PR #7: Checkout Flow & Order Creation

### Description
Implement the checkout flow: address selection, order creation, and order items.

### Tasks
- [ ] Create user address CRUD routes (`routes/api/addresses/*`)
- [ ] Create checkout endpoint (`routes/api/checkout`)
- [ ] Implement order creation from cart contents
- [ ] Create order items from cart items (snapshot pricing)
- [ ] Add order status initialization (pending)
- [ ] Clear cart after successful order creation
- [ ] Create order history endpoint (`routes/api/orders`)

### Acceptance Criteria
- Users can manage shipping/billing addresses
- Checkout creates an order with correct items, pricing, and status
- Cart is cleared after order creation
- Order history is accessible per user

---

## PR #8: Payment Processing Integration

### Description
Integrate payment processing with provider support (e.g., Stripe).

### Tasks
- [ ] Create payment intent creation endpoint
- [ ] Create payment webhook handler for provider callbacks
- [ ] Implement payment status updates (initiated → succeeded/failed)
- [ ] Update order status on successful payment
- [ ] Handle payment failure scenarios
- [ ] Add payment refund endpoint

### Acceptance Criteria
- Payment intent creation returns provider-compatible response
- Webhook handler updates payment and order status correctly
- Failed payments are handled gracefully
- Refund endpoint works for paid orders

---

## PR #9: Order Management & Tracking

### Description
Implement order status management, shipping info, and status history.

### Tasks
- [ ] Create order status update endpoint (`routes/api/orders/:id/status`)
- [ ] Create shipping info routes (`routes/api/orders/:id/shipping`)
- [ ] Implement order status history tracking
- [ ] Add order cancellation endpoint (with stock restoration)
- [ ] Create order detail endpoint with items, payment, shipping

### Acceptance Criteria
- Order status transitions follow valid state machine (pending → paid → shipped → delivered)
- Shipping info can be added and tracked
- Status history is recorded for every status change
- Order cancellation restores stock and updates status

---

## PR #10: Product Reviews & Ratings

### Description
Implement product reviews with images and rating aggregation.

### Tasks
- [ ] Create product review CRUD routes (`routes/api/products/:id/reviews`)
- [ ] Create review image upload endpoints
- [ ] Implement rating aggregation on review create/update/delete
- [ ] Update product and user aggregate ratings
- [ ] Add review verification (only purchasers can review)
- [ ] Create user review history endpoint

### Acceptance Criteria
- Users can write reviews with optional images
- Product and user aggregate ratings update on review changes
- Only purchasers of the product can review
- Review history is accessible per user

---

## PR #11: Discount System

### Description
Implement discount codes with percentage and fixed amount types.

### Tasks
- [ ] Create discount CRUD routes (`routes/api/discounts/*`)
- [ ] Implement discount validation (expiry, usage limits, per-user limits)
- [ ] Create discount application endpoint during checkout
- [ ] Record applied discounts in `order_discounts` table
- [ ] Add discount usage counter increment

### Acceptance Criteria
- Discounts can be created with percentage or fixed amount
- Validation checks expiry, usage limits, and per-user limits
- Applied discounts are recorded and linked to orders
- Usage counters increment correctly

---

## PR #12: Inventory Management

### Description
Implement inventory tracking with stock adjustments and audit logs.

### Tasks
- [ ] Create inventory log routes (`routes/api/inventory/*`)
- [ ] Implement stock increase/decrease with reason tracking
- [ ] Create stock level endpoint per product/variant
- [ ] Add low-stock alert endpoint
- [ ] Implement stock reservation for pending orders

### Acceptance Criteria
- Stock changes are logged with reasons
- Current stock levels are queryable per product and variant
- Low-stock alerts return products below threshold
- Pending orders reserve stock appropriately

---

## PR #13: Audit Logging

### Description
Implement audit logging for critical operations across the system.

### Tasks
- [ ] Create audit log middleware for CRUD operations
- [ ] Log user actions (auth, profile changes)
- [ ] Log product/admin operations (catalog changes)
- [ ] Log order-related actions (status changes, cancellations)
- [ ] Create audit log query endpoint with filtering

### Acceptance Criteria
- Critical operations are logged with user, action, table, record ID, and details
- Audit logs are queryable by user, action, and date range
- Log entries are immutable

---

## PR #14: Frontend Pages

### Description
Build server-rendered pages for the e-commerce storefront.

### Tasks
- [ ] Create home page with featured products
- [ ] Create product listing page with category filtering and search
- [ ] Create product detail page with variants, images, and reviews
- [ ] Create cart page with item management
- [ ] Create checkout page with address selection and payment
- [ ] Create user account page (order history, wishlist, addresses)
- [ ] Create order confirmation page

### Acceptance Criteria
- All pages render correctly with data from the API
- Navigation between pages works
- Pages are responsive and follow consistent styling
- SEO-friendly with proper meta tags

---

## PR #15: Testing & CI/CD

### Description
Add test coverage and CI/CD pipeline configuration.

### Tasks
- [ ] Set up test framework (vitest) configuration
- [ ] Write unit tests for schema validation and utility functions
- [ ] Write integration tests for API endpoints
- [ ] Add CI workflow (GitHub Actions) for lint, typecheck, test
- [ ] Add deployment configuration for `void deploy`

### Acceptance Criteria
- All tests pass
- CI pipeline runs lint, typecheck, and tests
- Deployment workflow is configured for Cloudflare Workers
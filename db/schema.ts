// db/schema.ts
// Drizzle ORM schema for the EC site (Bun + void)
// Revised according to the adversarial review – integer PKs, foreign keys, indexes, enums, etc.

import { sqliteTable, integer, text, index } from "drizzle-orm/sqlite-core";

// ---------- Helper Enums (as integer constants) ----------
export const OrderStatus = {
  PENDING: 0,
  PAID: 1,
  SHIPPED: 2,
  DELIVERED: 3,
  CANCELLED: 4,
} as const;

export const PaymentStatus = {
  INITIATED: 0,
  SUCCEEDED: 1,
  FAILED: 2,
} as const;

export const ShippingStatus = {
  PENDING: 0,
  SHIPPED: 1,
  DELIVERED: 2,
  RETURNED: 3,
} as const;

export const AddressType = {
  SHIPPING: 0,
  BILLING: 1,
} as const;

export const DiscountType = {
  PERCENTAGE: "percentage",
  FIXED: "fixed",
} as const;

// ---------- Users ----------
export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email").notNull().unique(),
  name: text("name"),
  image: text("image"),
  passwordHash: text("password_hash"), // for future auth extensions
  mfaSecret: text("mfa_secret"), // optional MFA secret
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().defaultNow(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().defaultNow(),
  ratingCount: integer("rating_count").notNull().default(0),
  ratingAvg: integer("rating_avg").notNull().default(0), // *10
  deletedAt: integer("deleted_at", { mode: "timestamp" }),
});

// ---------- Wishlists & Items ----------
export const wishlists = sqliteTable("wishlists", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  isDefault: integer("is_default", { mode: "boolean" }).notNull().default(0),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().defaultNow(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().defaultNow(),
});

export const wishlistItems = sqliteTable("wishlist_items", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  wishlistId: integer("wishlist_id").notNull().references(() => wishlists.id, { onDelete: "cascade" }),
  variantId: integer("variant_id").references(() => productVariants.id, { onUpdate: "cascade", onDelete: "restrict" }),
  productId: integer("product_id").notNull().references(() => products.id, { onUpdate: "cascade", onDelete: "restrict" }),
  addedAt: integer("added_at", { mode: "timestamp" }).notNull().defaultNow(),
},
  (table) => ({
    wishlistProductIdx: index("wishlist_product_idx").on(table.wishlistId, table.productId),
  })
);

// ---------- Categories ----------
export const categories = sqliteTable("categories", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  parentId: integer("parent_id").references(() => categories.id, { onUpdate: "cascade", onDelete: "set null" }),
});

// ---------- Products ----------
export const products = sqliteTable("products", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  description: text("description"),
  priceCents: integer("price_cents").notNull(),
  currency: text("currency").notNull().default("USD"),
  stock: integer("stock").notNull().default(0),
  categoryId: integer("category_id").notNull().references(() => categories.id),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().defaultNow(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().defaultNow(),
  ratingCount: integer("rating_count").notNull().default(0),
  ratingAvg: integer("rating_avg").notNull().default(0), // *10
  deletedAt: integer("deleted_at", { mode: "timestamp" }),
});

// ---------- Product Images ----------
export const productImages = sqliteTable("product_images", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  productId: integer("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
  url: text("url").notNull(),
  altText: text("alt_text"),
  displayOrder: integer("display_order").notNull().default(0),
});

// ---------- Variants, Options & Values ----------
export const productVariants = sqliteTable("product_variants", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  productId: integer("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
  sku: text("sku").notNull().unique(),
  priceCents: integer("price_cents").notNull(),
  stock: integer("stock").notNull().default(0),
});

export const productOptions = sqliteTable("product_options", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
});

export const productOptionValues = sqliteTable("product_option_values", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  optionId: integer("option_id").notNull().references(() => productOptions.id, { onDelete: "cascade" }),
  value: text("value").notNull(),
});

export const productOptionItems = sqliteTable("product_option_items", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  variantId: integer("variant_id").notNull().references(() => productVariants.id, { onDelete: "cascade" }),
  optionValueId: integer("option_value_id").notNull().references(() => productOptionValues.id, { onDelete: "cascade" }),
});

// ---------- Reviews ----------
export const productReviews = sqliteTable("product_reviews", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  productId: integer("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  rating: integer("rating").notNull(), // 1-5
  comment: text("comment"),
  created_at: integer("created_at", { mode: "timestamp" }).notNull().defaultNow(),
},
  (table) => ({
    productRatingIdx: index("product_rating_idx").on(table.productId, table.rating),
  })
);

export const reviewImages = sqliteTable("review_images", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  reviewId: integer("review_id").notNull().references(() => productReviews.id, { onDelete: "cascade" }),
  url: text("url").notNull(),
  altText: text("alt_text"),
});

// ---------- Carts ----------
export const carts = sqliteTable("carts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().defaultNow(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().defaultNow(),
});

export const cartItems = sqliteTable("cart_items", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  cartId: integer("cart_id").notNull().references(() => carts.id, { onDelete: "cascade" }),
  productId: integer("product_id").notNull().references(() => products.id, { onUpdate: "cascade", onDelete: "restrict" }),
  variantId: integer("variant_id").references(() => productVariants.id, { onUpdate: "cascade", onDelete: "restrict" }),
  quantity: integer("quantity").notNull().default(1),
},
  (table) => ({
    cartProductId: index("cart_product_idx").on(table.cartId, table.productId),
  })
);

// ---------- Orders ----------
export const orders = sqliteTable("orders", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  totalCents: integer("total_cents").notNull(),
  currency: text("currency").notNull().default("USD"),
  status: integer("status").notNull().default(OrderStatus.PENDING),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().defaultNow(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().defaultNow(),
});

export const orderItems = sqliteTable("order_items", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  orderId: integer("order_id").notNull().references(() => orders.id, { onDelete: "cascade" }),
  productId: integer("product_id").notNull().references(() => products.id, { onUpdate: "cascade", onDelete: "restrict" }),
  variantId: integer("variant_id").references(() => productVariants.id, { onUpdate: "cascade", onDelete: "restrict" }),
  quantity: integer("quantity").notNull().default(1),
  priceCents: integer("price_cents").notNull(),
},
  (table) => ({
    orderProductIdx: index("order_product_idx").on(table.orderId, table.productId),
  })
);

// ---------- Payments ----------
export const payments = sqliteTable("payments", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  orderId: integer("order_id").notNull().references(() => orders.id, { onDelete: "cascade" }),
  provider: text("provider").notNull(),
  status: integer("status").notNull().default(PaymentStatus.INITIATED),
  amountCents: integer("amount_cents").notNull(),
  currency: text("currency").notNull().default("USD"),
  transactionId: text("transaction_id"),
  paidAt: integer("paid_at", { mode: "timestamp" }),
});

// ---------- Shipping Infos ----------
export const shippingInfos = sqliteTable("shipping_infos", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  orderId: integer("order_id").notNull().references(() => orders.id, { onDelete: "cascade" }),
  carrier: text("carrier").notNull(),
  trackingNumber: text("tracking_number"),
  status: integer("status").notNull().default(ShippingStatus.PENDING),
  shippedAt: integer("shipped_at", { mode: "timestamp" }),
  estimatedDelivery: integer("estimated_delivery", { mode: "timestamp" }),
});

// ---------- Order Status History ----------
export const orderStatusHistory = sqliteTable("order_status_history", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  orderId: integer("order_id").notNull().references(() => orders.id, { onDelete: "cascade" }),
  status: integer("status").notNull(),
  changedAt: integer("changed_at", { mode: "timestamp" }).notNull().defaultNow(),
  note: text("note"),
});

// ---------- Discounts & Order Discounts ----------
export const discounts = sqliteTable("discounts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  code: text("code").notNull().unique(),
  type: text("type").notNull(), // "percentage" or "fixed"
  valueCents: integer("value_cents").notNull(), // if percentage, store percent*100
  expiresAt: integer("expires_at", { mode: "timestamp" }),
  usageLimit: integer("usage_limit"),
  usedCount: integer("used_count").notNull().default(0),
  perUserLimit: integer("per_user_limit"),
});

export const orderDiscounts = sqliteTable("order_discounts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  order_id: integer("order_id").notNull().references(() => orders.id, { onDelete: "cascade" }),
  discount_id: integer("discount_id").notNull().references(() => discounts.id, { onUpdate: "cascade", onDelete: "restrict" }),
  amountCents: integer("amount_cents").notNull(),
},
  (table) => ({
    orderDiscountIdx: index("order_discount_idx").on(table.orderId, table.discountId),
  })
);

// ---------- User Addresses ----------
export const userAddresses = sqliteTable("user_addresses", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  type: integer("type").notNull().default(AddressType.SHIPPING), // 0=shipping,1=billing
  line1: text("line1").notNull(),
  line2: text("line2"),
  city: text("city").notNull(),
  state: text("state").notNull(),
  zip: text("zip").notNull(),
  country: text("country").notNull(),
  isDefault: integer("is_default", { mode: "boolean" }).notNull().default(0),
});

// ---------- Inventory Logs ----------
export const inventoryLogs = sqliteTable("inventory_logs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  productId: integer("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
  change: integer("change").notNull(), // positive or negative
  reason: text("reason"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().defaultNow(),
},
  (table) => ({
    productCreatedAtIdx: index("inventory_product_created_idx").on(table.productId, table.createdAt),
  })
);

// ---------- Audit Logs ----------
export const auditLogs = sqliteTable("audit_logs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").references(() => users.id, { onDelete: "set null" }),
  action: text("action").notNull(),
  tableName: text("table_name"),
  recordId: integer("record_id"),
  details: text("details"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().defaultNow(),
},
  (table) => ({
    userActionIdx: index("audit_user_action_idx").on(table.userId, table.action),
    createdAtIndex: index("audit_created_at_idx").on(table.createdAt),
  })
);

// ---------- Indexes (examples) ----------
// Composite indexes for faster look‑ups
// Note: Drizzle allows defining indexes via separate calls in migrations; this file focuses on table definitions.

export default {
  users,
  wishlists,
  wishlistItems,
  categories,
  products,
  productImages,
  productVariants,
  productOptions,
  productOptionValues,
  productOptionItems,
  productReviews,
  reviewImages,
  carts,
  cartItems,
  orders,
  orderItems,
  payments,
  shippingInfos,
  orderStatusHistory,
  discounts,
  orderDiscounts,
  userAddresses,
  inventoryLogs,
  auditLogs,
};

import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "db/schema.ts",
  out: "db/migrations",
  dialect: "sqlite",
  dbCredentials: {
    url: "db/database.db",
  },
  verbose: true,
  strict: true,
});

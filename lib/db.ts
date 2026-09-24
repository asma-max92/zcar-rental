import { PrismaClient } from "@prisma/client";

// Fix: prepared statement "s0" already exists — occurs when Prisma
// uses prepared statements on pooled connections. pgbouncer=true
// disables prepared statements for compatibility with Supabase/Vercel
// Postgres connection pooling.
const dbUrl = process.env.DATABASE_URL;
if (dbUrl && !dbUrl.includes("pgbouncer")) {
  process.env.DATABASE_URL = dbUrl.includes("?")
    ? `${dbUrl}&pgbouncer=true`
    : `${dbUrl}?pgbouncer=true`;
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

// Cache Prisma client on global to prevent connection pool exhaustion
// in serverless environments (Vercel) where the same process may
// handle multiple requests during a warm invocation.
if (!globalForPrisma.prisma) globalForPrisma.prisma = prisma;

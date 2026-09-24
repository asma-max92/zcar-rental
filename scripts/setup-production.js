const { execSync } = require("child_process");
const readline = require("readline");
const fs = require("fs");
const path = require("path");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function ask(q) {
  return new Promise((resolve) => rl.question(q, resolve));
}

async function main() {
  console.log("\n=== Z Car Rental Production Setup ===\n");

  const projectRef = await ask("Your Supabase project ref (the XXXXXX in postgres.XXXXXX): ");
  const password = await ask("Your Supabase database password: ");

  const dbUrl = `postgresql://postgres.${projectRef}:${password}@aws-0-us-east-1.pooler.supabase.com:6543/postgres`;

  const envPath = path.join(__dirname, "..", ".env");
  let envContent = "";
  try {
    envContent = fs.readFileSync(envPath, "utf8");
  } catch {
    // .env doesn't exist yet, start fresh
  }

  // Replace or add DATABASE_URL
  if (envContent.includes("DATABASE_URL=")) {
    envContent = envContent.replace(/DATABASE_URL=.*/g, `DATABASE_URL='${dbUrl}'`);
  } else {
    envContent += `\nDATABASE_URL='${dbUrl}'\n`;
  }

  fs.writeFileSync(envPath, envContent);
  console.log("✓ Updated .env with Supabase URL\n");

  const projectRoot = path.join(__dirname, "..");
  const childEnv = { ...process.env, DATABASE_URL: dbUrl };

  console.log("Running migrations...");
  try {
    execSync("npx prisma migrate deploy", {
      stdio: "inherit",
      cwd: projectRoot,
      env: childEnv,
    });
    console.log("✓ Migrations complete\n");
  } catch (e) {
    console.error("Migration failed:", e.message);
    process.exit(1);
  }

  console.log("Seeding database...");
  try {
    execSync("npx ts-node --compiler-options '{\"module\":\"CommonJS\"}' scripts/seed.ts", {
      stdio: "inherit",
      cwd: projectRoot,
      env: { ...childEnv, ADMIN_SEED_PASSWORD: "admin123" },
    });
    console.log("✓ Seed complete\n");
  } catch (e) {
    console.error("Seed failed:", e.message);
    process.exit(1);
  }

  console.log("=== DONE ===");
  console.log("Login: https://zcarrentalmiami.com/login");
  console.log("Email: john@doe.com");
  console.log("Password: admin123");
  console.log("Admin: https://zcarrentalmiami.com/admin/vehicles\n");

  rl.close();
}

main();

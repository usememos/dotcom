import nextEnv from "@next/env";

const { loadEnvConfig } = nextEnv;

loadEnvConfig(process.cwd());

const requiredEnvNames = ["NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY"];

const missingEnvNames = requiredEnvNames.filter((name) => !process.env[name]);

if (missingEnvNames.length > 0) {
  console.error("Missing required build-time environment variables for deployment:");
  for (const name of missingEnvNames) {
    console.error(`- ${name}`);
  }
  console.error("Set these before running pnpm run deploy so static routes are built with the correct public config.");
  process.exitCode = 1;
}

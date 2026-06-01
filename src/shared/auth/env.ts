const CLERK_PUBLISHABLE_KEY_ENV = "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY";
const CLERK_SECRET_KEY_ENV = "CLERK_SECRET_KEY";

export function getClerkPublishableKey() {
  return process.env[CLERK_PUBLISHABLE_KEY_ENV];
}

export function getClerkSecretKey() {
  return process.env[CLERK_SECRET_KEY_ENV];
}

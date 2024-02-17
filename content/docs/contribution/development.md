---
title: Contribute to Memos
---

Memos is built with a curated tech stack. It is optimized for developer experience and is very easy to start working on the code:

- It has no external dependency.
- It requires zero config.
- 1 command to start backend and 1 command to start frontend, both with live reload support.

## Working with Docker

1. Clone the repo

   ```bash
   git clone https://github.com/usememos/memos
   ```

2. Use `docker-compose.dev.yaml` as default for Docker Compose, instead of `docker-compose.yaml` reserved for normal users

   ```bash
   echo 'COMPOSE_FILE=scripts/docker-compose.dev.yaml' > .env
   ```

3. For the first run, you'll need to install Node modules and generate TypeScript code of gRPC proto

   ```bash
   docker compose run pnpm install
   docker compose run buf generate
   ```

4. Start your services:
   ```bash
   docker compose --profile PROFILE_NAME up
   ```
   Where `PROFILE_NAME` can be: `sqlite` | `mysql` | `postgres`
   For more info, see `/scripts/docker-compose.dev.yaml`

Memos should now be running at <http://localhost:3001> and change either frontend or backend code would trigger live reload.

## Working without Docker

### Prerequisite

- [Node.js](https://nodejs.org), requires version >=18.0
- [pnpm](https://pnpm.io), requires version >=8.0
- [Go](https://go.dev/), requires Go >= 1.19
- [Air](https://github.com/cosmtrek/air) for backend live reload
- [Buf](https://buf.build/docs/installation) for generating TypeScript code from protobuf

### Steps

1. Clone the repo

   ```bash
   git clone https://github.com/usememos/memos
   ```

2. Start backend using air

   ```bash
   air -c scripts/.air.toml
   ```

3. Generate TypeScript code from protobuf with buf

   ```bash
   cd proto && buf generate
   ```

4. Start frontend dev server

   ```bash
   cd web && pnpm i && pnpm dev
   ```

Memos should now be running at <http://localhost:3001> and change either frontend or backend code would trigger live reload.

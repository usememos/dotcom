---
title: Contribute to memos
author: Steven
---

memos is built with a curated tech stack. It is optimized for developer experience and is very easy to start working on the code:

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
   echo 'COMPOSE_FILE=docker-compose.dev.yaml' > .env
   ```

3. Setup the environments

   ```bash
   docker compose run api go install github.com/cosmtrek/air@latest
   docker compose run web npm install
   ```

4. Start your services:

   ```bash
   docker compose up -d
   ```

memos should now be running at <http://localhost:3001> and change either frontend or backend code would trigger live reload.

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

memos should now be running at <http://localhost:3001> and change either frontend or backend code would trigger live reload.

---
title: Contribute to Memos
---

Memos is built with a curated tech stack. It is optimized for developer experience and is very easy to start working on the code:

- It has no external dependency.
- It requires zero config.
- 1 command to start backend and 1 command to start frontend, both with live reload support.

## Prerequisite

- [Node.js](https://nodejs.org), requires version >=18.0
- [pnpm](https://pnpm.io), requires version >=8.0
- [Go](https://go.dev/), requires Go >= 1.19
- [Air](https://github.com/cosmtrek/air) for backend live reload

## Steps

1. Clone the repo

   ```bash
   git clone https://github.com/usememos/memos
   ```

2. Start backend using air

   ```bash
   air -c scripts/.air.toml
   ```

3. Start frontend dev server

   ```bash
   cd web && pnpm i && pnpm dev
   ```

Memos should now be running at <http://localhost:3001> and change either frontend or backend code would trigger live reload.

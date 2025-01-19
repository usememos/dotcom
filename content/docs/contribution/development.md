---
title: Contribute to Memos
---

Memos is built with a curated tech stack. It is optimized for developer experience and is very easy to start working on the code:

- It has no external dependency.
- It requires zero config.

## Prerequisite

- [Go](https://go.dev/)
- [Node.js](https://nodejs.org)
- [pnpm](https://pnpm.io)

## Steps

1. Clone the repo

   ```bash
   git clone https://github.com/usememos/memos
   ```

2. Build and run backend server

   ```bash
   sh scripts/build.sh
   ```

   Then you can run the server following building outputs.

3. Start frontend dev server

   ```bash
   cd web && pnpm i && pnpm dev
   ```

Memos should now be running at <http://localhost:3001> and change either frontend or backend code would trigger live reload.

---
title: Self-Hosting
---

This document provides a comprehensive guide on deploying Memos with Docker, including installation and upgrading instructions.

## Prerequisites

Before proceeding with Memos installation, ensure you meet the following prerequisites:

- **A server with [Docker](https://www.docker.com) installed:** Memos is designed to be self-hosted with Docker.

## Docker Run

To set up Memos using `docker run`, execute the following one command to start Memos:

```bash
docker run -d \
  --init \
  --name memos \
  --publish 5230:5230 \
  --volume ~/.memos/:/var/opt/memos \
  ghcr.io/usememos/memos:latest
```

This command will launch Memos in the background, exposing it on port `5230`. Data will be stored in the `~/.memos/` directory. You can customize the port and the data directory path as needed.

## Docker Compose

To deploy Memos using `docker compose`, create a `docker-compose.yml` file with the following configuration:

```yaml
version: "3.0"
services:
  memos:
    image: ghcr.io/usememos/memos:latest
    container_name: memos
    volumes:
      - ~/.memos/:/var/opt/memos
    ports:
      - 5230:5230
```

Now, execute `docker-compose up -d` to initiate Memos. While editing the port and data directory is possible, only modify the first port (e.g., `8081:5230`) to specify an alternative port. The second port designates the port Memos is listening on inside the container. The same principle applies to directory paths, where the first path represents the location on your host system, and the second path signifies the directory inside the container.

## Upgrading Memos

To upgrade Memos to the latest version, perform the following steps:

1. First, stop and remove the old container:

   ```bash
   docker stop memos && docker rm memos
   ```

2. Although optional, it's advisable to back up your database:

   ```bash
   cp -r ~/.memos/memos_prod.db ~/.memos/memos_prod.db.bak
   ```

3. Next, pull the latest memos image:

   ```bash
   docker pull ghcr.io/usememos/memos:latest
   ```

4. Finally, initiate Memos by following the steps outlined in the [Docker Run](#docker-run) section. Your upgraded Memos instance will now be up and running with the latest enhancements and features.

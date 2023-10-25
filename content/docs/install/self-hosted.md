---
title: Self-Hosted
---

This document provides a step-by-step guide to running memos with Docker.

- [Docker run](#docker-run)
- [Docker compose](#docker-compose)
- [Upgrade memos to latest version](#upgrade-memos-to-latest-version)

### Prerequisites

Before starting, make sure you have installed [Docker](https://www.docker.com).

## Docker run

To deploy memos using docker run, you simply need to run one command:

```bash
docker run -d \
  --init \
  --name memos \
  --publish 5230:5230 \
  --volume ~/.memos/:/var/opt/memos \
  ghcr.io/usememos/memos:latest
```

This will start memos in the background and expose it on port 5230. The data will be stored in `~/.memos/`. You can change the port and the path to the data directory as you like. However, only change the first port, like `8081:5230` to use port 8081. The second port is the port that memos is listening on inside the container. The same is true for the directory. The first path is the path on your host system, the second path is the path inside the container.

## Docker compose

To deploy memos using docker compose, you need to create a file called `docker-compose.yml` with the following content:

```makefile
version: "3.0"
services:
  memos:
    image: neosmemo/memos:latest
    container_name: memos
    volumes:
      - ~/.memos/:/var/opt/memos
    ports:
      - 5230:5230
```

Now you can run `docker-compose up -d` to start memos.

Here, you can edit the port and the path to the data directory as you like. However, only change the first port, like `8081:5230` to use port 8081. The second port is the port that memos is listening on inside the container. The same is true for the directory. The first path is the path on your host system, the second path is the path inside the container.

Then, you can start memos using `docker-compose up -d`.

## Upgrade memos to latest version

To upgrade memos to the latest version, you need to stop and remove the old container first:

```bash
docker stop memos && docker rm memos
```

It's recommended but optional to backup your database:

```bash
cp -r ~/.memos/memos_prod.db ~/.memos/memos_prod.db.bak
```

Then pull the latest image:

```bash
docker pull ghcr.io/usememos/memos:latest
```

Finally, start memos again by following the steps in the [Docker run](#docker-run) section.

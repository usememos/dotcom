---
title: Container Install
---

This document provides a basic guide on deploying Memos with Docker.

## Prerequisites

- **Access to a server with [Docker](https://www.docker.com) installed**

## Docker Run

To set up Memos using `docker run`, execute the following one command to start Memos:

```bash
docker run -d \
  --init \
  --name memos \
  --publish 5230:5230 \
  --volume ~/.memos/:/var/opt/memos \
  neosmemo/memos:stable
```

This command will launch Memos in the background, exposing it on port **5230**. Data will be stored in **~/.memos/**, a hidden directory inside your user's home.

{% admonition icon="note" %}
Memos supports advanced [runtime options](runtime-options.md) to customize the server behavior.
{% /admonition %}

## Docker Compose

To deploy Memos using `docker compose`, create a `docker-compose.yml` file with the following configuration:

```yaml
services:
  memos:
    image: neosmemo/memos:stable
    container_name: memos
    volumes:
      - ~/.memos/:/var/opt/memos
    ports:
      - 5230:5230
```

Now, execute `docker compose up -d` to initiate Memos. While editing the port and data directory is possible, only modify the first port (e.g., `8081:5230`) to specify an alternative port. The second port designates the port Memos is listening on inside the container. The same principle applies to directory paths, where the first path represents the location on your host system, and the second path signifies the directory inside the container.

## Docker on Windows

As long as you have plenty of RAM, you can use [Docker Desktop](https://www.docker.com/products/docker-desktop/) to run Memos.

{% admonition icon="important" %}
To store the data directly on the host, use `/c/Users/<username>/memos/` or an absolute Windows path.
{% /admonition %}

### Docker Run on PowerShell

```
docker run -d `
  --init `
  --name memos `
  --publish 5230:5230 `
  --volume $Env:USERPROFILE\memos:/var/opt/memos `
  neosmemo/memos:stable
```

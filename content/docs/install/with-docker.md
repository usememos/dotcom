---
title: Install with Docker
author: Steven
---

This document provides a step-by-step guide to running memos with Docker.

## Prerequisites

Before starting, make sure you have installed [Docker](https://www.docker.com).

## Start memos locally

```bash
docker run -d \
  --init \
  --name memos \
  --publish 5230:5230 \
  --volume ~/.memos/:/var/opt/memos \
  ghcr.io/usememos/memos:latest
```

memos will store its data under `~/.memos`, and it will start listening on <http://localhost:5230>.

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

Finally, start memos again by following the steps in the [Start memos locally](#start-memos-locally) section.

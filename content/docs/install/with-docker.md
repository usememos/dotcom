---
title: Install with Docker
author: Steven
---

This document provides a step-by-step guide to running memos with Docker.

## Prerequisites

Before starting, make sure you have installed [Docker](https://www.docker.com).

## Start memos

```bash
docker run -d \
  --init \
  --name memos \
  --publish 5230:5230 \
  --volume ~/.memos/:/var/opt/memos \
  ghcr.io/usememos/memos:latest
```

memos will store its data under `~/.memos`, and it will start listening on <http://localhost:5230>.

## Update memos

To update memos to the latest version, stop memos first:

```bash
docker stop memos
```

And then pull the latest image:

```bash
docker pull ghcr.io/usememos/memos:latest
```

Before starting memos again, you need to remove the old container:

```bash
docker rm memos
```

Then [start memos](#start-memos) again.

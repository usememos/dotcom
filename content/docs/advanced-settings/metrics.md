---
title: Metrics
---

By default, Memos collects anonymized metrics using [PostHog](https://posthog.com/). These metrics are triggered during the following events:

- Server Start
- Memo Creation
- Memo Comment Creation
- Webhook Dispatch
- Resource Creation
- User Creation

If you wish to opt out of metrics collections, add the `--metric=false` flag to your Docker command like so:

```shell
docker run -d --name memos -p 5230:5230 -v ~/.memos/:/var/opt/memos neosmemo/memos:stable --metric=false
```

For Docker Compose, you can use `command` in your compose file:

```diff
version: "3.0"
services:
  memos:
    image: neosmemo/memos:stable
    container_name: memos
+   command: --metric=false 
    volumes:
      - ./memos/:/var/opt/memos
    ports:
      - 5230:5230
```

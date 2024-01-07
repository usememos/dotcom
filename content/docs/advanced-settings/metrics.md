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

If you wish to opt out of metrics collections, add the `--metrics=false` flag to your Docker command like so:

```shell
docker run -d --name memos -p 5230:5230 -v ~/.memos/:/var/opt/memos ghcr.io/usememos/memos:latest --metric=false
```
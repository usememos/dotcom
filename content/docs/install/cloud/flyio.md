---
title: Install with fly.io
---

_provided by [@hu3rror/memos-on-fly](https://github.com/hu3rror/memos-on-fly) on GitHub_

## Prerequisites

- [fly.io](https://fly.io/) account
- [backblaze](https://www.backblaze.com/) account or other B2 service account
- [Optional] _If you want to build your own docker image, clone repository from [hu3rror/memos-on-fly-build](https://github.com/hu3rror/memos-on-fly-build)._

## Install flyctl

1. Follow [the instructions](https://fly.io/docs/getting-started/installing-flyctl/) to install fly's command-line interface `flyctl`.
2. [log into flyctl](https://fly.io/docs/getting-started/log-in-to-fly/).

```sh
flyctl auth login
```

## Launch a fly application

> **do not** setup Postgres and **do not** deploy yet!

```sh
flyctl launch
```

This command creates a `fly.toml` file.

## Edit your `fly.toml`

You can take [fly.example.toml](https://github.com/hu3rror/memos-on-fly/blob/main/fly.example.toml) in this repository as a reference and modify according to the comments.

### Details of manual modifications

#### 1. Add a `build` section.

```toml
[build]
  image = "ghcr.io/hu3rror/memos-litestream:latest"
```

##### 2. Add an `env` section.

```toml
[env]
  DB_PATH = "/var/opt/memos/memos_prod.db"  # do not change
  LITESTREAM_REPLICA_BUCKET = "<filled_later>"  # change to your litestream bucket name
  LITESTREAM_REPLICA_ENDPOINT = "<filled_later>"  # change to your litestream endpoint url
  LITESTREAM_REPLICA_PATH = "memos_prod.db"  # keep the default or change to whatever path you want
```

##### 3. Configure litestream backups

> ℹ️ If you want to use another storage provider, check litestream's ["Replica Guides"](https://litestream.io/guides/) section and adjust the config as needed.

1. Log into B2 and [create a bucket](https://litestream.io/guides/backblaze/#create-a-bucket). Instead of adjusting the litestream config directly, we will add storage configuration to `fly.toml`.
2. Now you can set the values of `LITESTREAM_REPLICA_ENDPOINT` and `LITESTREAM_REPLICA_BUCKET` to your `[env]` section.
3. Then, create [an access key](https://litestream.io/guides/backblaze/#create-a-user) for this bucket. Add the key to fly's secret store (Don't add `<` and `>`).
   ```sh
   flyctl secrets set LITESTREAM_ACCESS_KEY_ID="<keyId>" LITESTREAM_SECRET_ACCESS_KEY="<applicationKey>"
   ```

##### 4. Add a persistent volume

1. Create a [persistent volume](https://fly.io/docs/reference/volumes/). Fly's free tier includes `3GB` of storage across your VMs. Since `memos` is very light on storage, a `1GB` volume will be more than enough for most use cases. It's possible to change volume size later. A how-to can be found in the _"scale persistent volume"_ section below.

   ```sh
   flyctl volumes create memos_data --region <your_region> --size <size_in_gb>
   ```

   For example:

   ```sh
   flyctl volumes create memos_data --region hkg --size 1
   ```

2. Attach the persistent volume to the container by adding a `mounts` section to `fly.toml`.
   ```toml
   [[mounts]]
      source = "memos_data"
      destination = "/var/opt/memos"
      processes = ["app"]
   ```

##### 5. Change `internal_port` in `[[services]]`

```toml
[[services]]
  internal_port = 5230
```

##### 6. Deploy to fly.io

```sh
flyctl deploy
```

If all is well, you can now access memos by running `flyctl open`. You should see its login page.

If the latest docker image has been released, you can easily upgrade the memo by typing `flyctl deploy` in your memos project's folder.

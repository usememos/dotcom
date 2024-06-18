---
title: Upgrade
---

## Manual Upgrade

To upgrade Memos to the latest version, perform the following steps:

1. First, stop and remove the old container:

   ```bash
   docker stop memos && docker rm memos
   ```

2. Although optional, it's **recommended** to back up your database:

   ```bash
   cp -r ~/.memos/memos_prod.db ~/.memos/memos_prod.db.bak
   ```

   or

   ```bash
   tar -czvf ~/.memos/memos_prod.db_$(date +%Y%m%d).tar.gz ~/.memos/memos_prod.db
   ```

3. Next, pull the latest memos image:

   ```bash
   docker pull neosmemo/memos:stable
   ```

4. Finally, start Memos by following the steps outlined in the [Docker Run](/docs/install/container-install#docker-run) section. Your upgraded Memos instance will now be up and running with the latest enhancements and features.

## Automatic Upgrades

Memos can be automatically upgraded by [Watchtower](https://github.com/containrrr/watchtower).

{% admonition icon="caution" %}
It's advised that you use a custom automatic data backup strategy in parallel to automatic updates. This way, you can easily roll back to a previous version if needed.

While automatic updates usually work well, they can cause issues if you use the `latest` or even the `stable` tag, as they can receive major and minor version upgrades with database schema changes.
{% /admonition %}

{% admonition icon="note" %}
Patch version upgrades are safe, as they only contain bug fixes and small changes to the codebase.

To only receive **Patch** version updates automatically, use a **Major**.**Minor** tag like `0.22`.
{% /admonition %}

The following is a sample docker-compose.yml that spins up Memos and Watchtower. Watchtower will check for updates every day at 4 AM. If you need to set a custom schedule, write your own [cron expression](https://crontab.cronhub.io).

```yaml
services:
  memos:
    image: neosmemo/memos:0.22
    labels: { com.centurylinklabs.watchtower.enable: true }
    container_name: memos
    hostname: memos
    restart: unless-stopped
    ports: ["5230:5230"]
    volumes:
      - ~/.memos:/var/opt/memos

  watchtower:
    image: containrrr/watchtower:1.7.1
    container_name: watchtower
    restart: unless-stopped
    command: --stop-timeout 60s --cleanup --schedule "0 0 4 * * *" --label-enable
    volumes: ["/var/run/docker.sock:/var/run/docker.sock"]
```

{% admonition icon="tip" %}
By setting up Watchtower with `--label-enable` and the Memos container with the label `com.centurylinklabs.watchtower.enable: true`, only the Memos container will be updated, leaving other containers untouched.
{% /admonition %}

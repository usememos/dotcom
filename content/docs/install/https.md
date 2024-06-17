---
title: Using HTTPS
---

This guide will show you how to secure Memos with HTTPS/TLS using a reverse proxy server. Caddy is covered by this guide, but you can also use Traefik, Nginx, Apache, HAProxy or any other reverse proxy server.

## Why Use Encryption?

If you install Memos on a publicly accessible server, it is important to ensure that the connection is secure. Otherwise, your password and notes will be transmitted in clear text that can be intercepted by anyone.

Using a secure connection will also get rid of the browser warnings that may appear when accessing Memos over plain HTTP.

## Using Caddy as Reverse Proxy

[Caddy](https://caddyserver.com) is a high-performance, easy-to-use, and open-source web server and reverse proxy with automatic TLS certificates that is perfect for securing Memos.

{% admonition icon="important" %}
Should you experience problems with Caddy, we recommend that you ask the Caddy community for advice, as it's a third-party software.
{% /admonition %}

The following is a sample all-in-one docker-compose.yml that spins up Caddy with Memos.

Characteristics:

- A [Caddyfile](https://caddyserver.com/docs/caddyfile) is injected into the Caddy container.
- Memos port 5230 is not publicly accessible.
- Caddy is publicly accessible on ports 80 and 443.
- Caddy will use gzip and zstd compression for Memos.
- Caddy will log accesses to a file, rotating the log file every 10 MB, keeping up to 20 files, and deleting the oldest files after 7 days.
- Caddy will reverse proxy **memos.your-domain.com** and **memos.your-domain.net** to the Memos container. Edit those entries to reflect your domain name(s).
- Data for Caddy and Memos are stored in the `~/.caddy` and `~/.memos` directories, respectively.

### docker-compose.yml

```yaml
services:
  memos:
    image: neosmemo/memos:stable
    container_name: memos
    restart: unless-stopped
    expose: [5230/tcp]
    volumes:
      - ~/.memos:/var/opt/memos

  caddy:
    image: caddy:2.8
    container_name: caddy
    restart: unless-stopped
    ports:
      - 0.0.0.0:80:80/tcp
      - 0.0.0.0:443:443
    configs:
      - source: Caddyfile
        target: /etc/caddy/Caddyfile
    volumes:
      - ~/.caddy/data:/data
      - ~/.caddy/config:/config
      - ~/.caddy/logs:/logs

configs:
  Caddyfile:
    content: |
      memos.your-domain.com, memos.your-domain.net {
        reverse_proxy memos:5230
        log {
          format console
          output file /logs/memos.log {
            roll_size 10mb
            roll_keep 20
            roll_keep_for 7d
          }
        }
        encode {
          zstd
          gzip
          minimum_length 1024
        }
      }
```

{% admonition icon="warning" %}
If you use a local domain name, the kind resolved via hosts file or a local DNS server, you must add another entry to the Caddyfile. Watch for the indentation!
{% /admonition %}

```yaml
localhost, memos.local {
    tls internal
    reverse_proxy memos:5230
}
```

---
title: Install with Docker
author: Steven
---

This document provides a step-by-step guide to running memos with Docker and securing it with Nginx.

- [Docker run](#docker-run)
- [Docker compose](#docker-compose)
- [Using nginx as a reverse proxy](#using-nginx-as-a-reverse-proxy)
  - [SSL](#ssl)
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

## Using nginx as a reverse proxy

Once you have memos running, you can make a reverse proxy using nginx to connect a domain name to your instance.

To do this, first install nginx. Then, create a file called `/etc/nginx/sites-available/your-domain-name.com` with the following content:

```nginx
server {
    server_name your-domain-name.com;

    location / {
        proxy_pass http://localhost:5230;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Now, you can enable the site using `sudo ln -s /etc/nginx/sites-available/your-domain-name.com /etc/nginx/sites-enabled/your-domain-name.com`. Then, you can restart nginx using `sudo systemctl restart nginx`.

### SSL

The easiest way to apply a SSL certificate is using _Let's Encrypt_. You can use [Certbot](https://certbot.eff.org/) to get a certificate. To do this, first install certbot using `sudo apt install certbot`. Then, you can get a certificate using `sudo certbot --nginx -d your-domain-name.com`. Make sure the domain name is already pointed to your server. Certbot will try to create and install the certificate to your nginx configuration. If it has successfully done this,a few lines looking like this will be added to your configuration file:

```nginx
    listen 443 ssl; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/your-domain-name.com/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/your-domain-name.com/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot
```

If these lines are present, you can restart nginx using `sudo systemctl restart nginx`. SSL should now be available.

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

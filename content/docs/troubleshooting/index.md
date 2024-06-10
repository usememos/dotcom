---
title: Troubleshooting
---

{% admonition icon="warning" title="Warning"%}
Instructions in this section are for advanced users.
{% /admonition %}

## Introduction

This page contains instructions for troubleshooting Memos instances.

Some assumptions are made in the instructions below:

- The container name is `memos`.
- The database driver is `sqlite`.
- The database file is `/var/opt/memos/memos_prod.db`.

{% admonition icon="important" %}
  `/var/opt/memos/memos_prod.db` is the standard path *inside* the container. It will only be different if you have supplied a different `MEMOS_DATA` environment variable on the container creation, which deviates from the default.
  {% /admonition %}

## Re-enable password login

If you have locked yourself out of your Memos instance with a failed Single-Sign-On (SSO) setup, you can re-enable regular login by following these steps.

- Get a container shell:

  ```bash
  docker exec -it memos ash
  ```

- Install SQLite shell:

  ```bash
  apk add --no-cache sqlite
  ```

- Enable password login on the database:

  ```bash
  sqlite3 /var/opt/memos/memos_prod.db -cmd '.mode csv' <<EOF
    UPDATE system_setting 
      SET value = json_patch(value, '{"disallowPasswordLogin": false}') 
        WHERE name = 'GENERAL';
  EOF
  ```

  {% admonition icon="important" %}
  This is a single command. Paste at once.
  {% /admonition %}

- Exit the container shell:

  ```bash
  exit
  ```

- Restart the container:

  ```bash
  docker restart memos
  ```

## Reset admin password

- Get a container shell:

  ```bash
  docker exec -it memos ash
  ```

- Install SQLite shell:

  ```bash
  apk add --no-cache sqlite
  ```

- Reset the password on the database:

  This will change the main user password to `secret` and unarchive the user. It will also show the user name, in case you forgot it.

  ```bash
  sqlite3 /var/opt/memos/memos_prod.db -cmd '.mode csv' <<EOF
    UPDATE user 
      SET password_hash='\$2a\$12\$fWLqtEFiwr0oFwz3I9H6Uu/W7MvPCJGA9fLlTDV5eO2qsH8yUANku',
        row_status = 'NORMAL'
          WHERE id = 1;
    SELECT user.username FROM user WHERE user.id = 1;
  EOF
  ```

  {% admonition icon="important" %}
  This is a single command. Paste at once.
  {% /admonition %}

- Exit the container shell:

  ```bash
  exit
  ```

- Restart the container:

  ```bash
  docker restart memos
  ```

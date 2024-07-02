---
title: Database Drivers
---

Memos supports the following database types:

- SQLite (default)
- MySQL (Starting from version 0.16.1)
- PostgreSQL (Starting from version 0.18.0)

## Using MySQL

By default, Memos continues to use SQLite as the default database driver. To switch to MySQL, you can use the following steps:

- **--driver** _mysql_ : This argument specifies that Memos should use the `mysql` driver instead of the default `sqlite`.

- **--dsn** _dbuser:dbpass@tcp(dbhost)/dbname_ : Provides the connection details for your MySQL server.

You can start Memos with Docker using the following command:

```shell
docker run -d --name memos -p 5230:5230 -v ~/.memos/:/var/opt/memos neosmemo/memos:stable --driver mysql --dsn 'root:password@tcp(localhost)/memos_prod'
```

Additionally, you can set these configurations via environment variables:

```shell
MEMOS_DRIVER=mysql
MEMOS_DSN=root:password@tcp(localhost)/memos_prod
```

## Using PostgreSQL

Starting from version 0.18.0, Memos also supports PostgreSQL as a database driver. To switch to PostgreSQL, you can use the following steps:

- **--driver** _postgres_ : This argument specifies that Memos should use the `postgres` driver instead of the default `sqlite`.

- **--dsn** _postgresql://postgres:PASSWORD@localhost:5432/memos_ : Provides the connection details for your PostgreSQL server.

You can start Memos with Docker using the following command:

```shell
docker run -d --name memos -p 5230:5230 -v ~/.memos/:/var/opt/memos neosmemo/memos:stable --driver postgres --dsn 'postgresql://postgres:PASSWORD@localhost:5432/memos'
```

Additionally, you can set these configurations via environment variables:

```shell
MEMOS_DRIVER=postgres
MEMOS_DSN=postgresql://root:password@localhost:5432/memos
```

Note that if the PostgreSQL server is not configured to support SSL connections you will need to add `?sslmode=disable` to the DSN.

Choose the database driver that best suits your needs and configure Memos accordingly.

## Docker Compose Example

The `compose.yml` below demonstrates the usage of Memos with a PostgreSQL database.

```yml
version: "3.0"
services:
  memos:
    image: neosmemo/memos:stable
    restart: always
    depends_on:
      - db
    ports:
      - 5230:5230
    environment:
      - MEMOS_DRIVER=postgres
      - MEMOS_DSN=user=memos password=secret dbname=memosdb host=db sslmode=disable

  db:
    image: postgres:16.1
    restart: unless-stopped
    volumes:
      - "./database:/var/lib/postgresql/data/"
    environment:
      POSTGRES_USER: memos
      POSTGRES_PASSWORD: secret
      POSTGRES_DB: memosdb
```

## Migrating data between different drivers

You can do this with some scripting language, for example I used ChatGPT to help me implement a SQLite to MySQL Python script: [SQLite to MySQL Migration](https://chat.openai.com/share/5a9b9e03-3666-4eb2-b9d9-31688729fcd3).

Similarly, you can make a SQLite to PostgreSQL script.

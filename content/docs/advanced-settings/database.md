---
title: Database Driver
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
docker run -d --name memos -p 5230:5230 -v ~/.memos/:/var/opt/memos ghcr.io/usememos/memos:latest --driver mysql --dsn 'root:password@tcp(localhost)/memos_prod'
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
docker run -d --name memos -p 5230:5230 -v ~/.memos/:/var/opt/memos ghcr.io/usememos/memos:latest --driver postgres --dsn 'postgresql://postgres:PASSWORD@localhost:5432/memos'
```

Choose the database driver that best suits your needs and configure Memos accordingly.

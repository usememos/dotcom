---
title: Using MySQL as the Database Driver
---

Starting in version 0.16.1, Memos has added support for using MySQL as the database driver.

## Enabling MySQL

By default, Memos uses SQLite as the database driver. To switch to MySQL, you need to specify two additional arguments when starting Memos:

- **--driver** _mysql_ : Specifies that Memos should use `mysql` instead of the default `sqlite`.

- **--dsn** _dbuser:dbpass@tcp(dbhost)/dbname_: Provides the connection details for your MySQL server.

Then you can start Memos with docker like this:

```shell
docker run -d --name memos -p 5230:5230 -v ~/.memos/:/var/opt/memos ghcr.io/usememos/memos:latest --driver mysql --dsn 'root:password@tcp(localhost)/memos_prod'
```

And you can also set these via environment variables:

```
MEMOS_DRIVER=mysql
MEMOS_DSN=root:password@tcp(localhost)/memos_prod
```

## Migrating data from SQLite to MySQL

If you are already using Memos with SQLite, you can migrate your data to MySQL with the following command `copydb`:

```shell
/usr/local/memos/memos --driver mysql --dsn 'dbuser:dbpass@tcp(dbhost)/dbname' copydb --from sqlite://path_to_your_memos_prod.db
```

This will copy all data from the SQLite database specified by `--from` into the MySQL server. If your Memos instance is running in Docker, you can execute this command inside the container.

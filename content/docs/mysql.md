# Using MySQL as the Database Driver

Starting in version 0.16.1, memos has added support for using MySQL as the database driver.

## Enabling MySQL

By default, memos uses SQLite as the database driver. To switch to MySQL, you need to specify two additional arguments when starting memos:

- **--driver** _mysql_ : Specifies that memos should use `mysql` instead of the default `sqlite`.

- **--dsn** _dbuser:dbpass@tcp(dbhost)/dbname_: Provides the connection details for your MySQL server.

Then you can start memos with docker like this:

```shell
docker run -d --name memos -p 5230:5230 -v ~/.memos/:/var/opt/memos ghcr.io/usememos/memos:latest --driver mysql --dsn 'root:password@tcp(localhost)/memos_prod'
```

And you can also set these via environment variables:

```
MEMOS_DRIVER=mysql
MEMOS_DSN=root:password@tcp(localhost)/memos_prod
```

## Migrating data from SQLite to MySQL

If you are already using memos with SQLite, you can migrate your data to MySQL with the following command `copydb`:

```shell
/usr/local/bin/memos --driver mysql --dsn 'dbuser:dbpass@tcp(dbhost)/dbname' copydb --from sqlite://path_to_your_memos_prod.db
```

This will copy all data from the SQLite database specified by `--from` into the MySQL server. If your memos instance is running in Docker, you can execute this command inside the container.

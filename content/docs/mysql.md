---
title: How to use MySQL as db driver
---

From *v0.16.0*, *Memos* added support for use MySQL as database driver.

Because this is a big feature, and need more test, so we only enable it in **dev** mode currently.

If you're intesting on the feature, please help us to test it.

Any problems? Feeling free to fire bug on Github, or contact us on Slack or Telegram.

## How to enable MySQL

*Memos* currently use SQLite as the default db drvier.

If you want to use MySQL instead, you should add two args in the command:


- **--mode** *dev* :
 
  to make Memos works on `dev` mode
- **--drvier** *mysql* :
 
  to tell Memos use `mysql` instead of default `sqlite`
- **--dsn** *dbuser:dbpass@tcp(dbhost)/dbname*:
  
  to tell Memos how to connect to your `mysql` server.

Your can also use environments to specified those args like this:

- MEMOS_MODE=dev
- MEMOS_DRIVER=mysql
-MEMOS_DSN=dbuser:dbpass@tcp(dbhost)/dbname

For example
```bash
/path/to/memos -m dev --driver mysql --dsn 'root:xxx@tcp(localhost)/memos_prod'
```

After all arg is set, you can just start Memos as normal.

## How to migrate from SQLite to MySQL

We have provide a tools *copydb* to do this. you can running this tool like below:

```bash
/usr/local/bin/memos -m dev --driver mysql --dsn 'dbuser:dbpass@tcp(dbhost)/dbname' copydb --from sqlite://path_to_your_memos_prod.db
```

This command will copy all data specifiled by args `--from` of `copydb` into the Memos server.

Also, if you're running a Memo in docker container, you can run this command in the container.


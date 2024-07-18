---
title: Startup Options
---

The following options can be set at startup to adjust some of the server's behavior. Options can be passed either as command line arguments to the **memos** binary or as environment variables.

| Environment  | CLI Flag | Default        | Description                                                                                                                                                                                                                       |
| ------------ | -------- | -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| MEMOS_MODE   | --mode   | prod           | Sets the mode of the server, influencing its runtime behavior and the database used. Can be **prod** (production), **dev** (development) or **demo** (demonstration).                                                             |
| MEMOS_ADDR   | --addr   | 0.0.0.0 (all)  | Specifies the address on which the server will listen for incoming connections.                                                                                                                                                   |
| MEMOS_PORT   | --port   | 5230           | Sets the port on which the server will be accessible.                                                                                                                                                                             |
| MEMOS_DATA   | --data   | /var/opt/memos | Specifies the directory where Memos will store its data.                                                                                                                                                                          |
| MEMOS_DRIVER | --driver | sqlite         | Sets the database driver to be used by Memos. Can be **sqlite**, **postgres** or **mysql**.                                                                                                                                       |
| MEMOS_DSN    | --dsn    |                | Specifies the database source name (DSN) for connecting to the database. Note that each database driver has its own format for specifying the DSN. See the [database documentation](/docs/install/database) for more information. |
| MEMOS_PUBLIC | --public | true           | Sets if the server is public or not. Including enabling/disabling user registration and public access to notes. Default is **true**.                                                                                              |

{% admonition icon="important" %}
Special characters in the **DSN** username and password must be escaped, such as converting `=` to `%3D`. Refer to the [Connection URIs documentation](https://www.postgresql.org/docs/11/libpq-connect.html#id-1.7.3.8.3.6) for more details. Tools like [URL Encoder](https://www.urlencoder.org/) can assist with this process.  
{% /admonition %}

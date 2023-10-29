---
title: Local Storage
---

`memos` supports save your files to local storage. You can use local storage to store your resources in your own server.

![local-storage-select](/content/docs/advanced-settings/local-storage/local-storage-select.png)

## Configuration

When you enable local storage, you can configure the storage path template.

![local-storage-edit](/content/docs/advanced-settings/local-storage/local-storage-edit.png)

The local storage path is relative to your database file. And `memos` supports a dynamic storage path. You can use the following variables in the storage path:

- `{year}`: The current year.
- `{month}`: The current month.
- `{day}`: The current day.
- `{hour}`: The current hour.
- `{minute}`: The current minute.
- `{second}`: The current second.
- `{timestamp}`: The current timestamp.
- `{filename}`: The original filename. e.g. `good-screenshot.png`

![edit-local-storage-path](/content/docs/advanced-settings/local-storage/edit-local-storage-path.png)

For example, if you set the storage path to `assets/{year}/{month}/{day}/{timestamp}_{filename}`, the file will be saved to `./assets/2020/01/01/1577808000_your-file-name.jpg`.

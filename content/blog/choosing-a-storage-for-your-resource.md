---
title: "Choosing a Storage for Your Resource: Database, S3, or Local Storage?"
author: Steven
---

In memos v0.12.0, we introduces a new feature for saving resources into local file system, which means that there are now three storage options available: database, S3, and local storage. Each option has its own advantages and disadvantages, and choosing the right one depends on your specific needs.

## Database storage

Database storage is designed to take advantage of SQLite's single-file database, making it easy to manage and integrate with other data. Transactions ensure data consistency, and it's good for small binary files. However, it has poor performance for large binary files, increases database size, and slows down backups, which can increase fragmentation in the database file.

## S3 cloud storage

S3 is a cloud storage service provided by Amazon that can store various types of files and offers high availability and scalability. It's also cost-effective for storing large files, making it a good choice for applications that need to store a lot of files. However, retrieving files can be slower than database or local storage, and it may require additional configuration and maintenance, as well as additional costs for data transfer and requests.

Related GitHub issue: <https://github.com/usememos/memos/issues/121>

## Local storage

Local storage is a simple data storage solution that can store various types of files and offers efficient data access and querying. It's good for small to medium-sized files and doesn't require additional costs or setup. However, it has limited space available, depending on the device and file system, and it's not suitable for large files or large numbers of files. It's also not as durable or reliable as database or S3 storage.

Related GitHub issue: <https://github.com/usememos/memos/issues/344>

## Conclusion

- If you mainly use text and have few files, use the default database storage.
- If you already have S3 object cloud storage, configure your S3 into memos.
- If you don't have S3 and use a lot of images, use local storage.

Choose the storage option that best suits your needs. Remember, the right storage option can make a big difference in your application's performance and efficiency.

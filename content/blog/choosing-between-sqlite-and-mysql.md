---
title: "Choosing Between SQLite and MySQL: The Database Dilemma"
author: Steven
description: In memos v0.16.1, we've introduced support for MySQL as an alternative to the previously used SQLite database. This addition expands your choices for managing your data. In this article, we'll discuss the reasons behind our initial choice of SQLite and why we added MySQL support.
published_at: 2023/10/24 20:24:00
feature_image: /content/blog/choosing-between-sqlite-and-mysql/banner.png
---

In memos v0.16.1, we've introduced support for MySQL as an alternative to the previously used SQLite database. This addition expands your choices for managing your data. In this article, we'll discuss the reasons behind our initial choice of SQLite and why we added MySQL support. We'll also explore the key differences between the two and offer guidance on which one you should choose for your specific needs.

## Why We Started with SQLite

### Lightweight and Widely Supported

At the inception of memos, we selected SQLite as our primary database due to its lightweight nature and widespread use. SQLite's single-file design allows for easy deployment and integration across various systems. This makes it an excellent choice for applications that prioritize simplicity and compatibility.

### Versatile on Any Machine

SQLite is well-suited for use on diverse hardware and software environments. Its small footprint and low resource requirements mean you can run it on virtually any machine, from resource-constrained devices to high-performance servers.

## Presenting MySQL Support

After memos was launched, there were numerous user requests for support for other database types to enable seamless integration with popular cloud database services: [GitHub Issue #163](https://github.com/usememos/memos/issues/163), [GitHub Issue #1816](https://github.com/usememos/memos/issues/1816). With the primary focus being on MySQL support, we also took a moment to highlight its advantages.

### Cloud Compatibility

The addition of MySQL support aligns with the evolving landscape of cloud computing and serverless architectures. MySQL offers seamless integration with cloud databases, allowing you to leverage the scalability and reliability of cloud infrastructure. This is especially beneficial if your application needs to operate in a serverless environment or if you require cloud-based data storage for better redundancy and accessibility.

### Improved Performance for Large Datasets

MySQL outperforms SQLite when it comes to handling large datasets and complex queries. If your application deals with substantial volumes of data or demands intricate database operations, MySQL might be the superior choice.

## The Key Differences

### Performance and Scalability

- SQLite: Suitable for lightweight applications and smaller datasets, but can struggle with larger volumes of data.
- MySQL: Well-suited for larger databases and applications with demanding performance requirements, particularly when hosted in the cloud.

### Cloud Integration

- SQLite: Not inherently designed for cloud environments but can be used with additional configurations.
- MySQL: Built for cloud compatibility, making it a seamless choice for cloud-based applications.

### Resource Requirements

- SQLite: Minimal resource usage, making it suitable for resource-constrained devices.
- MySQL: Requires more resources, ideal for applications with substantial computing power and memory available.

### Backup and Redundancy

- SQLite: Backup can be slower and may result in database fragmentation.
- MySQL: Offers robust backup solutions and better data redundancy.

## How to Choose

When deciding between MySQL and SQLite for memos, it's essential to consider your specific use case and existing infrastructure. Here's a tailored guideline to help you make the choice:

- If you have a clear understanding of the advantages MySQL can bring to your memos instance, and you already have the necessary cloud server resources, opting for MySQL is a viable choice.

- Furthermore, you can always use SQLite as your database.

---

## References

- [Using MySQL as the Database Driver](/docs/get-started/mysql)

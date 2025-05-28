---
title: Shortcuts
---

**Shortcuts** allow you to define reusable, powerful filters for querying memos using [CEL (Common Expression Language)](https://github.com/google/cel-spec) syntax. These filters enable you to create complex filtering logic that can be saved and reused, making it easy to find specific memos based on various attributes.

## How Shortcuts Work

When you create a shortcut with a filter expression, the system:

1. **Parses** your CEL expression using Google's CEL library
2. **Validates** the syntax and checks that all referenced fields are supported
3. **Compiles** the expression into an optimized format
4. **Translates** the CEL expression into efficient SQL queries when executed
5. **Returns** memos that match your filter criteria

This process ensures both flexibility and performance when filtering your memo collection.

## Supported Factors (Fields)

The following table shows all available fields you can filter on, along with their supported operators:

| **Factor**          | **Type** | **Supported Operators**          | **Description**                              |
| ------------------- | -------- | -------------------------------- | -------------------------------------------- |
| **`content`**       | `string` | `==`, `!=`, `contains`           | The text content of the memo                 |
| **`creator_id`**    | `int`    | `==`, `!=`                       | ID of the user who created the memo          |
| **`created_ts`**    | `int`    | `==`, `!=`, `<`, `>`, `<=`, `>=` | Creation timestamp (Unix timestamp)          |
| **`updated_ts`**    | `int`    | `==`, `!=`, `<`, `>`, `<=`, `>=` | Last update timestamp (Unix timestamp)       |
| **`pinned`**        | `bool`   | `==`, `!=`, standalone           | Whether the memo is pinned                   |
| **`tag`**           | `string` | `in`                             | Tags assigned to the memo                    |
| **`visibility`**    | `string` | `==`, `!=`, `in`                 | Visibility level (`PUBLIC`, `PRIVATE`, etc.) |
| **`has_task_list`** | `bool`   | `==`, `!=`, standalone           | Whether the memo contains a task list        |

## Special Functions

### `now()` Function

The system provides a special `now()` function that returns the current Unix timestamp. This is useful for time-based filtering:

```cel
created_ts > now() - 60 * 60 * 24  // Memos created in the last 24 hours
```

## Writing Filter Expressions

### Basic Syntax

CEL expressions use a familiar syntax similar to many programming languages:

- **Comparison**: `field operator value`
- **Logical AND**: `condition1 && condition2`
- **Logical OR**: `condition1 || condition2`
- **Negation**: `!condition`
- **Set membership**: `field in [value1, value2]`
- **String matching**: `field.contains("substring")`

### Real-World Examples

#### 1. Filter by User

```cel
creator_id == 101
```

Find all memos created by user with ID 101.

#### 2. Pinned Memos Only

```cel
pinned == true
```

or simply:

```cel
pinned
```

Show only pinned memos.

#### 3. Private Memos from Recent Period

```cel
visibility == "PRIVATE" && created_ts > now() - 60 * 60 * 24 * 7
```

Find private memos created in the last 7 days.

#### 4. Task Lists with Specific Tags

```cel
has_task_list && tag in ["work", "project"]
```

Find memos that contain task lists and are tagged with "work" or "project".

#### 5. Content Search with Visibility Filter

```cel
content.contains("meeting") && visibility in ["PUBLIC", "PRIVATE"]
```

Find memos containing "meeting" that are either public or private.

#### 6. Recent Updates Excluding Pinned

```cel
updated_ts > now() - 60 * 60 * 24 * 3 && !pinned
```

Find memos updated in the last 3 days that are not pinned.

#### 7. Complex Tag and Content Filtering

```cel
(tag in ["urgent", "important"] || content.contains("deadline")) && visibility == "PUBLIC"
```

Find public memos that either have urgent/important tags or mention deadlines.

#### 8. Date Range with Multiple Conditions

```cel
created_ts >= 1704067200 && created_ts <= 1735689599 && has_task_list == true
```

Find memos with task lists created in 2024 (using Unix timestamps).

#### 9. Excluding Specific Content

```cel
!content.contains("draft") && visibility != "PRIVATE"
```

Find non-private memos that don't contain the word "draft".

#### 10. Complex Multi-Factor Query

```cel
(creator_id == 101 || creator_id == 102) && tag in ["review", "feedback"] && created_ts > now() - 60 * 60 * 24 * 30
```

Find memos from specific users with review/feedback tags from the last 30 days.

## Advanced Usage

### Boolean Field Behavior

Boolean fields like `pinned` and `has_task_list` can be used in multiple ways:

- **Standalone**: `pinned` (checks if true)
- **Explicit comparison**: `pinned == true` or `pinned == false`
- **Negation**: `!pinned` (checks if false)

### Timestamp Handling

Timestamps are stored as Unix timestamps (seconds since epoch). You can:

- Use absolute timestamps: `created_ts > 1704067200`
- Use relative time with `now()`: `created_ts > now() - 86400`
- Combine for date ranges: `created_ts >= 1704067200 && created_ts <= 1735689599`

### Tag Filtering

Tags are stored as JSON arrays and support:

- **Multiple tag matching**: `tag in ["tag1", "tag2"]`
- **Combined tag conditions**: `tag in ["work"] || tag in ["personal"]`

Note: Tag filtering uses JSON pattern matching, so it will find memos containing any of the specified tags.

---
title: Shortcuts
---

**Shortcuts** allow you to define and apply filtering conditions for querying memos in a simple and flexible way. By using a shortcut, you can encapsulate complex filtering logic into a reusable query format. This is useful for quickly filtering memos based on common attributes like tags, visibility, creation date, and more.

In this document, we'll focus on **how to write the filter** and provide examples for different use cases.

## How to Write a Filter?

The `filter` field in a Shortcut is where you define the conditions that memos must meet to be selected. It uses the [CEL(Common Expression Language)](https://github.com/google/cel-spec) syntax to combine various operators and factors.

### Key Components of a Filter

1. **Factors**: These are the fields or attributes of a memo that you want to filter by.
2. **Operators**: These define how the filtering condition should be evaluated (e.g., equals, not equals, greater than).
3. **Logical Operators**: These allow you to combine multiple conditions together using logical AND, OR, or NOT.

### Factors and Supported Operators

#### Supported Factors

1. **`tag`**: A list of tags assigned to a memo (e.g., `tag in ["tag1", "tag2"]`).
2. **`visibility`**: The visibility of the memo (e.g., `visibility in ["PUBLIC"]`).
3. **`content`**: The content of the memo (e.g., `content.contains("memos")`).
4. **`create_time`**: The creation timestamp of the memo (e.g., `create_time == "2023-01-01T00:00:00Z"`).
5. **`update_time`**: The update timestamp of the memo (e.g., `update_time > "2023-01-01T00:00:00Z"`).

#### Supported Operators

1. **Comparison Operators**

   - `==`: Equal to (e.g., `create_time == "2023-01-01T00:00:00Z"`).
   - `!=`: Not equal to (e.g., `visibility != "PRIVATE"`).
   - `<`: Less than (e.g., `create_time < "2023-01-01T00:00:00Z"`).
   - `>`: Greater than (e.g., `update_time > "2023-01-01T00:00:00Z"`).
   - `<=`: Less than or equal to (e.g., `create_time <= "2023-01-01T00:00:00Z"`).
   - `>=`: Greater than or equal to (e.g., `update_time >= "2023-01-01T00:00:00Z"`).

2. **Set Operators**

   - `in`: Used to check if a value is part of a set (e.g., `tag in ["tag1", "tag2"]`).

3. **String Operators**

   - `contains`: Used to check if a string contains a given substring (e.g., `content.contains("memos")`).

4. **Logical Operators**
   - `&&`: Logical AND, used to combine multiple conditions (e.g., `tag in ["tag1", "tag2"] && visibility == "PUBLIC"`).
   - `||`: Logical OR, used to combine multiple conditions where any condition being true will satisfy the query (e.g., `tag in ["tag1", "tag2"] || visibility == "PRIVATE"`).
   - `!`: Logical NOT, used to negate a condition (e.g., `!content.contains("memos")`).

### Writing Filters

Here are some examples to demonstrate how to write filters using different operators and conditions:

#### 1. Simple Filter by Tag

This filter selects memos that have the tag `tag1` or `tag2`.

```cel
tag in ["tag1", "tag2"]
```

#### 2. Filter by Tag and Visibility

This filter selects memos that have the tag `tag1` or `tag2` **and** have visibility set to `PUBLIC`.

```cel
tag in ["tag1", "tag2"] && visibility == "PUBLIC"
```

#### 3. Filter by Multiple Tags with OR Condition

This filter selects memos that have either `tag1`, `tag2`, `tag3`, or `tag4`.

```cel
tag in ["tag1", "tag2"] || tag in ["tag3", "tag4"]
```

#### 4. Combining AND and OR for Complex Conditions

This filter selects memos that:

- Have either `tag1` or `tag2`.
- **And** have a creation time before `2023-01-01`.
- **Or** have a visibility of `PRIVATE`.

```cel
(tag in ["tag1", "tag2"] && create_time < "2023-01-01T00:00:00Z") || visibility == "PRIVATE"
```

#### 5. Filter by Date Range

This filter selects memos that were created **after** `2023-01-01` and **before** `2023-12-31`.

```cel
create_time > "2023-01-01T00:00:00Z" && create_time < "2023-12-31T23:59:59Z"
```

#### 6. Filter by Content and Tags with NOT

This filter selects memos that **do not** contain the word `memos` in their content **and** have a visibility of `PUBLIC`.

```cel
!content.contains("memos") && visibility == "PUBLIC"
```

#### 7. Filter Using Multiple Logical Operators

This filter selects memos that:

- Have either `tag1` or `tag2` as their tag.
- **And** have a creation time before `2023-01-01`.
- **And** their content contains the word `memos`.

```cel
(tag in ["tag1", "tag2"] && create_time < "2023-01-01T00:00:00Z") && content.contains("memos")
```

#### 8. Filter with Time Comparisons

This filter selects memos that:

- Have been **updated** after `2023-01-01`.
- **Or** were **created** before `2023-01-01`.

```cel
update_time > "2023-01-01T00:00:00Z" || create_time < "2023-01-01T00:00:00Z"
```

#### 9. Filter by Tags and Visibility (Multiple Tags)

This filter selects memos that have any of the tags `tag1`, `tag2`, or `tag3`, and have visibility set to either `PUBLIC` or `PRIVATE`.

```cel
tag in ["tag1", "tag2", "tag3"] && visibility in ["PUBLIC", "PRIVATE"]
```

### Summary of Filter Syntax

1. **Comparison**: `field operator value` (e.g., `create_time == "2023-01-01T00:00:00Z"`).
2. **Logical AND**: `condition1 && condition2` (e.g., `tag in ["tag1", "tag2"] && visibility == "PUBLIC"`).
3. **Logical OR**: `condition1 || condition2` (e.g., `tag in ["tag1", "tag2"] || visibility == "PRIVATE"`).
4. **Negation**: `!condition` (e.g., `!content.contains("memos")`).
5. **In Sets**: `field in [value1, value2]` (e.g., `tag in ["tag1", "tag2"]`).
6. **String Matching**: `field.contains("substring")` (e.g., `content.contains("memos")`).

### Conclusion

The **filter** field in a Shortcut allows you to define flexible and powerful conditions to query your memos. By combining factors, operators, and logical expressions, you can craft complex filters that precisely meet your needs. Use logical operators like `&&`, `||`, and `!` to build compound conditions, and take advantage of comparison, set, and string operators for fine-grained filtering.

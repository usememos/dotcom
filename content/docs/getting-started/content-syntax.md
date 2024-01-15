---
title: Content Syntax
---

Memos primarily focuses on plain text recording, but also supports some commonly used Markdown syntax. Here is a list of supported syntax:

## Headings

| Markdown           | Rendered           |
| ------------------ | ------------------ |
| `# Heading 1`      | <h1>Heading 1</h1> |
| `## Heading 2`     | <h2>Heading 2</h2> |
| `### Heading 3`    | <h3>Heading 3</h3> |
| `#### Heading 4`   | <h4>Heading 4</h4> |
| `##### Heading 5`  | <h5>Heading 5</h5> |
| `###### Heading 6` | <h6>Heading 6</h6> |

## Emphasis

| Markdown            | Rendered          |
| ------------------- | ----------------- |
| `*Italic*`          | _Italic_          |
| `**Bold**`          | **Bold**          |
| `~~Strikethrough~~` | ~~Strikethrough~~ |

## Lists

### Unordered

Markdown:

```markdown
- Item 1
- Item 2
  - Item 2.1
  - Item 2.2
```

Rendered:

- Item 1
- Item 2
  - Item 2.1
  - Item 2.2

### Ordered

Markdown:

```markdown
1. Item 1
2. Item 2
   1. Item 2.1
   2. Item 2.2
```

Rendered:

1. Item 1
2. Item 2
   1. Item 2.1
   2. Item 2.2

## Links

| Markdown                        | Rendered                      |
| ------------------------------- | ----------------------------- |
| `[Memos](https://usememos.com)` | [Memos](https://usememos.com) |
| `<https://usememos.com>`        | <https://usememos.com>        |
| `https://usememos.com`          | https://usememos.com          |

## Images

| Markdown                                                     | Rendered                                                   |
| ------------------------------------------------------------ | ---------------------------------------------------------- |
| `![Memos](https://www.usememos.com/full-logo-landscape.png)` | ![Memos](https://www.usememos.com/full-logo-landscape.png) |

## Code

### Inline

| Markdown                          | Rendered                    |
| --------------------------------- | --------------------------- |
| `` `const x = 1` ``               | `const x = 1`               |
| `` `const x = 1, y = 2, z = 3` `` | `const x = 1, y = 2, z = 3` |

### Block

Markdown:

    ```javascript
    const x = 1;
    const y = 2;
    const z = 3;
    ```

Rendered:

```javascript
const x = 1;
const y = 2;
const z = 3;
```

## Blockquotes

| Markdown       | Rendered                            |
| -------------- | ----------------------------------- |
| `> Blockquote` | <blockquote>Blockquote</blockquote> |

## Tags

| Markdown | Rendered |
| -------- | -------- |
| `#tag`   | #tag     |

## LaTeX

### Inline

| Markdown | Rendered |
| -------- | -------- |
| `$x^2$`  | $x^2$    |

### Block

Markdown:

    ```latex
    $$
    x^2 + y^2 = z^2
    $$
    ```

Rendered:

$$
x^2 + y^2 = z^2
$$

## Highlight

| Markdown   | Rendered |
| ---------- | -------- |
| `==text==` | ==text== |

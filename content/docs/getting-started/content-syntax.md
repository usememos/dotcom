---
title: Content Syntax
---

Memos primarily focuses on plain text recording, but also supports some commonly used Markdown syntax. Here is a list of supported content syntax:

## Basic Syntax

### Headings

To create a heading, add number signs (#) in front of a word or phrase. The number of number signs you use should correspond to the heading level. For example, to create a heading level three (<h3>), use three number signs (e.g., ### My Header).

| Syntax             | Rendered           |
| ------------------ | ------------------ |
| `# Heading 1`      | <h1>Heading 1</h1> |
| `## Heading 2`     | <h2>Heading 2</h2> |
| `### Heading 3`    | <h3>Heading 3</h3> |
| `#### Heading 4`   | <h4>Heading 4</h4> |
| `##### Heading 5`  | <h5>Heading 5</h5> |
| `###### Heading 6` | <h6>Heading 6</h6> |

### Lists

Lists are used to display a list of related items. Memos supports ordered (numbered) and unordered (bulleted) lists.

#### Unordered

Unordered lists use asterisks (`*`), pluses (`+`), and hyphens (`-`) — interchangeably — as list markers.

```markdown
- Item 1
- Item 2
  - Item 2.1
  - Item 2.2
```

#### Ordered

Ordered lists use numbers followed by periods. The numbers themselves should not matter. You can use 1. and 2. and 3. or 1) and 2) and 3) or any other combination you like, but the list will start at 1. and count up from there regardless of what numbers you use.

```markdown
1. Item 1
2. Item 2
   1. Item 2.1
   2. Item 2.2
```

## Emphasis

Emphasis is used to highlight text. Memos supports italic, bold, and strikethrough.

| Syntax              | Rendered          |
| ------------------- | ----------------- |
| `*Italic*`          | _Italic_          |
| `**Bold**`          | **Bold**          |
| `~~Strikethrough~~` | ~~Strikethrough~~ |

### Links

Links syntax is a pair of square brackets (`[]`) followed by a pair of parentheses (`()`). The text in the square brackets will be the link text, and the text in the parentheses will be the link address. Or you can use the `<` and `>` characters to wrap the link address.

```markdown
- `[Memos](https://usememos.com)`
- `<https://usememos.com>`
```

### Images

Images syntax is similar to links syntax, but with a `!` character in front of the link syntax.

```markdown
![Memos](https://www.usememos.com/full-logo-landscape.png)
```

### Code

Code is a common element in technical content. Memos supports inline and block code.

#### Inline

Inline code is wrapped in backticks (`). Its syntax is for example `const x = 1`.

#### Block

Block code is wrapped in triple backticks (```). Its syntax is for example:

````markdown
```javascript
const x = 1;
const y = 2;
const z = 3;
```
````

#### Rendering custom html

In rare cases, you might want to render custom HTML in your memos. To do this, use `__html` as langauge for block.

Example shows how to render horizontal divider in your memos.

````markdown
```__html
</hr>
```
````

### Blockquotes

Blockquotes are used to indicate the quotation of a large section of text from another source. You can use the `>` character to create a blockquote.

```markdown
> Blockquote
```

### LaTeX

Memos supports LaTeX syntax. You can use LaTeX syntax to write math formulas. Including inline and block.

#### Inline

Inline LaTeX syntax is wrapped in `$` symbols. Its syntax is for example `$x^2 + y^2 = z^2$`.

#### Block

Block LaTeX syntax is wrapped in `$$` symbols.

Syntax:

```latex
$$
x^2 + y^2 = z^2
$$
```

## Extended Syntax

### Tables

To add a table, use three or more hyphens (---) to create each column’s header, and use pipes (|) to separate each column. For compatibility, you should also add a pipe on either end of the row.

```markdown
| Syntax    | Description |
| --------- | ----------- |
| Header    | Title       |
| Paragraph | Text        |
```

### Task Lists

Task lists (also referred to as checklists and todo lists) allow you to create a list of items with checkboxes. In Markdown applications that support task lists, checkboxes will be displayed next to the content. To create a task list, add dashes (`-`) and brackets with a space (`[ ]`) in front of task list items. To select a checkbox, add an x in between the brackets (`[x]`).

Syntax:

```markdown
- [x] Item 1
- [ ] Item 2
  - [ ] Item 2.1
  - [x] Item 2.2
```

### Highlight

Syntax:

`==text==`

### Subscript

This isn’t common, but some Markdown processors allow you to use subscript to position one or more characters slightly below the normal line of type. To create a subscript, use one tilde symbol (~) before and after the characters. e.g. `H~2~O`

### Superscript

This isn’t common, but some Markdown processors allow you to use superscript to position one or more characters slightly above the normal line of type. To create a superscript, use one caret symbol (^) before and after the characters. e.g. `2^10^`

### Automatic URL Linking

Automatic URL linking will automatically turn a URL into a link. That means if you type https://www.usememos.com, it will automatically be turned into a link.

### Embedded Content

Memos supports embedding content from other memo. You can embed a memo by using the following syntax:

```markdown
![[memos/memoid]]
```

Then the memo will be embedded in your current memo.

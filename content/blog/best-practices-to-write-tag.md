---
title: Best practices to write a TAG
author: Steven
published_at: 2022/8/1 10:00:00
---

In memos, the tag is written in the content and displayed by a regex parser. If you have some misrecognized tags, you need a good way to manage your tags accurately, especially where they are written.

## Best practices

Put tags always in the first or last line of content.

```markdown
#Mark #Website
The place for anyone from anywhere to build anything
Whether you’re scaling your startup or just learning how to code, GitHub is your home.
Join the world’s largest developer platform to build the innovations that empower humanity.
Let’s build from here.
```

```markdown
GitHub Copilot is your AI pair programmer that empowers you to complete tasks 55% faster by turning natural language prompts into coding
suggestions.
#Mark #Utils
```

## Not a good practice

DO NOT add tags in the middle of the content. For example, in the GitHub markdown codeblock, the tag syntax will not be recognized.

```markdown
GitHub Actions automates your build, test, and deployment workflow with simple and secure CI/CD. #Mark
```

```markdown
GitHub Mobile fits your projects in your pocket, #Mark
so you never miss a beat while on the go.
```

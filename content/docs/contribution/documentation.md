---
title: Contribute to documentation
author: Anthony
---

This document explains how you can contribute to the documentation of memos.

Here is the [repository](https://github.com/usememos/dotcom) you want to go to.

## Prerequisite

### Must have

- Preferably a markdown editor, Here's a few: [Visual studio code](https://code.visualstudio.com/), [Typora](https://typora.io/). (If not, any text editor is fine)
- [Git](https://git-scm.com/downloads)
- [Know how to contribute](https://docs.github.com/en/get-started/quickstart/contributing-to-projects)

### Good to have

- [Node.js & npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)

## Step by step

1. Clone your forked repo:
   ```bash
   git clone https://github.com/<You username>/dotcom
   ```
2. Change to the directory:

   ```bash
   cd dotcom
   ```

   If you want to see you new docs live on your localhost:

   1. Install dependencies:
      ```bash
      npm install
      ```
   2. Start the development server:

      ```bash
      npm run dev
      ```

   Now, the website should be running at http://localhost:3000. It will support live reload upon code changes.

3. Go to `consts` folder and open up `author.ts`.
4. Add you name and links under the `const authorList: Author[]` section in the following format:

   ```typescript
   {
       name: "Your name",
       email: "Your email", //optional
       url: "Your website link", //optional
       github: "Your github usename", //optional
       twitter: "Your twitter handle", //optional
       funding: "Your funding link", //optional
   },
   ```

5. Go to `content/docs/` and open up `index.md`.
6. Add the name and link of you document in the desired section.

   **Note**: If it's a single document with no relation to existing section, add it to the `Others` section. If it's a serveral document requiring a new section, create a new section using the markdown's headings 2.

7. Create corresponding markdown files under the `content` folder in the corresponding location.

   **Note**: If it's a whole new section you are adding:

   1. Create the corresonding folder under `content`
   2. Add a `index.md` file inside you newly created folder
   3. Copy what you added in step 6. to the index.md
   4. Replace the title in `##` with:

      ```yaml
          ---
          title: <Your title>
          ---
      ```

8. Add this on top you makrdown file, change the variables accordingly:

   ```yaml
       ---
       title: <Your title>
       author: <You name(the one you just put in author.ts)>
       ---
   ```

9. Enjoy writing you documentation!

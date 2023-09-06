---
title: 🤖️ Telegram Bot
author: Athurg
---

## Prerequisite

- Follow the [How Do I Create a Bot](https://core.telegram.org/bots#how-do-i-create-a-bot) to create a **Telegram Bot**.
- Get your **bot token** with [Obtain Your Bot Token](https://core.telegram.org/bots/tutorial#obtain-your-bot-token).

Your **bot token** should looks like:

```plaintext
4839574812:AAFD39kkdpWt3ywyRZergyOLMaJhac60qc
```

## Connect your memos to Telegram Bot

Once you have prepared your bot, you can now connect memos to your bot.

1. Sign in to your memos using the **admin account**.
2. Click the **Settings** button on the sidebar to open **Settings** dialog.
3. Switch to **System** tab in the **Admin** section.
4. Copy and paste your **bot token** into **Telegram Token** field, then click **Save**.

Now, the Telegram bot is connected to your memos.

## Bind memos user to Telegram user

After connecting your Telegram bot to memos, you can send messages to the bot.

You will receive a message like this:

![user-id-message](/content/docs/integration/telegram-bot/user-id-message.png)

The message contains your **user ID** in Telegram. Make sure to copy it.

Follow these steps to set it as your memos user:

1. Sign in to your memos.
2. Click on **Settings** button on the sidebar to open **Settings** dialog.
3. Switch to **Preferences** tab in **Basic** section.
4. Paste your **userid** into **Telegram UserID** field, then click **Save**.

You can now send messages to the Telegram bot, and they will be saved in your memos!

![message-saved](/content/docs/integration/telegram-bot/message-saved.png)

We currently support two types of messages from the Telegram bot:

- **Text message**: The message will be the content of memo, and Markdown format is supported.

- **Photo message**: The photo will be saved as resources into memo. And the caption of photo will be content of memo.

## Use a Proxy for Telegram API?

*Memos* support connect to Telegram API with a proxy.

Assuming you have a proxy server running on `PROXY_URL`, you should setup it to make sure:

- Any request on `PROXY_URL/bot<token>` forward to `https://api.telegram.org/bot<token>`
- Any request on `PROXY_URL/file/bot<token>` forward to `https://api.telegram.org/file/bot<token>`

You can also just forward all request to `PROXY_URL` directly to `https://api.telegram.org` to make it simple.

If that's OK, just config the **bot token** of your *Memos* like below:

   http://proxy.test.com:8081/somepath/bot<token>

Replace `<token>` with the original **bot token** from Telegram's @BotFather.

## Can I Use Webhook instead of API Proxy ?

**NO**.

In addition to receiving updates from Telegram, many features require visit Telegram's API directly, such as downloading images and sending replies. Therefore, the environment in which Memos running on must be able to **Directly** access Telegram. If for some special reasons it is not possible to access it directly, then a Proxy API is a necessity. On this basis, providing additional support for Webhooks is not too necessary, at least it doesn't have much significance in terms of resolving the accessibility of Telegram.

## What's next?

The Telegram bot is a powerful tool, and we have only implemented a few features so far. We plan to add more features in the future, including:

- Commands for the Telegram bot to perform special actions.
- Sending notifications through the Telegram bot.
- And more...

We welcome any pull requests. Enjoy using memos!

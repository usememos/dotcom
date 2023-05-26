---
title: 🤖️ Telegram Bot
author: Athurg
---

You can now send `memos` from your telegram bot 🎉🎉🎉

## Before all

Fistly, make sure you known what is [Telegram Bot](https://core.telegram.org/bots).

If you don't, maybe this feature is not satisfied with you.

In this document, we assume that you have created a _Telegram Bot_.
And got a _bot token_ from Telegram's [@Botfather](https://t.me/botfather).

## Connect your Memos to Telegram Bot

After you prepare your bot, let's start by connect _Memos_ to your Bot.

1. Sign in you _Memos_ as admin.
2. Click on _Settings_ button on the sidebar, to open _Settings_ dialog.
3. Switch to _System_ tab of _Admin_ section.
4. Paste your _bot token_ into _Telegram Robot Token_ field, _Save_ it.

Now, _Memos_ have been connect to your _Telegram Bot_ now.

## Bind Memos user to Telegram user

After config your Telegram bot token, you can now send message to your Telegram Bot.

But you will always get a message like:

Please set your telegram userid 2037020633 in UserSetting of _Memos_

That means _Memos_ do not know who you are, so it don't know to create _memo_ for which user.

So, just tell it in steps:

1. _Sign in_ you _Memos_ as any user.
2. Click on _Settings_ button on the sidebar, to open _Settings_ dialog.
3. Switch to _Preferences_ tab of _Basic_ section.
4. Paste your _userid_ shown to you into _Telegram UserID_ field, and _Save_ it.

That's it, everything is ready now.

You can send message to Telegram Bot, and _Memos_ will save it as a new _memo_

## About text and photo(s)

Currently, two types of Telegram message were support:

### text message

The _text_ of message will be _content_ of _memo_, Markdown format is OK.

### photo message

The _caption_ of message will be _content_ of memo, also Markdown is support.

The photo will be resource of this memo, even there is more than one photos.

## What about next ?

We may add more feature in the future, such as:

- _command_ of Telegram Bot to do something
- More message type, such as attachments? and Group Message
- Webhook for Telegram Bot, for _Memos_ which can't touch the Telegram API Server directly.
- Send notification by Telegram Bot
- And more...

Any PR will be welcome, just enjoy _Memos_ !

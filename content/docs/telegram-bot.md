---
title: Telegram Bot
author: Athurg
---

You can now send `memos` from your telegram bot 🎉🎉🎉

## Before all

Fistly, make sure you known what is [Telegram Bot](https://core.telegram.org/bots).

If you don't, maybe this feature is not satisfied with you.

In this document, we assume that you have created a *Telegram Bot*.
And got a *bot token* from Telegram's [@Botfather](https://t.me/botfather).

## Connect your Memos to Telegram Bot

After you prepare your bot, let's start by connect *Memos* to your Bot.

1. Sign in you *Memos* as admin.
2. Click on *Settings* button on the sidebar, to open *Settings* dialog.
3. Switch to *System* tab of *Admin* section.
4. Paste your *bot token* into *Telegram Robot Token* field, *Save* it.

Now, *Memos* have been connect to your *Telegram Bot* now.

## Bind Memos user to Telegram user

After config your Telegram bot token, you can now send message to your Telegram Bot.

But you will always get a message like:

   Please set your telegram userid 2037020633 in UserSetting of *Memos*

That means *Memos* do not know who you are, so it don't know to create *memo* for which user.

So, just tell it in steps:

1. *Sign in* you *Memos* as any user.
2. Click on *Settings* button on the sidebar, to open *Settings* dialog.
3. Switch to *Preferences* tab of *Basic* section.
4. Paste your *userid* shown to you into *Telegram UserID* field, and *Save* it.

That's it, everything is ready now.

You can send message to Telegram Bot, and *Memos* will save it as a new *memo*

## About text and photo(s)

Currently, two types of Telegram message were support:

### text message

The *text* of message will be *content* of *memo*, Markdown format is OK.

### photo message

The *caption* of message will be *content* of memo, also Markdown is support.

The photo will be resource of this memo, even there is more than one photos.

## What about next ?

We may add more feature in the future, such as:

- *command* of Telegram Bot to do something
- More message type, such as attachments? and Group Message
- Webhook for Telegram Bot, for *Memos* which can't touch the Telegram API Server directly.
- Send notification by Telegram Bot
- And more...

Any PR will be welcome, just enjoy *Memos* !

---
title: Webhook
---

**Webhooks** let you subscribe to events happening in a software system and automatically receive a delivery of data to your server whenever those events occur. Webhooks provide a way for notifications to be delivered to an external web server whenever certain events occur on Memos.

## Using Webhooks

Webhooks are utilized to dispatch events related to **memo creation** and **update**.

![webhook-setting-section](/content/docs/advanced-settings/webhook/webhook-setting-section.png)

When you create a webhook, you should specify a URL. When an event that your webhook is subscribed to occurs, Memos will send an HTTP request with data about the event to the URL that you specified. If your server is set up to listen for webhook deliveries at that URL, it can take action when it receives one.

The data sent in the webhook includes information about the memo and its associated resources and relations. Its structure is as follows:

- `creatorId`: Identifier of the memo creator.
- `createdTs`: Timestamp of when the webhook payload is created.
- `memo`: Details about the memo, including its ID, timestamps, content, visibility, associated resources and relations.

Once your server is configured to receive payloads, it will listen for any delivery that's sent to the endpoint you configured. To ensure that your server only processes webhook deliveries that were sent by GitHub and to ensure that the delivery was not tampered with, you should validate the webhook signature before processing the delivery further.

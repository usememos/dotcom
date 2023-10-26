---
title: Syncing Data Across My MacBooks with iCloud
author: Steven
description: In all honesty, I don't have a suitable cloud service for deploying memos, but I do have two trusty MacBooks - a MacBook Air in home and a MacBook Pro in company. But how to keep data in sync between them?
published_at: 2023/10/26 21:19:00
feature_image: /content/blog/syncing-data-with-icloud/banner.png
---

In all honesty, I don't have a suitable cloud service for deploying memos, but I do have two trusty MacBooks - a MacBook Air in home and a MacBook Pro in company. Each served its unique role, but the problem was keeping data in sync between them.

The solution began with the realization that the memos' startup command could hold the key. The recommand command looked like this:

```shell
docker run -d --name memos -p 5230:5230 -v ~/.memos/:/var/opt/memos ghcr.io/usememos/memos:latest
```

I had an idea - what if I replaced `~/.memos` with a folder in iCloud? This simple change held the promise of realizing multi-device data sharing, and potentially, it meant I could set up a memos instance on my work MacBook Pro without relying on external cloud servers. It was a challenge worth taking, so let's explore how I embarked on this endeavor.

## The Experiment

### Step 1: Creating an iCloud Shared Folder

The journey started with a visit to my MacBook Air, where I aimed to create a shared space in iCloud that both my MacBooks could access. Here's how I did it:

1. I opened Finder and ventured into iCloud Drive.

2. A right-click later, I had a brand new folder in iCloud, aptly named `memos` in **Documents**.

3. Then came the sharing. A few more clicks, and I'd selected my work email to share the folder with, granting my MacBook Pro access.

![finder](/content/blog/syncing-data-with-icloud/finder.png)

### Step 2: Docker Configuration

With the iCloud folder in place, I was eager to make use of it in my memos setup. Here's where Docker came into play:

```shell
docker run -d --name memos -p 5230:5230 -v ~/Documents/memos/:/var/opt/memos ghcr.io/usememos/memos:latest
```

With this new configuration, I replaced `~/.memos` in the Docker command with the path to the `~/Documents/memos/` folder I created in iCloud Drive. This change meant that memos would now read and write data directly from iCloud, making it accessible from both my MacBook Air and MacBook Pro.

### Step 3: Sync in Action

This creative twist set the stage for the grand experiment. Memos, now configured on my MacBook Air, began to sync data directly to the iCloud shared folder. The result? I could access these same notes seamlessly from my MacBook Pro at work, achieving the multi-device data sharing I had envisioned.

## The Benefits and Considerations

- **Seamless Transition**: This setup enabled me to switch effortlessly between personal and professional tasks without interruption, with all my notes at my fingertips.

- **No Cloud Servers Required**: I accomplished this without the need for an external cloud server, with iCloud taking care of all synchronization tasks.

- **Data Privacy**: My data's privacy and security remained under my control, using my own iCloud account.

- **Space Management**: Monitoring my iCloud storage space ensured it could comfortably handle my growing memos database.

In summary, using iCloud to share memos data between my MacBook Air and MacBook Pro, complemented by creative Docker modifications, has been transformative. It's a straightforward and efficient solution that seamlessly integrates both personal and professional note-taking needs. Now, my notes are always just a click away, and there's no need for a dedicated cloud server for my memos database.

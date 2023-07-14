---
title: Managed Hosting
---

The below services can be used to host memos, if you don't administer your own server.

- [Render.com](#rendercom)
- [Fly.io](#flyio)
  - [Prerequisites](#prerequisites)
  - [Install flyctl](#install-flyctl)
  - [Launch a fly application](#launch-a-fly-application)
  - [Edit your `fly.toml`](#edit-your-flytoml)
    - [Details of manual modifications](#details-of-manual-modifications)
      - [1. Add a `build` section.](#1-add-a-build-section)
      - [2. Add an `env` section.](#2-add-an-env-section)
      - [3. Configure litestream backups](#3-configure-litestream-backups)
      - [4. Add a persistent volume](#4-add-a-persistent-volume)
      - [5. Change `internal_port` in `[[services]]`](#5-change-internal_port-in-services)
      - [6. Deploy to fly.io](#6-deploy-to-flyio)
- [PikaPods.com](#pikapodscom)
- [Zeabur](#zeabur)
  - [Prerequisites](#prerequisites-1)
  - [Method1: Deploy from template(Recommend)](#method1-deploy-from-templaterecommend)
  - [Method2: Deploy from marketplace](#method2-deploy-from-marketplace)
  - [Method3: Deploy from source code](#method3-deploy-from-source-code)

## Render.com

Create an account at [Render](https://dashboard.render.com/register)
![ss1](https://i.imgur.com/l3K7aqC.png)

1. Go to your dashboard

[https://dashboard.render.com/](https://dashboard.render.com/)

2. Select New Web Service

   ![ss2](https://i.imgur.com/IIDdK2y.png)

3. Scroll down to "Public Git repository"

4. Paste in the link for the public git repository for memos [https://github.com/usememos/memos](https://github.com/usememos/memos) and press continue

   ![ss3](https://i.imgur.com/OXoCWoJ.png)

5. Render will pre-fill most of the fields but you will need to create a unique name for your web service

6. Adjust region if you want to

7. Don't touch the "branch", "root directory", and "environment" fields

   ![ss4](https://i.imgur.com/v7Sw3fp.png)

8. Click "enter your payment information" and do so

   ![ss5](https://i.imgur.com/paKcQFl.png)

   ![ss6](https://i.imgur.com/JdcO1HC.png)

9. Select the starter plan ($7 a month - a requirement for persistant data - render's free instances spin down when inactive and lose all data)

10. Click "Create Web Service"

![ss7](https://i.imgur.com/MHe45J4.png)

11. Wait patiently while the _magic_ happens 🤷‍♂️

![ss8](https://i.imgur.com/h1PXHHJ.png)

12. After some time (~ 6 min for me) the build will finish and you will see the web service is live

![ss9](https://i.imgur.com/msapkRw.png)

13. Now it's time to add the disk so your data won't dissappear when the webservice redeploys (redeploys happen automatically when the public repo is updated)

14. Select the "Disks" tab on the left menu and then click "Add Disk"

![ss10](https://i.imgur.com/rGeI0bv.png)

15. Name your disk (can be whatever)

16. Set the "Mount Path" to `/var/opt/memos`

17. Set the disk size (default is 10GB but 1GB is plenty and can be increased at any time)

18. Click "Save"

    ![ss11](https://i.imgur.com/Jbg7O6q.png)

19. Wait...again...while the webservice redeploys with the persistant disk

    ![ss12](https://i.imgur.com/pTzpE34.png)

20. aaaand....we're back online!

    ![ss13](https://i.imgur.com/qdsFfSa.png)

21. Time to test! We're going to make sure everything is working correctly.

22. Click the link in the top left, it should look like `https://the-name-you-chose.onrender.com` - this is your self hosted memos link!

    ![ss14](https://i.imgur.com/cgzFSIn.png)

23. Create a Username and Password (remember these) then click "Sign up as Host"

    ![ss15](https://i.imgur.com/kuRStAj.png)

24. Create a test memo then click save

    ![ss16](https://i.imgur.com/Eh2AB44.png)

25. Sign out of your self-hosted memos

    ![ss17](https://i.imgur.com/0mMb88G.png)

26. Return to your Render dashboard, click the "Manual Deploy" dropdown button and click "Deploy latest commit" and wait until the webservice is live again (This is to test that your data is persistant)

    ![ss18](https://i.imgur.com/w1N7VTb.png)

27. Once the webservice is live go back to your self-hosted memos page and sign in! (If your memos screen looks different then something went wrong)

28. Once you're logged in, verify your test memo is still there after the redeploy

    ![ss19](https://i.imgur.com/dTcEQZS.png)

    ![ss20](https://i.imgur.com/VE2lu8H.png)

## Fly.io

_provided by [@hu3rror/memos-on-fly](https://github.com/hu3rror/memos-on-fly) on GitHub_

### Prerequisites

- [fly.io](https://fly.io/) account
- [backblaze](https://www.backblaze.com/) account or other B2 service account
- [Optional] _If you want to build your own docker image, clone repository from [hu3rror/memos-on-fly-build](https://github.com/hu3rror/memos-on-fly-build)._

### Install flyctl

1. Follow [the instructions](https://fly.io/docs/getting-started/installing-flyctl/) to install fly's command-line interface `flyctl`.
2. [log into flyctl](https://fly.io/docs/getting-started/log-in-to-fly/).

```sh
flyctl auth login
```

### Launch a fly application

> **do not** setup Postgres and **do not** deploy yet!

```sh
flyctl launch
```

This command creates a `fly.toml` file.

### Edit your `fly.toml`

You can take [fly.example.toml](https://github.com/hu3rror/memos-on-fly/blob/main/fly.example.toml) in this repository as a reference and modify according to the comments.

#### Details of manual modifications

##### 1. Add a `build` section.

```toml
[build]
  image = "ghcr.io/hu3rror/memos-litestream:latest"
```

##### 2. Add an `env` section.

```toml
[env]
  DB_PATH = "/var/opt/memos/memos_prod.db"  # do not change
  LITESTREAM_REPLICA_BUCKET = "<filled_later>"  # change to your litestream bucket name
  LITESTREAM_REPLICA_ENDPOINT = "<filled_later>"  # change to your litestream endpoint url
  LITESTREAM_REPLICA_PATH = "memos_prod.db"  # keep the default or change to whatever path you want
```

##### 3. Configure litestream backups

> ℹ️ If you want to use another storage provider, check litestream's ["Replica Guides"](https://litestream.io/guides/) section and adjust the config as needed.

1. Log into B2 and [create a bucket](https://litestream.io/guides/backblaze/#create-a-bucket). Instead of adjusting the litestream config directly, we will add storage configuration to `fly.toml`.
2. Now you can set the values of `LITESTREAM_REPLICA_ENDPOINT` and `LITESTREAM_REPLICA_BUCKET` to your `[env]` section.
3. Then, create [an access key](https://litestream.io/guides/backblaze/#create-a-user) for this bucket. Add the key to fly's secret store (Don't add `<` and `>`).
   ```sh
   flyctl secrets set LITESTREAM_ACCESS_KEY_ID="<keyId>" LITESTREAM_SECRET_ACCESS_KEY="<applicationKey>"
   ```

##### 4. Add a persistent volume

1. Create a [persistent volume](https://fly.io/docs/reference/volumes/). Fly's free tier includes `3GB` of storage across your VMs. Since `memos` is very light on storage, a `1GB` volume will be more than enough for most use cases. It's possible to change volume size later. A how-to can be found in the _"scale persistent volume"_ section below.

   ```sh
   flyctl volumes create memos_data --region <your_region> --size <size_in_gb>
   ```

   For example:

   ```sh
   flyctl volumes create memos_data --region hkg --size 1
   ```

2. Attach the persistent volume to the container by adding a `mounts` section to `fly.toml`.
   ```toml
   [[mounts]]
      source = "memos_data"
      destination = "/var/opt/memos"
      processes = ["app"]
   ```

##### 5. Change `internal_port` in `[[services]]`

```toml
[[services]]
  internal_port = 5230
```

##### 6. Deploy to fly.io

```sh
flyctl deploy
```

If all is well, you can now access memos by running `flyctl open`. You should see its login page.

If the latest docker image has been released, you can easily upgrade the memo by typing `flyctl deploy` in your memos project's folder.

## PikaPods.com

Privacy-focused one-click hosting for open source apps. EU and US regions available. Run memos from $1/month with $5 free welcome credit.

[![Run on PikaPods](https://www.pikapods.com/static/run-button.svg)](https://www.pikapods.com/pods?run=memos)

## Zeabur

### Prerequisites

Create an account on [Zeabur](https://zeabur.com)
  ![ss21](https://imgur.com/q0RstqI.png)

### Method1: Deploy from template(Recommend)
1. Press on the button below to deploy memos from template.
[![Deploy on Zeabur](https://zeabur.com/button.svg)](https://dash.zeabur.com/templates/LPCVAH)
2. After the deployment is complete, go to the "Domain" section in service page to bind a domain for your memos.
   ![s22](https://i.imgur.com/6IXJuik.png)  

### Method2: Deploy from marketplace

1. Create a project
   1. Go to [Zeabur dashboard](https://dash.zeabur.com), click on "Create project" button to create a new project.
2. Create Memos from marketplace
   1. Click on "Add new service" button, select "Deploy from Marketplace", and find memos to deploy.
   ![s23](https://i.imgur.com/nQ6aPGZ.png) 
   2. After the deployment is complete, go to the "Domain" section in service page to bind a domain for your memos.
   ![s24](https://i.imgur.com/6IXJuik.png) 

### Method3: Deploy from source code

1. Fork Memos
   1. Fork Memos to your GitHub account.
2. Create a project
   1. Go to [Zeabur dashboard](https://dash.zeabur.com), click on "Create project" button to create a new project.
3. Create Memos from marketplace
   1. Click on "Add new service" button, select "Deploy from GitHub". If it's your first time using Zeabur, you may need click on the "Configure GitHub" button to install Zeabur on your GitHub account.
   ![s25](https://i.imgur.com/NRd8yxu.png)
   2. Search the repo you forked and select it to start deploy.
   3. After the deployment is complete, go to the "Domain" section in service page to bind a domain for your memos.
   ![s26](https://i.imgur.com/6IXJuik.png)  
     


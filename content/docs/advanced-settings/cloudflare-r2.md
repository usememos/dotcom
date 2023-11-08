---
title: Configuring Cloudflare R2 Storage
---

Cloudflare R2 Storage is a reliable and secure storage solution that can be integrated with Memos to store and fetch files. In this guide, we will walk you through the steps to configure Cloudflare R2 Storage in Memos.

## Step 1: Create a Cloudflare Account

If you don't have one already, you will need to create a Cloudflare account. You can do this by visiting [Cloudflare's website](https://www.cloudflare.com/) and clicking on the "Sign Up" button. Follow the instructions to create your account.

## Step 2: Create an R2 Storage Bucket

After you have created your Cloudflare account, you will need to create an R2 Storage bucket. To do this, follow these steps:

1. Log in to your Cloudflare account.
2. Expand the R2 submenu from the left bar.
3. Select "Overview".
4. Click on "Manage R2 API Tokens" on the right part of the screen.
5. Click on the "Create API token" button.
6. Choose a Token name (es. MEMOS Token).
7. Choose the "Admin Read & Write" permission.
8. Optional: limit the IP adrress access range using the "Client IP Address Filtering".
9. Click on "Create API token" at the bottom of the page.
10. Copy your Access Key ID and Secret Access Key.

## Step 3: Obtain Your R2 Credentials

To integrate Cloudflare R2 Storage with Memos, you will need to obtain your R2 credentials. To do this, follow these steps:

1. Log in to your Cloudflare account.
2. Go to the "R2 Storage" section.
3. Click on the "Access Keys" tab.
4. Click on the "Create Access Key" button.
5. Copy your Access Key and Secret Key.

## Step 4: Configure Memos

Now that you have your Cloudflare R2 Storage bucket and credentials, you can configure Memos to use Cloudflare R2 Storage. To do this, follow these steps:

1. Log in to your Memos account.
2. Go to the "Settings" section.
3. Click on the "Storage" tab.
4. Select "Cloudflare R2 Storage" as your storage provider.
5. Enter your Access Key and Secret Key.
6. Enter the name of your Cloudflare R2 bucket.
7. Click on the "Save" button.

Congratulations! You have successfully configured Cloudflare R2 Storage in Memos. You can now upload and fetch files to and from your Cloudflare R2 Storage bucket.

![r2-storage-config](/content/docs/advanced-settings/cloudflare-r2/r2-storage-config.png)
_👆 A complete configuration of R2 storage_

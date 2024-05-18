---
title: Configuring Cloudflare R2 Storage
---

Cloudflare R2 Storage is a reliable and secure storage solution that can be integrated with Memos to store and fetch files. In this guide, we will walk you through the steps to configure Cloudflare R2 Storage in Memos.

## Step 1: Create a Cloudflare Account

If you don't have one already, you will need to create a Cloudflare account. You can do this by visiting [Cloudflare's website](https://www.cloudflare.com/) and clicking on the "Sign Up" button. Follow the instructions to create your account.

## Step 2: Create an R2 Storage Bucket

After you have created your Cloudflare account, you will need to create an R2 Storage bucket. To do this, follow these steps:

1. Log in to your Cloudflare account.
2. Go to the "R2 Storage" section.
3. Click on the "Create Bucket" button.
4. Give your bucket a name.
5. Choose the appropriate object lifecycle rules (reccomended: reduce the value of "Abort uploads after" field to 1 day.)
6. Click on the "Create Bucket" button.

## Step 3: Obtain Your R2 Credentials

To integrate Cloudflare R2 Storage with Memos, you will need to obtain your R2 credentials. To do this, follow these steps:

1. Log in to your Cloudflare account.
2. Expand the "R2" submenu from the left bar.
3. Select "Overview".
4. Click on "Manage R2 API Tokens" on the right part of the screen.
5. Click on the "Create API token" button.
6. Choose a Token name (es. MEMOS Token).
7. Choose the "Admin Read & Write" permission (or select the
8. Optional: limit the IP adrress access range using the "Client IP Address Filtering".
9. Click on "Create API token" at the bottom of the page.
10. Copy your Access Key ID and Secret Access Key.
11. Copy your Endpoint Key.
12. Take note of the Region of your bucket (usually either EU or Auto).
13. Return to the "R2" submenu from the left bar menu.
14. From the "Overview" tab, select the newly created bucket.
15. Select the "Settings" tab from the top bar menu.
16. Scroll down to the "R2.dev subdomain" tab and click the "Allow Access" button.
17. Confirm the activation by writing "allow" in the pop-up and click the "Allow" button once more.
18. Wait 120s for the setting to apply.
19. Copy your "Public R2.dev Bucket URL".

## Step 4: Configure Memos

Now that you have your Cloudflare R2 Storage bucket and credentials, you can configure Memos to use Cloudflare R2 Storage. To do this, follow these steps:

1. Log in to your Memos account.
2. Go to the "Settings" section.
3. Click on the "Storage" tab and switch to the "S3" sub-tab.
4. Insert your **Access Key** and **Secret Key** in the respective fields.
5. Insert your **Endpoint** Key.
6. Insert "auto" in the **Region** field. (alternatively you may try to use your bucket specific region)
7. Enter the name of your Cloudflare R2 **bucket**.
8. Click on the "Save" button.

Congratulations! You have successfully configured Cloudflare R2 Storage in Memos. You can now upload to your Cloudflare R2 Storage bucket.

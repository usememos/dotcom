---
title: Configuring Microsoft Entra ID (Azure AD) for Authentication
---

Microsoft Entra ID (formerly Microsoft Azure AD) is a SaaS identity provider which supports the OpenID Connect (OIDC) protocol. As such, we may use it for single sign-on authentication in Memos. This guide assumes you already have an Entra ID tenant (with a free or paid plan) configured, have users added to your environment and have access to the [portal](https://entra.microsoft.com) with proper rights.

## Step 1: Configure Entra ID

### Create a new Application Registration

1. In the sidebar navigate to Identity > Applications > App registrations
2. Create a new registration
3. Set "Name" as `Memos` (or the display name you want)
4. Select supported account you desire. Generally the default option `Accounts in this organizational directory only` is the correct one. 
5. Set the platform of your "Redirect URI" to `Web`
6. Set the "Redirect URI" to `https://<YOUR-MEMOS-DOMAIN>/auth/callback`
7. Click "Register" at the bottom of the page

### Setup API permissions

1. In the sidebar of the application page, navigate to API permissions
2. Click "Add a permission" in "Configured permissions" section
3. Select "Microsoft Graph"
4. Select "Delegated permissions"
5. Select the OpenId permissions `email`, `openid`, `profile` and click "Add permissions"
6. Click "Grant admin consent" in "Configured permissions" section and confirm.

### Create a client secret

1. In the sidebar of the application page, navigate to Certificates & Secret
2. Click "New client secret" in "Client secrets" section
3. Add a description, select the prefered expiration date and click "Add"
5. Store the Secret "Value" somewhere for the Memos configuration

## Step 2: Obtaining the necessary endpoints for Memos

With the Application registration ready, all we need now is to copy all the credentials and authentication endpoints.

1. In the sidebar of the application page, navigate to Overview
2. Copy down the `Application (client) ID` information display in the "Essentials" section
3. Click "Endpoints" on top of the page
4. Copy down the URLs under `OAuth 2.0 authorization endpoint (v2)` and `OAuth 2.0 token endpoint (v2)`

## Step 3: Configuring Memos

Finally, we can open Memos and add Entra ID as an authentication option.

1. Log into your Memos account and select the "Settings" button
2. Click on "SSO"
3. Click the "Create" button
4. Type = OAUTH2
5. Template = Custom
6. Fill out the following details:

   - Set "Name" as anything you wish, such as "Microsoft Entra ID". This will appear on a button on the Memos login page
   - Paste your `Client ID` with `Application (client) ID` data
   - Paste your `Client Secret` with value retrieved in Step 1
   - Paste your `Authorize URL` into the "Authorization endpoint"
   - Paste your `Token URL` in the "Token endpoint"
   - Paste `https://graph.microsoft.com/oidc/userinfo` in the "User endpoint"
   - Set "Scopes" as `openid profile email`
   - Set "Identifer" as `email`
   - (Optional) Set "Display name" as `given_name` (for the first name) or `name` (for the full name)
   - (Optional) Set "Email" as `email`

Congratulations! You may now log into Memos using Entra ID! 🥳

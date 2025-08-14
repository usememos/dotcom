---
title: Configuring Authentik for Authentication
---

Authentik is a self-hosted identity provider which supports the OpenID Connect (OIDC) protocol. As such, we may use it for single sign-on authentication in Memos. This guide assumes you already have a Authentik instance set up and running, and have users added to your environment.

## Step 1: Configure Authentik for Memos

### Setup Authentik Provider

1. In the sidebar navigate to Applications > Providers
2. Create a new OAuth2/OpenID Provider
3. Set "Name" as `Provider for Memos`
4. Set your Authorization flow, default `default-provider-authorization-explicit-consent (Authorize Application)` works
5. Set "Redirect URIs/Origins (RegEx)" to `https://<YOUR-MEMOS-DOMAIN>/auth/callback`
6. Click "Finish" at the bottom of the page

### Setup Authentik Application

1. Download the [Memos Logo Here](https://github.com/usememos/dotcom/blob/main/public/logo-rounded.png)
2. In the sidebar navigate to Applications > Applications
3. Click "Create" at the top to creat a new application
4. Set "Name" to `Memos`
5. Set "Slug" to `memos`
6. Set "Provider" to `Provider for Memos`, which you just created
7. Drop down "UI Settings"
8. Under "Icon" upload the logo-rounded.png you downloaded
9. Click "Create" at the bottom of the page

## Step 2: Obtaining the necessary endpoints for Memos

With the Authentik configuration ready, all we need now is to copy all the credentials and authentication endpoints.

1. Back in Authentik, under Applications > Providers, Select the `Provider for Memos` you created earlier
2. Copy down the URLs under `Authorize URL`, `Token URL`, and `Userinfo URL`
3. Click "Edit" and copy down the `Client ID` and `Client Secret`

## Step 3: Configuring Memos

Finally, we can open Memos and add Authentik as an authentication option.

1. Log into your Memos account and select the "Settings" button.
2. Click on "SSO."
3. Click the "Create" button.
4. Type = OAUTH2
5. Template = Custom
6. Fill out the following details:

   - Set "Name" as anything you wish, such as "Authentik." This will appear on a button on the Memos login page.
   - Paste your `Client ID`
   - Paste your `Client Secret`
   - Paste your `Authorize URL` into the authorization endpoint.
   - Paste your `Token URL` in the token endpoint.
   - Paste your `Userinfo URL` int he user info endpoint.
   - Set "Scopes" as `openid profile email`.
   - Set "Identifer" as `preferred_username`.
   - (Optional) Set "Display name" as `given_name`.
   - (Optional) Set "Display name" as `email`.

Congratulations! You may now log into Memos using Authentik! 🥳

![An example of Authentik OAUTH2 in Memos](/content/docs/advanced-settings/authentik/memos-authentik-config.png)

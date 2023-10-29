---
title: Configuring Keycloak for Authentication
---

Keycloak is a self-hosted identity provider which supports the OpenID Connect (OIDC) protocol. As such, we may use it for single sign-on authentication in Memos. This guide assumes you already have a Keycloak instance set up and running.

## Step 1: Create a realm for Memos

After logging into the Keycloak admin panel, navigate to the sidebar, click the realm dropdown at the top, then select or create the realm for Memos users log in through.

## Step 2: Create a client for Memos

Once you have selected your desired realm, we must create a client for the Memos application to use.

1. In the sidebar under "Manage," go to "Clients."
2. Select the "Create client" button.
3. Ensure "OpenID Connect" is selected for "Client type."
4. Enter anything for Client ID, such as "memos."
5. Click the "Next" button.
6. The following values should be set as such:
   - "Client authentication" toggled "On"
   - "Standard flow" checked
   - "Direct access grants" unchecked
7. Click the "Save" button.

![An example of a correctly-configured Keycloak client](/content/docs/advanced-settings/keycloak/keycloak-client-config.png)
_👆 A correctly-configured Keycloak client for Memos_

## Step 3: Configure the Keycloak client details

Now that we have created a client for Memos, we must now add the proper configurations. In the "Client details" of your newly created client, perform the following:

1. Set "Root URL" to `https://<YOUR-MEMOS-DOMAIN>/`.
2. Set "Valid redirect URIs" to `https://<YOUR-MEMOS-DOMAIN>/auth/callback`.
3. Set "Web origins" to `https://<YOUR-MEMOS-DOMAIN>/`.

## Step 4: Obtaining the necessary endpoints for Memos

With the Keycloak client ready, all we need now is to copy all the credentials and authentication endpoints.

1. Still under "Client details," select "Credentials."
2. Copy down the "Client secret."
3. Open the sidebar and select "Realm settings."
4. Beside "Endpoints," click on the "OpenID Endpoint Configuration" link.
5. Copy down the URLs under `authorization_endpoint`, `token_endpoint`, and `userinfo_endpoint`.

## Step 5: Create a user in Keycloak

If you do not already have a user in Keycloak, we will create it now.

1. Go to the sidebar, then select "Users."
2. Click the "Add user" button.
3. Enter the following:
   - Set "Username" to anything you want. If you want to use SSO for your existing Memos account, set it to your Memos username.
   - (Optional) Set "Email" to your Memos account email.
   - (Optional) Set "First name" to your Memos display name.
4. Click the "Create" button.
5. Within the newly-created user, select "Credentials."
6. Click "Set password," then add the desired password for this user.
7. (Optional) Repeat steps 2 to 6 to create addtional users.

## Step 6: Configuring Memos

Finally, we can open Memos and add Keycloak as an authentication option.

1. Log into your Memos account and select the "Settings" button.
2. Click on "SSO."
3. Click the "Create" button.
4. Under OAuth 2.0, select "Custom."
5. Fill out the following details:

   - Set "Name" as anything you wish, such as "Keycloak." This will appear on a button on the Memos login page.
   - Set "Client ID" as the one created in [Step 2](#step-2:-create-a-client-for-memos).
   - Paste your client secret.
   - Paste your authorization endpoint.
   - Paste your token endpoint.
   - Paste your user info endpoint.
   - Set "Scopes" as `openid profile email`.
   - Set "Identifer" as `preferred_username`.
   - (Optional) Set "Display name" as `given_name`.
   - (Optional) Set "Display name" as `email`.

   **Note:** If you set these optional values, the user in Keycloak must have an email and/or first name set, or else the server will return a 500 error.

Congratulations! You may now log into Memos using Keycloak! 🥳

![An example of Keycloak OAUTH2 in Memos](/content/docs/advanced-settings/keycloak/memos-keycloak-config.png)
_👆 Keycloak OAUTH2 entry in Memos_

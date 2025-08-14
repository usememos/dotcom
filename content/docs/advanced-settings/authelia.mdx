---
title: Configuring Authelia for Authentication
---

Authelia is a self-hosted identity provider which supports the OpenID Connect (OIDC) protocol. As such, we may use it for single sign-on authentication in Memos. This guide assumes you already have an Authelia instance set up and running.

## Step 1: Create client_id and secret

### Create a random client_id to use for Memos

```shell
$ authelia crypto rand --length 72 --charset rfc3986
```

Output

```
Random Value: KBWBhDTF~JWtNvJzFtE5taA~Pwas1NT8QPIa_PyCPp4aK3eQFoXkjkc1xPwRXnISRTFLyzWu
```

### Create a random secret to use for Memos

```shell
authelia crypto hash generate pbkdf2 --variant sha512 --random --random.length 72 --random.charset rfc3986
```

Output:

```
Random Password: 4n0DT~2f8HxSWXMWG7v7w04vT9bg3~GlppjgAeaN0B.N7s.f40abK1UQeRLgSY0fGYNOXr-t
Digest: $pbkdf2-sha512$310000$TUUA9RwCwfJ80DU6eQ5Vnw$szmkmnTcRtuOArWirCHCvA7lnWcRaPxWuNu7qEyjond2k3fQINfkjxbJ0vG6nUaUoqW5FoykkuBgNiDnGSY15Q
```

Use the `Random Password` in your Memos SSO configuration.  
Use the `Digest` in your Authelia client configuration.

## Step 2: Create a client config for Memos in `authelia.yml`

⚠️ Do not use the example values from above - create your own identifiers and passwords!

```
    clients:
      - client_name: 'Memos'
        client_id: '<generated_client_id_from_above>'
        client_secret: '<generated_digest_from_above>'
        public: false
        authorization_policy: 'two_factor'
        pre_configured_consent_duration: 4w
        redirect_uris:
          - 'https://memos.example.com/auth/callback'
        scopes:
          - 'openid'
          - 'profile'
          - 'email'
        token_endpoint_auth_method: 'client_secret_post'
```

Restart your Authelia service if necessary.

## Step 3: Configuring Memos

Finally, we can open Memos and add Authelia as an authentication option.

1. Log into your Memos account and select the "Settings" button.
2. Click on "SSO."
3. Click the "Create" button.
4. Under OAuth 2.0, select "Custom."
5. Fill out the following details:

   - Set "Name" as anything you wish, such as "Authelia". This will appear on a button on the Memos login page.
   - Set "Client ID" as the one created in [Step 1](#create-a-random-client_id-to-use-for-memos).
   - Paste your client secret (the `Radnom Password`) created in [Step 1](#create-a-random-secret-to-use-for-memos).
   - Paste your authorization endpoint.  
     `https://auth.example.com/api/oidc/authorization`
   - Paste your token endpoint.  
     `https://auth.example.com/api/oidc/token`
   - Paste your user info endpoint.  
     `https://auth.example.com/api/oidc/userinfo`
   - Set "Scopes" as `openid profile email`.
   - Set "Identifer" as `preferred_username`.
   - (Optional) Set "Display name" as `name`.
   - (Optional) Set "Display name" as `email`.

   **Note:** If you set these optional values, the user in Authelia must have an email and/or first name set, or else the server will return a 500 error.

Congratulations! You may now log into Memos using Authelia! 🥳

![An example of Authelia OAUTH2 in Memos](/content/docs/advanced-settings/authelia/memos-authelia-config.png)
_👆 Authelia OAUTH2 entry in Memos_

---
title: Access Tokens
---

Access tokens are used in token-based authentication to allow an application to access an API. You can view and manage your access tokens in the settings page.

![setting](/content/docs/security/access-tokens/setting.png)

## Generate an access token

Go to the settings page and click on the "Create" button to create an access token.

- **Descirption**: A description of the access token.
- **Expiration**: The expiration date of the access token.

  ![create](/content/docs/security/access-tokens/create.png)

## Call the API with an access token

To call the API with an access token, you need to add the `Authorization` header to your request.

```
GET /api/v1/memo
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

For example with `curl`:

```shell
curl https://demo.usememos.com/api/v1/memo \
   -H "Accept: application/json" \
   -H "Authorization: Bearer {YOUR_ACCESS_TOKEN}"
```

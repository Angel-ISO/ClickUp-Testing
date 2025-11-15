<div align="center">
  <img src="./media/quanonimos.png"alt="Logo" height="100">
  <h2>
    ClickUp Testing Project by qanonimos
  </h2>
</div>

<div align="center">
    <a href="https://gitlab.com/jala-university1/cohort-4/oficial-es-programaci-n-4/...">
        <img src="https://img.shields.io/badge/license-MIT-green?style=for-the-badge" alt="License">
    </a>
    <a href="https://gitlab.com/jala-university1/cohort-4/oficial-es-programaci-n-4/...">
        <img src="https://img.shields.io/badge/release-latest-blue?style=for-the-badge" alt="Latest Version">
    </a>
    <a href="https://gitlab.com/jala-university1/cohort-4/oficial-es-programaci-n-4/...">
        <img src="https://img.shields.io/badge/contributors-4-orange?style=for-the-badge" alt="Contributors">
    </a>
</div>

<br>
<br>

## Explication for my .env.

1. Create .env similar for .env.example

2. Generate in base this file

```
CLICKUP_BASE_URL=https://api.clickup.com/api/v2
CLICKUP_TOKEN={your TOKEN}
CLICKUP_SPACE_ID={}
CLICKUP_TASK_ID={}
CLICKUP_VIEW_ID={}
CLICKUP_CHAT_COMMENT_ID={chat_comment_id}
CLICKUP_REPLY_COMMENT_ID={It will be filled in when you create the answer.}
```

URL, where you can generate.

Before is necesary generate team id: https://developer.clickup.com/reference/getauthorizedteams

Note: No forget your token

Then generate:

- SPACE ID: https://developer.clickup.com/reference/getspaces
- FOLDER ID: https://developer.clickup.com/reference/getfolders
- LIST ID: https://developer.clickup.com/reference/getlists
- TASK ID: https://developer.clickup.com/reference/gettasks
- VIEW ID: https://developer.clickup.com/reference/getteamviews

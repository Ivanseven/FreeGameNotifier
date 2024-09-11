# Free Games Notification Extension

#### Video Demo: <URL HERE>

#### About

This project is an unofficial extension to check updates from reddit.com/r/FreeGameFindings Chrome Extension Manifest v3.

This extension upon installation will query the 50 newest game entries from `https://www.reddit.com/r/FreeGameFindings`

It will then filter out the expired games and games based on the last claimed date, updated by pressing the claimed button.

It utilizes Chrome Extension APIs:

- `Alarm`, to check for updates periodically
- `Storage`, to save & retrieve the last claimed date

##### Pending:

- Settings page to specify tags to include

- Auto Claim button possible once signed in?

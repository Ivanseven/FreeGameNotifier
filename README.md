# Free Games Notification Extension

#### Video Demo: <URL HERE>

#### About

This project is an unofficial extension to check updates from reddit.com/r/FreeGameFindings Chrome Extension Manifest v3.

This extension upon installation will query the 50 newest game entries from `https://www.reddit.com/r/FreeGameFindings`

It will then filter out the expired games and games based on the last claimed date, updated by pressing the claimed button.

It utilizes Chrome Extension APIs:

- `Alarm`, to check for updates periodically
- `Storage`, to save and retrieve the last claimed date

#### Usage

After installing the extension, you may wait for the extension to notify you of the latest games

##### Pending:

Feels like I need more features, but the other features are kinda hacky, and require some design planning. But at least I have some explanation why it isn't worth developing.

- Settings page to specify tags to include

- Auto Claim button possible once signed in?

- Show difference of last claimed date vs now, with colored text based on age
  eg: (1 hour ago, 2 weeks ago )

- Last Update Date

- Epic Games Quick Link

- Check if already steam game already owned? Needs access to steam library, possible.

- game logos via steam! wait via reddit!!!

- hide GMT?

##### Hacky Pending:

- Auto Claim possible? Needs to run JS behind the scenes, might violate some background rules. Load the page in an iframe? Use Megumin's link

- Check if already Epic Game owned? Epic Games library may not have API access

# Steam API Stuff

Possibly exclude for now, as this might require user API key or a backend API.

We need an Steam API key to query for a user's owned games, then we can ask a user to enter their steam profile link, and compare against it.

https://developer.valvesoftware.com/wiki/Steam_Web_API#GetOwnedGames_.28v0001.29

To apply for a key, we need to comply with their policy.
Also, we need to keep this key private.. so we can't call it directly on this extension, unless we ask the users to use their own keys. So alternatively, we need to store the key in another backend service so we can call it without exposing the key.

Policy:
https://steamcommunity.com/dev/apiterms

Example:
https://www.lorenzostanco.com/lab/steam/

Ask Chatgpt to read & generate privacy policy to comply.

# Credits

- Google Fonts Icons, https://fonts.google.com/icons

- FreeGameFindings Reddit Community & Logo, https://www.reddit.com/r/FreeGameFindings/

- Redditor MeguminShiro for giving us instant claim links, https://www.reddit.com/user/MeguminShiro/

- Valve Corporation for their Steam platform API to query for user owned games.

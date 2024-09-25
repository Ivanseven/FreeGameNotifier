# Priority List:

Ordered by priority

- Show difference of last claimed date vs now, with colored text based on age
  eg: (1 hour ago, 2 weeks ago )

- hide GMT?

- claim dates history

- undo claim button

- Epic Games Quick Link

- Check if already Steam game already owned? Needs access to steam library, possible.

- game logos via steam! wait via reddit!!!

- Testing
  https://developer.chrome.com/docs/extensions/how-to/test/unit-testing

#### Hacky:

- Auto Claim button possible once signed in?

## Pending:

Feels like I need more features, but the other features are kinda hacky, and require some design planning. But at least I have some explanation why it isn't worth developing.

##### Hacky Pending:

- Auto Claim possible? Needs to run JS behind the scenes, might violate some background rules. Load the page in an iframe? Use Megumin's link

- Check if already Epic Game owned? Epic Games library may not have API access

# Steam API Stuff

Possibly exclude for now, as this might require user API key or a backend API.

- Steam API Key
  - Backend API for security, vercel?

We need an Steam API key to query for a user's owned games, then we can ask a user to enter their steam profile link, and compare against it.

https://developer.valvesoftware.com/wiki/Steam_Web_API#GetOwnedGames_.28v0001.29

To apply for a key, we need to comply with their policy.
Also, we need to keep this key private.. so we can't call it directly on this extension, unless we ask the users to use their own keys. So alternatively, we need to store the key in another backend service so we can call it without exposing the key.

Policy:
https://steamcommunity.com/dev/apiterms

Example:
https://www.lorenzostanco.com/lab/steam/

Ask Chatgpt to read & generate privacy policy to comply.

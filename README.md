# Free Games Notification Extension

#### Video Demo: <URL HERE>

## About

This project is an unofficial extension to check updates from [reddit.com/r/FreeGameFindings](https://www.reddit.com/r/FreeGameFindings)

It utilizes the following Chrome Extension permissions:

- `Alarm`, to check for updates periodically
- `Storage`, to save settings & last claimed & refreshed dates

# Installation

1. Enable Developer Mode on Chrome:

   - Open this [link](chrome://extensions/) OR Go to Menu > More tools > Extensions in Chrome.
   - Toggle on Developer mode (top-right corner).

2. Load the Extension:

   - Click Load unpacked.
   - Select the folder containing your extension’s manifest.json file.

# Usage

This extension notifies you of the number of new posts (excluding expired) since your last claimed date via the extension badge.

When you have checked the latest updates from Reddit, click the `claimed` button to update the last claimed date.

Currently, the extension retrieves updates every 2 hours.

To retrieve the latest updates manually, press the `refresh` button.

### Filter Setting

To filter multiple platforms, separate each platform with a comma like so:

Eg: `Xbox,Playstation,PSA`

You may choose to either:

- Include all games except for the specified platforms

  Excluding `xbox` platforms will exclude posts which only have the `xbox` platform.

  We include posts if they include other tags(Eg: `PC / Xbox`) to avoid missing out on updates. To exclude those posts as well, exclude all platforms in those posts.

- Exclude all games except for the specified platforms
  Including `steam` platform will only include posts if they have `steam` in their platforms title.

# Credits

- Google Fonts Icons, https://fonts.google.com/icons

- FreeGameFindings Reddit Community & Logo, https://www.reddit.com/r/FreeGameFindings/

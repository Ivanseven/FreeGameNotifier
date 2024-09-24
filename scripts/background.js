// On extension install, set storage
chrome.runtime.onInstalled.addListener(({ reason }) => {
  if (reason === 'install') {
    // Save to browser storage
    chrome.storage.sync.set({
      lastClaimedEpochSecs: 0,
      lastRefreshedEpochSecs: 0,
      includedPlatforms: "*",
      excludedPlatforms: "",
    });
  }
});

export const lastClaimedDateStorageKey = "lastClaimedEpochSecs"
export const lastRefreshedDateStorageKey = "lastRefreshedEpochSecs"

const getEpochSecondsNow = () => {
  const d = new Date();
  const seconds = d.getTime() / 1000;
  return seconds
}

export const updateLastClaimedDate = () => {
  // const now = new Date().toUTCString() // Storage can't seem to store Date
  const storageObj = {}
  storageObj[lastClaimedDateStorageKey] = getEpochSecondsNow()
  chrome.storage.sync.set(storageObj)
}

const updateLastRefreshedDate = () => {
  // const now = new Date().toUTCString() // Storage can't seem to store Date
  // Wait store the epochSeconds instead! It's easier on the background, convert it in the frontend
  const storageObj = {}
  storageObj[lastRefreshedDateStorageKey] = getEpochSecondsNow()
  chrome.storage.sync.set(storageObj)
}

export const getLatestFreeGamesFindingsData = async () => {
  // https://www.reddit.com/r/FreeGameFindings/new.json?limit=none
  const response = await fetch('https://www.reddit.com/r/FreeGameFindings/new.json?limit=50');
  let newGamesCount = 0

  const lastClaimedDateSinceEpoch = await chrome.storage.sync.get([lastClaimedDateStorageKey]).then((result) => {
    return result.lastClaimedEpochSecs
  });

  const includedPlatforms = await chrome.storage.sync.get("includedPlatforms").then((data)=>{
    if (data.includedPlatforms !== "*") {
      let platforms = data.includedPlatforms.toLowerCase().replace(/\s/g, '')
      platforms.indexOf('/') !== -1 ? platforms.split('/') : platforms
      return platforms
    }
    return data.includedPlatforms
  })

  const excludedPlatforms = await chrome.storage.sync.get(["excludedPlatforms"]).then((data)=>{
    if (data.excludedPlatforms === "") return []

    let platforms = data.excludedPlatforms.toLowerCase().replace(/\s/g, '')
    platforms.indexOf('/') !== -1 ? platforms.split('/') : platforms
    return platforms
  })

  response.json().then((json)=>{
    let entries = json.data.children
    entries = entries.filter((item)=>{
      // Check for games after last claimed date & apply filters
      if (lastClaimedDateSinceEpoch < item.data.created_utc) {

        if (item.data.link_flair_text === "Expired") {
          return false
        }

        const postTitle = item.data.title.toLowerCase()
        const platformEndBracketPos = postTitle.indexOf("]");
        const hasPlatformList = platformEndBracketPos !== -1 // No platform list found! Eg: [Steam / Epic / Origin]
        const platformList = hasPlatformList ? postTitle.slice(1, platformEndBracketPos).replace(/\s/g, '').split(",") : []

        if (hasPlatformList) {
          if (includedPlatforms === "*" || 
            includedPlatforms.some(platform=> platformList.includes(platform.toLowerCase()))
          ) {
            newGamesCount += 1
            return true
          }
        }

        if (excludedPlatforms.some(platform=> platformList.includes(platform.toLowerCase()))) {
          return false
        }

        // Include everything else
        // Eg: improper/irregular formatted posts
        newGamesCount += 1
        return true
      }

    })
   
    // for (let entry of entries) {
      // const d = new Date(0); // Sets the date to the epoch
      // d.setUTCSeconds(entry.data.created_utc);
      // To debug entry date
    // }

    if (newGamesCount > 0) {
      chrome.action.setBadgeBackgroundColor({color: 'green'})
      chrome.action.setBadgeText({
        text:`${newGamesCount}`
      })
    } else {
      chrome.action.setBadgeText({
        text:""
      })
    }
  }).then(()=>{
    updateLastRefreshedDate()
  })

  return chrome.storage.sync.set({ freeGamesData: response })
};

const ALARM_NAME = 'newgame';

async function createNewGameAlarm() {
  // Singleton Alarm
  const alarm = await chrome.alarms.get(ALARM_NAME);
  if (typeof alarm === 'undefined') {
    chrome.alarms.create(ALARM_NAME, {
      delayInMinutes: 1,
      periodInMinutes: 120
    });

    getLatestFreeGamesFindingsData();
  }
}

createNewGameAlarm();

// Update games on alarm
chrome.alarms.onAlarm.addListener(getLatestFreeGamesFindingsData);

// Watch storage changes:
// chrome.storage.onChanged.addListener((changes, namespace) => {
//   for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
//     console.log(
//       `Storage key "${key}" in namespace "${namespace}" changed.`,
//       `Old value was "${oldValue}", new value is "${newValue}".`
//     );
//   }
// });
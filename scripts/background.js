// On extension install, set storage
chrome.runtime.onInstalled.addListener(({ reason }) => {
  if (reason === 'install') {
    // Save to browser storage
    chrome.storage.local.set({
      lastClaimedDate: null,
      lastRefreshedDate: null
    });
  }
});

export const lastClaimedDateStorageKey = "lastClaimedDate"
export const lastRefreshedDateStorageKey = "lastRefreshedDate"

export const updateLastClaimedDate = () => {
  const now = new Date().toUTCString() // Storage can't seem to store Date
  // Wait store the epochSeconds instead! It's easier on the background, convert it in the frontend
  const storageObj = {}
  storageObj[lastClaimedDateStorageKey] = now
  chrome.storage.local.set(storageObj)
}

const updateLastRefreshedDate = () => {
  const now = new Date().toUTCString() // Storage can't seem to store Date
  // Wait store the epochSeconds instead! It's easier on the background, convert it in the frontend
  const storageObj = {}
  storageObj[lastRefreshedDateStorageKey] = now
  chrome.storage.local.set(storageObj)
}

export const getLatestFreeGamesFindingsData = async () => {
  // https://www.reddit.com/r/FreeGameFindings/new.json?limit=none
  const response = await fetch('https://www.reddit.com/r/FreeGameFindings/new.json?limit=50');
  let newGamesCount = 0

  const lastClaimedDateSinceEpoch = await chrome.storage.local.get([lastClaimedDateStorageKey]).then((result) => {
    if (result.lastClaimedDate) {
      let lastClaimedDateParsed = new Date(Date.parse(result.lastClaimedDate));
      return Math.round(lastClaimedDateParsed.getTime() / 1000);
    }
    return null
  });


  response.json().then((json)=>{
    let entries = json.data.children
    entries = entries.filter((item)=>{
      // Filter out old/expired/etc games
      if (lastClaimedDateSinceEpoch < item.data.created_utc) {
        const includeGame = item.data.link_flair_text != "Expired"
        if (includeGame) {
          newGamesCount += 1
         return includeGame
        }
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

  return chrome.storage.local.set({ freeGamesData: response })
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
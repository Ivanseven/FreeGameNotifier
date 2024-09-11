// On extension install, set storage
chrome.runtime.onInstalled.addListener(({ reason }) => {
  if (reason === 'install') {
    // Save to browser storage
    chrome.storage.local.set({
      apiSuggestions: ['tabs', 'storage', 'scripting']
    });
  }
});

const updateTip = async () => {
  const response = await fetch('https://extension-tips.glitch.me/tips.json');
  const tips = await response.json();
  const randomIndex = Math.floor(Math.random() * tips.length);
  console.log("tip of day", tips[randomIndex])
  return chrome.storage.local.set({ tip: tips[randomIndex] });
};

export const getLatestFreeGamesFindingsData = async () => {
  // https://www.reddit.com/r/FreeGameFindings/new.json?limit=none
  const response = await fetch('https://www.reddit.com/r/FreeGameFindings/new.json?limit=50');
  let newGamesCount = 0

  // console.log("reddit res", response);
  // console.log("reddit body", response.body);
  // const redditHTML = await response.text();
  // console.log("reddit text", redditHTML);

  // Game Names
  response.json().then((json)=>{
    let entries = json.data.children
    entries = entries.filter((item)=>{
      return item.data.link_flair_text != "Expired"
    })
   

    for (let entry of entries) {
      const d = new Date(0); // Sets the date to the epoch
      d.setUTCSeconds(entry.data.created_utc);
      // console.log(d, "->",entry.data.title)
      newGamesCount += 1
    }

    console.log(entries, entries.length)

    console.log("newGamesCount", newGamesCount)
    chrome.action.setBadgeBackgroundColor({color: 'green'})
    chrome.action.setBadgeText({
      text:`${newGamesCount}`
    })
  })

  const now = new Date().toDateString() // Storage can't seem to store Date
  chrome.storage.local.set({ "lastClaimedDate": now }).then(()=>{
    console.log("getLatestFreeGamesFindingsData set?", now)

    chrome.storage.local.get(["lastClaimedDate"]).then((result) => {
      console.log("getLatestFreeGamesFindingsData... get", result)
    });
  })
  return chrome.storage.local.set({ freeGamesData: response })
};

const ALARM_NAME = 'newgame';

async function createAlarm() {
  // Singleton Alarm
  const alarm = await chrome.alarms.get(ALARM_NAME);
  if (typeof alarm === 'undefined') {
    chrome.alarms.create(ALARM_NAME, {
      delayInMinutes: 1,
      periodInMinutes: 1
    });

    // updateTip();
    getLatestFreeGamesFindingsData();
  }
}

async function clearAlarm(name) {
  chrome.alarms.clear(name);
}

createAlarm();
// clearAlarm(ALARM_NAME);

// Update tip once a day
chrome.alarms.onAlarm.addListener(getLatestFreeGamesFindingsData);


// Watch storage changes:
chrome.storage.onChanged.addListener((changes, namespace) => {
  for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
    console.log(
      `Storage key "${key}" in namespace "${namespace}" changed.`,
      `Old value was "${oldValue}", new value is "${newValue}".`
    );
  }
});
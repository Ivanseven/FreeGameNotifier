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

const getLatestFreeGamesFindingsData = async () => {
  // https://www.reddit.com/r/FreeGameFindings/new.json?limit=none
  const response = await fetch('https://www.reddit.com/r/FreeGameFindings/new.json?limit=50');
  
  console.log("reddit res", response);
  console.log("reddit body", response.body);
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
      console.log(d, "->",entry.data.title)
    }
    console.log(entries, entries.length)
  })

  return chrome.storage.local.set({ freeGamesData: response })
};

const ALARM_NAME = 'tip';

async function createAlarm() {
  const alarm = await chrome.alarms.get(ALARM_NAME);
  if (typeof alarm === 'undefined') {
    chrome.alarms.create(ALARM_NAME, {
      delayInMinutes: 1,
      periodInMinutes: 1
    });

    updateTip();
    getLatestFreeGamesFindingsData();
  }
}

async function clearAlarm(name) {
  chrome.alarms.clear(name);
}

createAlarm();
clearAlarm(ALARM_NAME);

// Update tip once a day
chrome.alarms.onAlarm.addListener(updateTip);
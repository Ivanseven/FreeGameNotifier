import { getLatestFreeGamesFindingsData, lastRefreshedDateStorageKey, lastClaimedDateStorageKey, updateLastClaimedDate } from "./background.js"

function epochSecsToDate (epochSeconds) {
    return Date(epochSeconds);
}

function dateToLocale(date){
    return date.toLocaleString()
}

function updateLastClaimDateText () {
    let lastClaimedDateText = "-"
    chrome.storage.sync.get([lastClaimedDateStorageKey]).then((result) => {
        console.log("claimed", result)

        if (result.lastClaimedEpochSecs > 0) {
            lastClaimedDateText = dateToLocale(epochSecsToDate(result.lastClaimedEpochSecs));
        }
        document.querySelector("#lastClaimedText").innerText = lastClaimedDateText
    });

}

function updateLastRefreshedDateText() {
    let lastRefreshedDateText = "-"
    chrome.storage.sync.get([lastRefreshedDateStorageKey]).then((result) => {
        console.log("refresh", result)
        if (result.lastRefreshedEpochSecs > 0) {
            lastRefreshedDateText = dateToLocale(epochSecsToDate(result.lastRefreshedEpochSecs));
        }
        document.querySelector("#lastRefreshedText").innerText = lastRefreshedDateText
    });

}

document.querySelector("#claimedButton").addEventListener("click", ()=>{
    chrome.storage.sync.get([lastClaimedDateStorageKey]).then(() => {
        updateLastClaimedDate()
    }).then(()=>{
        updateLastClaimDateText()
        chrome.action.setBadgeText({
            text:""
        })
    });
})

document.querySelector("#refreshButton").addEventListener("click", ()=>{
    document.querySelector("#refreshIcon").classList.add("animate-infinite")
    getLatestFreeGamesFindingsData().then((result)=>{
        document.querySelector("#refreshIcon").classList.remove("animate-infinite")
        document.querySelector("#refreshIcon").classList.add("animate-once")
        updateLastRefreshedDateText()
    })
})

document.querySelector('#settingsButton').addEventListener('click', function() {
    if (chrome.runtime.openOptionsPage) {
      chrome.runtime.openOptionsPage();
    } else {
      window.open(chrome.runtime.getURL('options.html'));
    }
  });

updateLastClaimDateText()
updateLastRefreshedDateText()


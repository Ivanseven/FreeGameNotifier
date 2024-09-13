import { getLatestFreeGamesFindingsData, lastRefreshedDateStorageKey, lastClaimedDateStorageKey, updateLastClaimedDate } from "./background.js"

function updateLastClaimDateText () {
    let lastClaimedDateText = "-"
    chrome.storage.local.get([lastClaimedDateStorageKey]).then((result) => {
        console.log("claimed", result)

        if (result.lastClaimedDate) {
            lastClaimedDateText = result.lastClaimedDate;
        }
        document.querySelector("#lastClaimedText").innerText = lastClaimedDateText
    });

}

function updateLastRefreshedDateText() {
    let lastRefreshedDateText = "-"
    chrome.storage.local.get([lastRefreshedDateStorageKey]).then((result) => {
        console.log("refresh", result)
        if (result.lastRefreshedDate) {
            lastRefreshedDateText = result.lastRefreshedDate;
        }
        document.querySelector("#lastRefreshedText").innerText = lastRefreshedDateText
    });

}

document.querySelector("#claimedButton").addEventListener("click", ()=>{
    chrome.storage.local.get([lastClaimedDateStorageKey]).then(() => {
        updateLastClaimedDate()
    }).then(()=>{
        updateLastClaimDateText()
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

updateLastClaimDateText()
updateLastRefreshedDateText()


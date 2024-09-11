import { getLatestFreeGamesFindingsData, lastClaimedDateStorageKey } from "./background.js"

function updateLastClaimDate () {
    let lastClaimedDateText = "-"
    chrome.storage.local.get([lastClaimedDateStorageKey]).then((result) => {
        if (result.lastClaimedDate) {
            lastClaimedDateText = result.lastClaimedDate;
        }
        document.querySelector("#lastClaimedText").innerText = lastClaimedDateText
    });

}

document.querySelector("#refreshButton").addEventListener("click", ()=>{
    getLatestFreeGamesFindingsData()
    chrome.storage.local.get([lastClaimedDateStorageKey]).then((result) => {
        updateLastClaimDate()
    });
})

updateLastClaimDate()


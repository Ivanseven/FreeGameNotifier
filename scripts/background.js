import { FilterModeOptions, DefaultPostTypes } from "./constants.js"
import { PostType } from "./constants.js"

// On extension install, set storage
chrome.runtime.onInstalled.addListener(({ reason }) => {
  if (reason === "install") {
    // Save to browser storage
    chrome.storage.sync.set({
      lastClaimedEpochSecs: 0,
      lastRefreshedEpochSecs: 0,
      excludedPlatforms: "",
      filterMode: FilterModeOptions.INCLUDE,
      includedPostTypes: DefaultPostTypes,
    })
  }
})

export const lastClaimedDateStorageKey = "lastClaimedEpochSecs"
export const lastRefreshedDateStorageKey = "lastRefreshedEpochSecs"

const getEpochSecondsNow = () => {
  const d = new Date()
  const seconds = d.getTime() / 1000
  return seconds
}

export const updateLastClaimedDate = () => {
  const storageObj = {}
  storageObj[lastClaimedDateStorageKey] = getEpochSecondsNow()
  chrome.storage.sync.set(storageObj)
}

const updateLastRefreshedDate = () => {
  const storageObj = {}
  storageObj[lastRefreshedDateStorageKey] = getEpochSecondsNow()
  chrome.storage.sync.set(storageObj)
}

const verifyPlatformInclusion = (
  platformList,
  excludedPlatforms,
  includeAll
) => {
  // Exclude game ONLY if it does not have other tags
  // Eg: Steam / Xbox / Playstation
  // Excluding Xbox should not exclude this post because it includes Steam/Playstation
  const result = platformList.some((platform) => {
    return includeAll
      ? !excludedPlatforms.includes(platform)
      : excludedPlatforms.includes(platform)
  })

  // console.debug(result ? "✅" : "", "GAME", platformList, excludedPlatforms)
  return result
}

const verifyPostTypeInclusion = (postType, includedPostTypes) => {
  postType = postType.toLowerCase()

  let settingType
  if (PostType[postType]) {
    settingType = PostType[postType]
  } else {
    settingType = "others"
  }

  return includedPostTypes[settingType]
}

export const getLatestFreeGamesFindingsData = async () => {
  const response = await fetch(
    "https://www.reddit.com/r/FreeGameFindings/new.json?limit=50"
  )
  let newGamesCount = 0

  const lastClaimedDateSinceEpoch = await chrome.storage.sync
    .get([lastClaimedDateStorageKey])
    .then((result) => {
      return result.lastClaimedEpochSecs
    })

  const filterMode = await chrome.storage.sync
    .get(["filterMode"])
    .then((data) => {
      return data.filterMode
    })

  const excludedPlatforms = await chrome.storage.sync
    .get(["excludedPlatforms"])
    .then((data) => {
      if (data.excludedPlatforms === "") return []

      let platforms = data.excludedPlatforms.toLowerCase().replace(/\s/g, "")
      platforms =
        platforms.indexOf(",") !== -1 ? platforms.split(",") : [platforms]
      return platforms
    })

  const includedPostTypes = await chrome.storage.sync
    .get(["includedPostTypes"])
    .then((data) => {
      return data.includedPostTypes
    })

  response
    .json()
    .then((json) => {
      let entries = json.data.children
      entries = entries.filter((item) => {
        // Check for games after last claimed date & apply filters
        if (lastClaimedDateSinceEpoch < item.data.created_utc) {
          if (item.data.link_flair_text === "Expired") {
            return false
          }

          const includeAll = filterMode === FilterModeOptions.INCLUDE
          let includePost = includeAll

          const postTitle = item.data.title.toLowerCase()
          const platformEndBracketPos = postTitle.indexOf("]")
          const hasPlatformList = platformEndBracketPos !== -1 // No platform list found! Platform list should look like: [Steam / Epic / Origin]
          const platformList = hasPlatformList
            ? postTitle
                .slice(1, platformEndBracketPos)
                .toLowerCase()
                .replace(/\s/g, "") // Remove whitespace to standardize names
                .replaceAll(",", "/") // Handle if comma is platform separator
                .split("/")
            : []

          if (hasPlatformList) {
            includePost = verifyPlatformInclusion(
              platformList,
              excludedPlatforms,
              includeAll
            )
          }

          // PSA posts do not have PostType
          if (hasPlatformList && !platformList.includes("psa")) {
            let postTypeStartBracketPos = postTitle.indexOf("(")
            let postTypeEndBracketPos = postTitle.indexOf(")")
            if (
              postTypeStartBracketPos !== -1 &&
              postTypeEndBracketPos !== -1
            ) {
              const postType = postTitle.slice(
                postTypeStartBracketPos + 1,
                postTypeEndBracketPos
              )
              includePost = verifyPostTypeInclusion(postType, includedPostTypes)
            }
          }

          if (includePost) {
            // console.log("Included Game", postTitle)
            // The "Exiled Giveaways and Itch.io Mega Threads" post flags as a new post too
            newGamesCount += 1
            return includePost
          }
        }
      })

      if (newGamesCount > 0) {
        chrome.action.setBadgeBackgroundColor({ color: "green" })
        chrome.action.setBadgeText({
          text: `${newGamesCount}`,
        })
      } else {
        chrome.action.setBadgeText({
          text: "",
        })
      }
    })
    .then(() => {
      updateLastRefreshedDate()
    })

  return chrome.storage.sync.set({ freeGamesData: response })
}

const ALARM_NAME = "newgame"

async function createNewGameAlarm() {
  // Singleton Alarm
  const alarm = await chrome.alarms.get(ALARM_NAME)
  if (typeof alarm === "undefined") {
    chrome.alarms.create(ALARM_NAME, {
      delayInMinutes: 1,
      periodInMinutes: 120,
    })

    getLatestFreeGamesFindingsData()
  }
}

createNewGameAlarm()

// Update games on alarm
chrome.alarms.onAlarm.addListener(getLatestFreeGamesFindingsData)

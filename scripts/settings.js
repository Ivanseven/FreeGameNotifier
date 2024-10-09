import { FilterModeOptions } from "./constants.js"

// Saves options to chrome.storage
const saveOptions = () => {
    const filterMode = document.querySelector('input[name="filterMode"]:checked').value;
    const excludedPlatforms = document.getElementById('excludedPlatforms').value.replace(/\s/g, '').replaceAll("/",",");
    const selectedPostTypes = {
      game: document.querySelector('input[name="postTypeGame"]').checked === true,
      DLC: document.querySelector('input[name="postTypeDLC"]').checked === true,
      membership: document.querySelector('input[name="postTypeMembership"]').checked === true,
      credits: document.querySelector('input[name="postTypeCredits"]').checked === true,
      preRelease: document.querySelector('input[name="postTypePreRelease"]').checked === true,
      others: document.querySelector('input[name="postTypeOthers"]').checked === true,
    }


    chrome.storage.sync.set(
      { filterMode, excludedPlatforms, selectedPostTypes},
      () => {
        // Update status to let user know options were saved.
        const status = document.getElementById('status');
        status.textContent = `Options saved. We will ${filterMode} all games${excludedPlatforms ? " except for: " +excludedPlatforms : '.' }`;
        setTimeout(() => {
          status.textContent = '';
        }, 5000);
      }
    );
  };
  
  // Restores options using the preferences stored in chrome.storage.
  const restoreOptions = () => {
    chrome.storage.sync.get(
      { filterMode: "include", excludedPlatforms: "" },
      (items) => {

        if (items.filterMode === FilterModeOptions.INCLUDE) {
            document.getElementById('filterInclude').checked = true
        } else {
            document.getElementById('filterExclude').checked = true
        }

        document.getElementById('excludedPlatforms').value = items.excludedPlatforms;
      }
    );
  };
  
  document.addEventListener('DOMContentLoaded', restoreOptions);
  document.getElementById('save').addEventListener('click', saveOptions);
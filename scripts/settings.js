// Saves options to chrome.storage
const saveOptions = () => {
    const color = document.getElementById('color').value;
    const likesColor = document.getElementById('like').checked;

    const includedPlatforms = document.getElementById('includedPlatforms').value.replaceAll(",","/");
    const excludedPlatforms = document.getElementById('excludedPlatforms').value.replaceAll(",","/");
    
    chrome.storage.sync.set(
      { favoriteColor: color, likesColor: likesColor, includedPlatforms: includedPlatforms, excludedPlatforms: excludedPlatforms },
      () => {
        // Update status to let user know options were saved.
        const status = document.getElementById('status');
        status.textContent = "Options saved." // `Options saved. ${includedPlatforms} --- ${excludedPlatforms}`;
        setTimeout(() => {
          status.textContent = '';
        }, 750);
      }
    );
  };
  
  // Restores select box and checkbox state using the preferences
  // stored in chrome.storage.
  const restoreOptions = () => {
    chrome.storage.sync.get(
      { favoriteColor: 'red', likesColor: true, includedPlatforms: "*", excludedPlatforms: "" },
      (items) => {
        document.getElementById('color').value = items.favoriteColor;
        document.getElementById('like').checked = items.likesColor;

        document.getElementById('includedPlatforms').value = items.includedPlatforms;
        document.getElementById('excludedPlatforms').value = items.excludedPlatforms;
      }
    );
  };
  
  document.addEventListener('DOMContentLoaded', restoreOptions);
  document.getElementById('save').addEventListener('click', saveOptions);
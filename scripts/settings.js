// Saves options to chrome.storage
const saveOptions = () => {
    const includedPlatforms = document.getElementById('includedPlatforms').value.replaceAll(",","/");
    const excludedPlatforms = document.getElementById('excludedPlatforms').value.replaceAll(",","/");
    
    chrome.storage.sync.set(
      { includedPlatforms: includedPlatforms, excludedPlatforms: excludedPlatforms },
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
      { includedPlatforms: "*", excludedPlatforms: "" },
      (items) => {
        document.getElementById('includedPlatforms').value = items.includedPlatforms;
        document.getElementById('excludedPlatforms').value = items.excludedPlatforms;
      }
    );
  };
  
  document.addEventListener('DOMContentLoaded', restoreOptions);
  document.getElementById('save').addEventListener('click', saveOptions);
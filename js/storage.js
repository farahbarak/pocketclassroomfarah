
function saveToLocalStorage() {
  localStorage.setItem('capsules', JSON.stringify(capsules));
}

function loadFromLocalStorage() {
  const saved = localStorage.getItem('capsules');
  if (saved) {
    capsules = JSON.parse(saved);
    updateLibraryUI();
  }
}

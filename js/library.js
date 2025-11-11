
// Export Capsule
function exportCapsule(index) {
  const capsule = capsules[index];
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(capsule));
  const dlAnchor = document.createElement("a");
  dlAnchor.setAttribute("href", dataStr);
  dlAnchor.setAttribute("download", `${capsule.subject || "capsule"}.json`);
  dlAnchor.click();
}

function deleteCapsule(index) {
  if (!confirm("Are you sure you want to delete this capsule?")) return;
  capsules.splice(index, 1);
  updateLibraryUI();
  saveToLocalStorage();
}

document.getElementById("btnImport").addEventListener("click", () => {
  document.getElementById("importFile").click();
});

document.getElementById("importFile").addEventListener("change", function (event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      let data = JSON.parse(e.target.result);

      if (!Array.isArray(data)) {
        data = [data];
      }

      data.forEach(capsule => capsules.push(capsule));

      updateLibraryUI();
      saveToLocalStorage();
      alert(`✅ ${data.length} capsule(s) imported successfully!`);
    } catch (err) {
      alert("❌ Error reading JSON file");
      console.error(err);
    }
  };
  reader.readAsText(file);
});

document.getElementById("btnExportAll").addEventListener("click", exportAllCapsules);

function exportAllCapsules() {
  if (capsules.length === 0) {
    alert("No capsules to export!");
    return;
  }

  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(capsules, null, 2));
  
  const dlAnchor = document.createElement("a");
  dlAnchor.setAttribute("href", dataStr);
  dlAnchor.setAttribute("download", "all_capsules.json");
  
  dlAnchor.click();
}


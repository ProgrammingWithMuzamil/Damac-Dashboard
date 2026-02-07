// Force clear all cache and localStorage
console.log('🧹 CLEARING ALL CACHE AND LOCAL STORAGE');

// Clear localStorage
localStorage.clear();

// Clear sessionStorage
sessionStorage.clear();

// Clear any potential IndexedDB
if (window.indexedDB) {
  window.indexedDB.databases().forEach(database => {
    window.indexedDB.deleteDatabase(database.name);
  });
}

// Force page reload to get fresh data
console.log('🔄 RELOADING PAGE...');
window.location.reload();

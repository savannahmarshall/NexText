const butInstall = document.getElementById('buttonInstall');

// Store the event for triggering the install dialog
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault(); 
  deferredPrompt = event; 
  butInstall.classList.remove('hidden');
});

// Implement the click event handler on the `butInstall` element
butInstall.addEventListener('click', async () => {
  if (!deferredPrompt) {
    return; 
  }
  deferredPrompt.prompt(); 
  const { outcome } = await deferredPrompt.userChoice;
  if (outcome === 'accepted') {
    console.log('User accepted the A2HS prompt');
  } else {
    console.log('User dismissed the A2HS prompt');
  }
  deferredPrompt = null; 
});

//handler for the `appinstalled` event
window.addEventListener('appinstalled', (event) => {
  console.log('PWA was installed');
});

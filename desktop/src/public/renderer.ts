/**
 * This file wil be executed in the renderer process for that window. No Node.js APIs are
 * available in this process because `nodeIntegration` is turned off and
 * `contextIsolation` is turned on. Use the contextBridge API in `preload.js`
 * to expose Node.js functionality from the main process.
 */

const clientListElement = document.getElementById('client-list')

setInterval(async () => {
    const clientList: Array<string> = await window.electronAPI.getClientList()
    if (clientList.length <= 0) {
        clientListElement.innerHTML = `<div class="client">No clients connected</div>`
        return;
    }

    clientListElement.innerHTML = clientList.map(client => `<div class="client">${client}</div>`).join('')
}, 3000)
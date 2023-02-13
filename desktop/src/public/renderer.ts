document.addEventListener('DOMContentLoaded', async () => {
    const electronAPI = (window as any).electronAPI // Temporary solution with any type.

    // Show server address.
    document.getElementById('server-address').innerHTML = await electronAPI.getLocalIPAddress()

    // Show client list every 3 seconds.
    const clientListElement = document.getElementById('client-list')

    setInterval(async () => {
        const clientList: Array<string> = await electronAPI.getClientList()
        if (clientList.length <= 0) {
            clientListElement.innerHTML = `<div class="client">No clients connected</div>`
            return;
        }

        clientListElement.innerHTML = clientList.map(client => `<div class="client">${client}</div>`).join('')
    }, 3000)
})
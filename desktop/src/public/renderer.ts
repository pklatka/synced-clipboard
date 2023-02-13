document.addEventListener('DOMContentLoaded', async () => {
    // Show server address.
    document.getElementById('server-address').innerHTML = await (window as any).electronAPI.getLocalIPAddress()

    // Show client list every 3 seconds.
    const clientListElement = document.getElementById('client-list')

    setInterval(async () => {
        const clientList: Array<string> = await (window as any).electronAPI.getClientList()
        if (clientList.length <= 0) {
            clientListElement.innerHTML = `<div class="client">No clients connected</div>`
            return;
        }

        clientListElement.innerHTML = clientList.map(client => `<div class="client">${client}</div>`).join('')
    }, 3000)
})
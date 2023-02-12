import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
    getClientList: () => ipcRenderer.invoke('get-client-list'),
    getLocalIPAddress: () => ipcRenderer.invoke('get-local-ip-address'),
})
const { contextBridge, ipcRenderer } = require('electron')

//console.log("preload electron!")

let reqCallback;
let asyncCallback;

contextBridge.exposeInMainWorld('ServerAPI', 
{
  clientRequests:(request, callback)=> {

    ipcRenderer.send("request",request); //to main process

    reqCallback = callback;
  },
  onServerEvents: (callback)=>{
    asyncCallback = callback
  }
})

ipcRenderer.on('reply', (event, arg) => {
  if(reqCallback)
    reqCallback(arg);
})



ipcRenderer.on('async-message', (event, arg) => {
  //send to front
  asyncCallback(arg)
})

ipcRenderer.on('console', (event, arg) => {
  console.log(arg);
})
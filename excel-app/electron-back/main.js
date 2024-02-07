const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const files = require("./file_worker")

let isExitConfirmed = false

//router
ipcMain.on('request', async (event, request) => {
    //console.log(request) 

    let response = {};
    let data =  request.data;
    
    switch(request.act){
      case "GET_CATALOGUE" : 
        response = await files.loadCatalogue()
        event.reply('reply', response);
        //console.log(response)
        return;

        case "SAVE_CATALOGUE" : 
        response = await files.saveCatalogue(data)
        event.reply('reply', response);
        return;

        case "SAVE_SALELIST" : 
        response = await files.saveReport(data)
        event.reply('reply', response);
        return;

        case "SAVE_SALELIST_ALL" : 
        response = await files.saveReportAll(data)
        event.reply('reply', response);
        return;

        case "GET_SALELIST" : 
        response = await files.loadReport()
        event.reply('reply', response);
        return;

        case "GET_LAST_CASH":
        response = files.loadCash()

        if(response.state == "warning" || response.state == "error"){
          event.reply('reply', response);
          return
        }
        else{
          event.reply('reply', {state: "success", data: response});
          return;
        }

        //manager page
        case "GET_MONTH_STAT" : 
        response = await files.getMonthStat(data)
        event.reply('reply', response);
        return;

        case "GET_MONTH_EXP" : 
        response = await files.getMonthExpenses(data)
        event.reply('reply', response);
        return;

        case "SAVE_MONTH_EXP" : 
        response = await files.saveMonthExpenses(data)
        event.reply('reply', response);
        return;

        //exit
        case "EXIT_APP" :
          isExitConfirmed = true
          app.quit();
        return;
    }

    event.reply('reply', response);
})

//application
function createWindow () {
    const win = new BrowserWindow({
      width: 1280,
      height: 800,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
        nativeWindowOpen: true
      },
      fullscreen: false
    });

    win.removeMenu();
  
    //win.webContents.openDevTools();
    //console.log(path.resolve(__dirname, '../front/dist/index.html'))
    win.loadFile(path.resolve(__dirname, 'dist/index.html'))
    win.on('close',function(e){
      e.preventDefault()

      if(isExitConfirmed){
        app.exit()
      }
      else{
        win.webContents.send('async-message', {'type': 'EXIT_APP'});
      }
    })
  }

  app.whenReady().then(() => {
    createWindow();
  })
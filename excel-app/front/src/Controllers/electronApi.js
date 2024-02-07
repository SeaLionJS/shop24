// Server - Client API
let subscribed = false

function electronAPI(data = {}) {

    return new Promise(resolve=>{
      window.ServerAPI.clientRequests(data, resolve)
    }) 
  }

export default {
  async getCatalogue(){
      const res = await electronAPI({ act: "GET_CATALOGUE", data: [] });
        return res;
  },

  async saveCatalogue(data){
      const res = await electronAPI({ act: "SAVE_CATALOGUE", data });
        return res;
  },

  async getSaleList(){
      const res = await electronAPI({ act: "GET_SALELIST", data: [] });
        return res;
  },

  async saveSaleList(data, isAuto = true){
      const res = await electronAPI({ act: "SAVE_SALELIST", data });
        return res;
  },

  async saveAll(data, isAuto = true){
      const res = await electronAPI({ act: "SAVE_SALELIST_ALL", data });
        return res;
  },

  async getLastCash(){
    const res = await electronAPI({ act: "GET_LAST_CASH", data: [] });
    return res;
  },

  /////////////////////////////////////////////
  async getMonthStat(data){
    const res = await electronAPI({ act: "GET_MONTH_STAT", data });
    return res;
  },
  
  async getMonthExpenses(data){
    const res = await electronAPI({ act: "GET_MONTH_EXP", data});
      return res;
  },

  async saveMonthExpenses(data, isAuto = true){
      const res = await electronAPI({ act: "SAVE_MONTH_EXP", data });
        return res;
  },

  async exit(){
      electronAPI({ act: "EXIT_APP"});
  },

  async subscribe(callback){
      window.ServerAPI.onServerEvents(callback)
  }
}

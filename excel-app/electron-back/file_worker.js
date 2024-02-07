const fs = require("fs/promises");
const classicFS = require("fs")
const path = require("path")
const ExcelJS = require('exceljs');

const getDateString = (dt=undefined)=>{
    const date = new Date()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const year = date.getFullYear()
    const hour = date.getHours()
    const min = date.getMinutes()
    const name = `${day}_${month}_${year} ${hour}_${min}`
    return name;
}

const getYMD = (dt=new Date())=>{
    const date = new Date(dt)
    const month = date.getMonth() + 1
    const day = date.getDate()
    const year = date.getFullYear()

    return {month, year, day};
}

function getNewestFile(files, path) {
    let out = [];
    files.forEach(function(file) {
        let stats = classicFS.statSync(path + "/" +file);
        if(stats.isFile()) {
            out.push({"file":file, "mtime": stats.mtime.getTime()});
        }
    });
    out.sort(function(a,b) {
        return b.mtime - a.mtime;
    })
    return (out.length>0) ? out[0].file : "";
}

const getDayStat = async(date)=>{
    const ymd = getYMD(date)
    const fname = ymd.day+".xlsx"
    let pth = path.resolve(__dirname, "../..", "files", "Reports", ""+ymd.year, ""+ymd.month)
    if (!classicFS.existsSync(path.join(pth, fname))){
        return {state: "warning", data: `Файл не знайдено!`}
    }

    const workbook = new ExcelJS.Workbook()
    const f = await workbook.xlsx.readFile(path.join(pth, fname))
    const worksheetList = workbook.getWorksheet("Перелік")
    const worksheetReport = workbook.getWorksheet("Звіт")

    /////////////
    let buyPrice = 0
    let sellPrice = 0
    let sellCash = 0
    let sellCard = 0
    let goodsCount = 0

    worksheetList.eachRow((row, rowNum)=>{
        if(rowNum == 1) return;
        const vals = row.values
        buyPrice+=vals[3]
        sellPrice+=vals[5]
        sellCash+=vals[6]
        sellCard+=vals[7]
        goodsCount++;
    })

    return {state: "success", data: {buyPrice, sellPrice, sellCash, sellCard, goodsCount}}
}

module.exports = {
    async saveCatalogue(data){
        const fname = getDateString()+".xlsx"
        const pth = path.resolve(__dirname, "../..", "files", "Catalogue", fname)
        
        const workbook = new ExcelJS.Workbook()
        const worksheet = workbook.addWorksheet("Каталог")

        worksheet.columns = [
            { header: 'Код', key: 'id', width: 15 },
            { header: 'Товар', key: 'name', width: 40 },
            { header: 'Ціна закупівлі', key: 'buy', width: 15},
            { header: 'Ціна продажу', key: 'sell', width: 15},
            { header: 'Інформація', key: 'info', width: 40},
            { header: 'Дата', key: 'date', width: 15}
          ];
        
        worksheet.addRows(data)
        

        try{
            await workbook.xlsx.writeFile(pth);
            return {state: "success", data: `Успішно збережено в ${fname}!`}
        }
        catch(err){
            //console.log(err)
            return {state: "error", data: `Сталась помилка під час запису у ${fname}!`}
        }
    },

    async loadCatalogue(){
        const pth = path.resolve(__dirname, "../..", "files", "Catalogue")
        const files = await fs.readdir(pth)
        const latestFile = getNewestFile(files, pth)
        if(!latestFile) return {state: "warning", data: "Файлів не знайдено!"}

        const workbook = new ExcelJS.Workbook()
        const f = await workbook.xlsx.readFile(path.join(pth, latestFile))
        const worksheet = workbook.getWorksheet("Каталог")
        const rows = []
        worksheet.eachRow((row, rowNum)=>{
            if(rowNum == 1) return;
            const vals = row.values
            const obj = {
                id: vals[1],
                name: vals[2],
                buy: vals[3],
                sell: vals[4],
                info: vals[5],
                date: vals[6]
            }
            rows.push(obj)
        })

        return {state: "success", data: rows}
    },

    async saveReport(data){
        const workbook = new ExcelJS.Workbook()
        const worksheet = workbook.addWorksheet("Перелік")

        worksheet.columns = [
            { header: 'Код продажу', key: 'id', width: 15 },
            { header: 'Назва товару', key: 'name', width: 40 },
            { header: 'Ціна закупівлі', key: 'buy', width: 15 },
            { header: 'Ціна (каталог)', key: 'sellRec', width: 15},
            { header: 'Ціна продажу', key: 'sellReal', width: 15},
            { header: 'Готівка', key: 'sellCash', width: 15},
            { header: 'Карта', key: 'sellCard', width: 15},
            { header: 'Дата', key: 'date', width: 15}
          ]

          worksheet.addRows(data.sellList)

          const worksheet2 = workbook.addWorksheet("Звіт")

          worksheet2.columns= [
                { header: 'Бонус', key: 'bonus', width: 15 },
                { header: 'Залишилось (каса)', key: 'prevCash', width: 15 },
                { header: 'Карта', key: 'card', width: 15 },
                { header: 'Готівка', key: 'cash', width: 15 },
                { header: 'Забрав керівник', key: 'manager', width: 15 },
                { header: 'Забрали оператори SMM', key: 'opperators', width: 15 },
                { header: 'Забрали продавці', key: 'sellers', width: 15 },
                { header: 'Інші витрати', key: 'other', width: 15 },
                { header: 'Додано готівки', key: 'plus', width: 15 },
                { header: 'Витрати готівки', key: 'minus', width: 15 },
                { header: 'Всього (каса)', key: 'total', width: 15 },
                { header: 'Дата збереження', key: 'date', width: 15 },
            ]

            worksheet2.addRows([{...data.report,  date: data.date}])
            
            const ymd = getYMD()
            const fname = ymd.day+".xlsx"



          try{
            let pth = path.resolve(__dirname, "../..", "files", "Reports", ""+ymd.year, ""+ymd.month)
            let resStr = ""

            if (!classicFS.existsSync(pth)){
                classicFS.mkdirSync(pth, { recursive: true });
                resStr+=`Папка зі звітами ${path.join("Reports", ""+ymd.year, ""+ymd.month)}  створена. `
            }

            await workbook.xlsx.writeFile(path.join(pth, fname));

            return {state: "success", data: `${resStr}Успішно збережено в ${fname}!`}
            }
            catch(err){
                //console.log(err)
                return {state: "error", data: `Сталась помилка при записі в ${fname}!`}
            }
    },

    async saveReportAll(data){
        const res = await this.saveReport(data)

        if(res.state == "success"){
            classicFS.writeFileSync(
                path.resolve(__dirname, "../..", "files", "autosaves", "cash.datm"),
                JSON.stringify(data.report.total)
            )
        }
        
        return res

    },

    loadCash(){
        if (!classicFS.existsSync(path.resolve(__dirname, "../..", "files", "autosaves", "cash.datm"))){
            return {state: "warning", data: `Інформацію про касу з минулої доби не знайдено!`}
        }

        let prevCash = classicFS.readFileSync(
            path.resolve(__dirname, "../..", "files", "autosaves", "cash.datm")
        )

        prevCash = JSON.parse(prevCash)

        return prevCash
    },

    async loadReport(){
        const ymd = getYMD()
        //console.log(ymd)
        const fname = ymd.day+".xlsx"
        let pth = path.resolve(__dirname, "../..", "files", "Reports", ""+ymd.year, ""+ymd.month)
        if (!classicFS.existsSync(path.join(pth, fname))){
            return {state: "warning", data: `Файл звіту за день не знайдено!`}
        }

        const workbook = new ExcelJS.Workbook()
        const f = await workbook.xlsx.readFile(path.join(pth, fname))
        const worksheetList = workbook.getWorksheet("Перелік")
        const worksheetReport = workbook.getWorksheet("Звіт")
        const rowsList = []

        worksheetList.eachRow((row, rowNum)=>{
            if(rowNum == 1) return;
            const vals = row.values
            const obj = {
                id: vals[1],
                name: vals[2],
                buy: vals[3],
                sellRec: vals[4],
                sellReal: vals[5],
                sellCash: vals[6],
                sellCard: vals[7],
                date: vals[8]
            }
            rowsList.push(obj)
        })

        let report = undefined
        let date = undefined

        worksheetReport.eachRow((row, rowNum)=>{
            if(rowNum == 1) return;
            const vals = row.values
            const obj = {
                bonus: vals[1],
                prevCash: vals[2],
                card: vals[3],
                cash: vals[4],
                manager: vals[5],
                operators: vals[6],
                sellers: vals[7],
                other: vals[8],
                plus: vals[9],
                minus: vals[10],
                total: vals[11]
            }
            report = obj;
            date = vals[12]
        })
        
        const prevCash = this.loadCash()

        if(prevCash.state == "warning"){
            return prevCash
        }

        return {state: "success", data: {report, sellList: rowsList, date, prevCash}}
    },

    //manager page
    async getMonthStat(data){
        //console.log(data.date)
        const dayDate = new Date(data.date)
        dayDate.setDate(1)
        const selectedMonth = dayDate.getMonth()
        let buyPrice = 0
        let sellPrice = 0
        let sellCash = 0
        let sellCard = 0
        let goodsCount = 0
        const eachDay = []

        while(dayDate.getMonth() == selectedMonth){
            const dayStat = await getDayStat(dayDate)
            eachDay.push(dayStat)
            if(dayStat.state=="success"){
                buyPrice += dayStat.data.buyPrice
                sellPrice += dayStat.data.sellPrice
                sellCash += dayStat.data.sellCash
                sellCard += dayStat.data.sellCard
                goodsCount += dayStat.data.goodsCount
            }
            dayDate.setDate(dayDate.getDate()+1)
            //console.log(dayDate.getDate())
        }

        //{state: "success", data: {buyPrice, sellPrice, sellCash, sellCard, goodsCount}}
        return {state: "success", data: {days: eachDay, total:{buyPrice, sellPrice, sellCash, sellCard, goodsCount}}}
    },

    async getMonthExpenses(data){
        const ymd = getYMD(data.date)
        const fname = "expenses.xlsx"
        let pth = path.resolve(__dirname, "../..", "files", "Reports", ""+ymd.year, ""+ymd.month)
        if (!classicFS.existsSync(path.join(pth, fname))){
            return {state: "warning", data: `Файл витрат не знайдено!`}
        }

        const workbook = new ExcelJS.Workbook()
        const f = await workbook.xlsx.readFile(path.join(pth, fname))
        const worksheetList = workbook.getWorksheet("Перелік")
        const worksheetReport = workbook.getWorksheet("Звіт")
        const rowsList = []

        worksheetList.eachRow((row, rowNum)=>{
            if(rowNum == 1) return;
            const vals = row.values
            const obj = {
                id: vals[1],
                name: vals[2],
                price: vals[3],
            }
            rowsList.push(obj)
        })

        let report = undefined

        worksheetReport.eachRow((row, rowNum)=>{
            if(rowNum == 1) return;
            const vals = row.values
            const obj = {
                total: vals[1],
                date: vals[2],
            }
            report = obj;
        })
        
        return {state: "success", data: {report, expenses: rowsList, date: data.date}}
    },

    async saveMonthExpenses(data){
        const workbook = new ExcelJS.Workbook()
        const worksheet = workbook.addWorksheet("Перелік")

        worksheet.columns = [
            { header: 'Номер', key: 'id', width: 15 },
            { header: 'Назва витрати', key: 'name', width: 40 },
            { header: 'Сума', key: 'price', width: 15 },
          ]

          //{expenses: rows, total: totalExpenses, date: dt}
          //console.log(data)
          worksheet.addRows(data.expenses)

          const worksheet2 = workbook.addWorksheet("Звіт")

          worksheet2.columns= [
                { header: 'Підсумок', key: 'total', width: 15 },
                { header: 'Дата', key: 'date', width: 25 },
            ]

            worksheet2.addRows([{total:data.total,  date: data.date}])
            
            const ymd = getYMD(data.date)
            const fname = "expenses.xlsx"



          try{
            let pth = path.resolve(__dirname, "../..", "files", "Reports", ""+ymd.year, ""+ymd.month)
            let resStr = ""

            if (!classicFS.existsSync(pth)){
                classicFS.mkdirSync(pth, { recursive: true });
                resStr+=`Папку зі звітами ${path.join("Reports", ""+ymd.year, ""+ymd.month)}  створено. `
            }

            await workbook.xlsx.writeFile(path.join(pth, fname));

            return {state: "success", data: `${resStr}Успішно збережено в ${fname}!`}
            }
            catch(err){
                //console.log(err)
                return {state: "error", data: `Сталась помилка при записі в ${fname}!`}
            }
    },
}


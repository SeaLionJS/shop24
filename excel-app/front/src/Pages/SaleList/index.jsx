import React, {useEffect, useState} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Logo from "../../Pics/logo_m.png"
import PageSelector from '../../Widgets/PageSelector'
import { DataGrid, useGridApiRef } from '@mui/x-data-grid'

import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { catalogueColumns2, columnsSellList } from '../../data/tableFields';
import { Button, TextField } from '@mui/material'
import CustomNoRowsOverlay from '../../Widgets/NoTableData'
import moment from 'moment'
import electronApi from '../../Controllers/electronApi'

import CustomTabPanel from './CustomTabPanel'
import Loader from '../../Widgets/Loader'
import createID from '../../Controllers/uniqueID'

  //{ id: 1, name: 'Рукавицы', buy: 1000, sell: 1200, info: "некоторое описание", date: new Date() }
  let catalogueRows = []

  
  const recalculateMoney = (money)=>{
    let m = {...money}
    m.cash = Number(m.cash).toFixed(2)*1
    m.card = Number(m.card).toFixed(2)*1
    m.bonus = Number((m.card + m.cash)*0.03).toFixed(2)*1
    m.plus = m.cash
    m.minus = m.manager + m.opperators + m.sellers + m.other
    m.total = m.plus - m.minus + m.prevCash
    m.total = m.total.toFixed(2)*1
    
    return m
  }

  const createMessage = (text, isSuccess = true)=>{
      return {type: "SHOW_MESSAGEBOX_DEFAULT", payload:{header: isSuccess ? "Успіх" : "Інформація", text}}
  }

  
////////////////////////////////////////////////////////////////////////////////// 
export default function SaleList() {
    const [loaded, setLoaded] = useState(true)
    const [tabInd, setTabInd] = React.useState(0);
    const apiRefCat = useGridApiRef();
    const apiRefSell = useGridApiRef();
    const [selectedId, setSelectedId] = useState(-1)
    const [selectedId2, setSelectedId2] = useState(-1)
    const [sellGoodRows, setSellGoodRows] = useState([])
    const [saveDate, setSaveDate] = useState(undefined)
    const dispatch = useDispatch()

    const handleChangeTab = (event, newValue) => {
        setTabInd(newValue);
    };

    const rowsDB = useSelector(store=>store.goods)

    const [rowsFilter, setRowsFilter] = useState("")
    const catalogueRows = rowsDB.filter((v)=>{
      return (v.id + "").includes(rowsFilter)
    })
    
    const recalculateTableLogic = (goods)=>{
      let cash_tmp = 0;
      let card_tmp = 0
      for(let i of goods){
        cash_tmp += i.sellCash;
        card_tmp += i.sellCard;
      }
      
      
      let m = {...money}
      m.card = card_tmp
      m.cash = cash_tmp
      
      m = recalculateMoney(m)
      setSellGoodRows(goods)
      setMoney(m)
    }

    useEffect(()=>{
      electronApi.getSaleList()
      .then((res)=>{
        //console.log(res)
      if(res.state == "success"){
        dispatch(createMessage("Дані успішно завантажено", true))
        setSellGoodRows([...res.data.sellList]) 
        setSaveDate(res.data.date)
        setMoney({
          bonus: res.data.report.bonus, 
          prevCash: res.data.prevCash, 
          card: res.data.report.card, 
          cash: res.data.report.cash, 
          manager: res.data.report.manager, 
          opperators: res.data.report.operators, 
          sellers: res.data.report.sellers, 
          other: res.data.report.other, 
          plus:res.data.report.plus, 
          minus:res.data.report.minus, 
          total:res.data.report.total
        })
        //recalculateTableLogic(res.data.sellList)

        setLoaded(true)
      }
      else{
        dispatch(createMessage(res.data, false))
        setLoaded(true)
      }
      })
    },[])

    const sellHandler = ()=>{ //for table 1
      const row = apiRefCat.current.getRow(selectedId)
      //console.log(row)
      const good = { 
        id: createID(), 
        name: row.name, 
        buy: row.buy,
        sellRec: row.sell, 
        sellReal: row.sell, 
        sellCard: row.sell,
        sellCash:0,
        date: new Date() 
      }

      let goods = [...sellGoodRows, good]
      
      let m = {...money}
      m.card += good.sellRec
      
      m = recalculateMoney(m)

      setMoney(m)
      setSellGoodRows(goods)
      setTabInd(1)
      dispatch({type: "LOCK_PAGE"})
    }

    const deleteHandler = ()=>{
      setSellGoodRows(sellGoodRows.filter(v=> v.id!=selectedId2))
      setSelectedId2(-1)
      dispatch({type: "LOCK_PAGE"})
    }

    const [money, setMoney] = useState({bonus: 0, prevCash:0, card: 0, cash: 0, manager: 0, opperators: 0, sellers: 0, other: 0, plus:0, minus:0, total:0})
    

    function recalculateTableData(param){

      //calculate card + cash
      const goods = [...sellGoodRows]
      
      const id = Object.keys(param)[0];

      if(!id) return

      const key = Object.keys(param[id])[0]
      //console.log(param, apiRefSell.current.getRowWithUpdatedValues(id, key)[key])
      let gid = goods.findIndex((v)=>v.id == id)
      goods[gid][key] = apiRefSell.current.getRowWithUpdatedValues(id, key)[key]
      goods[gid].sellCard =  goods[gid].sellReal - goods[gid].sellCash

      recalculateTableLogic(goods)
      dispatch({type: "LOCK_PAGE"})
    }

    const setValueWrapper = (e, paramName)=>{
        let m = money
        m[paramName] = e.target.value ? e.target.value*1 : 0
        m = recalculateMoney(m)
        setMoney(m)
    }

    const saveToExcel = async()=>{

      const res = await electronApi.saveSaleList({sellList: sellGoodRows, report:money, date: new Date()})
      if(res.state == "success"){
          dispatch(createMessage(res.data, true))
          dispatch({type: "UNLOCK_PAGE"})
          setSaveDate(new Date())
      }
      else{
        dispatch(createMessage(res.data, false))
      }
    }

    
    const saveAll = async()=>{
      
      const res = await electronApi.saveAll({sellList: sellGoodRows, report:money, date: new Date()})
      //console.log("result is",res)
      if(res.state == "success"){
        dispatch(createMessage(res.data, true))
        dispatch({type: "UNLOCK_PAGE"})
        setSaveDate(new Date())
      }
      else{
        dispatch(createMessage(res.data, false))
      }
    }
    
    const saveConfirm = ()=>{
      dispatch({type: "SHOW_MESSAGEBOX", 
      payload:{header: "Підтвердження дії", 
      text: "Ви дійсно хочете зберегти дані? Залишок з минулої доби буде перезаписано!",
      onAccept: saveAll ,
      onReject: ()=> dispatch({type: "HIDE_MESSAGEBOX"})     
    }})
    }

    const loadLastCash = async ()=>{
        const res = await electronApi.getLastCash()

        if(res.state == "success"){
          dispatch(createMessage("Успішно завантажено", true))
          let m = {...money}
          m.prevCash = res.data
          m = recalculateMoney(m)
          setMoney(m)
        }
        else{
          dispatch(createMessage(res.data, false))
        }
    }

    if(!loaded){
      return <Loader visible />
    }

    return (
        <>
            <header>
                <div><img className='logo' src={Logo} alt="logo" /></div>
                <div>
                    <PageSelector/>
                    <h3>Перелік продажів</h3>
                </div>
                <div className='bonus-header'>{`Бонус: ${money.bonus} грн.`}</div>
            </header>
            <main>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={tabInd} onChange={handleChangeTab}>
                        <Tab label="Каталог"  />
                        <Tab label="Продажі"  />
                    </Tabs>
                </Box>

                <CustomTabPanel value={tabInd} index={0}>
                <div style={{marginBottom:15}}>
                <TextField label="Фільтр: " variant="standard" value={rowsFilter} onChange={(e)=>setRowsFilter(e.target.value)}/>
                </div>
                <div>
                  <span>Обрано ID:{selectedId>= 0 ? ` ${selectedId}` : "-"}</span>
                  {selectedId>= 0 && <Button variant='contained' sx={{m:1}} color='success' onClick={sellHandler}>Додати до продажів</Button>}
                </div>
                <DataGrid
                    apiRef={apiRefCat}
                    rows={catalogueRows}
                    columns={catalogueColumns2}
                    initialState={{
                      sorting: {
                        sortModel: [{ field: 'date', sort: 'desc' }],
                    },
                    pagination: {
                        paginationModel: {
                        pageSize: 10,
                        },
                    },
                    }}
                    autoHeight
                    slots={{ noRowsOverlay: CustomNoRowsOverlay }}
                    sx={{ '--DataGrid-overlayHeight': '300px' }}
                    pageSizeOptions={[10]}
                    onRowSelectionModelChange={(id)=>setSelectedId(id)}
                />
                </CustomTabPanel>

                <CustomTabPanel value={tabInd} index={1}>
                  <div>
                    <span>Обрано ID:{selectedId2>= 0 ? ` ${selectedId2}` : "-"}</span>
                    {selectedId2>= 0 && <Button variant='contained' sx={{m:1}} color='error' onClick={deleteHandler}>Видалити</Button>}
                  </div>
                  <DataGrid
                      apiRef={apiRefSell}
                      rows={sellGoodRows}
                      columns={columnsSellList}
                      initialState={{
                      sorting: {
                        sortModel: [{ field: 'date', sort: 'desc' }],
                    },
                      pagination: {
                          paginationModel: {
                          pageSize: 10,
                          },
                      },
                      }}
                      pageSizeOptions={[10]}
                      autoHeight
                      onRowSelectionModelChange={(id)=>setSelectedId2(id)}
                      onCellModesModelChange={recalculateTableData}
                      slots={{ noRowsOverlay: CustomNoRowsOverlay }}
                      sx={{ '--DataGrid-overlayHeight': '300px' }}
                  />
                  <div className='salelist-info'>
                    <div className='left'>
                      <div>
                        <TextField 
                            sx={{minWidth:150, m: 1}}
                            className='input-container'
                            label="Залишок:" 
                            variant="outlined" 
                            value={money.prevCash}
                            onChange={(e)=>setValueWrapper(e, "prevCash")}
                        />
                        <Button variant='outlined' onClick={loadLastCash} color='success'>Завантажити залишок</Button>
                      </div>
                      <div className='input-container'>
                        <div className='autosave'>Збереження:
                        <br/>
                        {saveDate ? moment(saveDate).format('DD.MM.YYYY, hh:mm:ss') : "- відсутнє! -" }</div>
                        <div><Button variant='outlined' color='success' onClick={saveToExcel}>Зберегти звіт</Button></div>
                        <div><Button variant='outlined' sx={{mt:1}} color='success' onClick={saveConfirm}>Закрити добу</Button></div>
                      </div>
                    </div>
                    <div className='center'>
                      <h4>Карта: </h4>
                      <div className='first'><span>+</span><span>{money.card}</span>грн.</div>
                      <h4>Каса: </h4>
                      <div className='first'><span>+</span><span>{money.cash}</span>грн.</div>
                      <div><span>-</span><span>{money.minus}</span>грн.</div>
                      <div className='res'><span>=</span><span>{money.total}</span>грн.</div>
                    </div>
                    <div className='right'>
                      <div className='input-container'>
                        <TextField 
                                sx={{minWidth:150, m: 1}}
                                label="Інші витрати:" 
                                variant="outlined"
                                value={money.other}
                                onChange={(e)=>setValueWrapper(e, "other")}
                            />
                      </div>
                      <div className='input-container'>
                        <div>
                          <span>Забрали:</span><br/>
                          <TextField 
                                sx={{minWidth:150, m: 1, mt:2}}
                                label="Продавці:" 
                                variant="outlined" 
                                value={money.sellers}
                                onChange={(e)=>setValueWrapper(e, "sellers")}
                            />
                        </div>
                        <div>
                          <TextField 
                                sx={{minWidth:150, m: 1}}
                                label="Оператори SMM:" 
                                variant="outlined" 
                                value={money.opperators}
                                onChange={(e)=>setValueWrapper(e, "opperators")}
                            />
                        </div>
                        <div>
                          <TextField 
                                sx={{minWidth:150, m: 1}}
                                label="Керівник:" 
                                variant="outlined" 
                                value={money.manager}
                                onChange={(e)=>setValueWrapper(e, "manager")}
                            />
                        </div>
                      </div>
                    </div>
                  </div>
                </CustomTabPanel>
            </main>
        </>
    )
}
import React, { useEffect, useState } from 'react'
import Logo from "../../Pics/logo_m.png"
import { DataGrid, useGridApiRef } from '@mui/x-data-grid';
import { useDispatch, useSelector } from 'react-redux';
import PageSelector from '../../Widgets/PageSelector';
import { Box, TextField, Button, IconButton} from '@mui/material';
import NewRowForm from './NewRowForm';
import CustomNoRowsOverlay from '../../Widgets/NoTableData';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';

import { additionalColumns as columns } from '../../data/tableFields';
import moment from 'moment';
import electronApi from '../../Controllers/electronApi';
import ModalWindow from './ModalWindow';

const createMessage = (text, isSuccess = true)=>{
  return {type: "SHOW_MESSAGEBOX_DEFAULT", payload:{header: isSuccess ? "Успіх" : "Інформація", text}}
}

//для выбора определенных рядков
let selectedRows = []

//tableRows
export default function ManagerPage() {
    const [showDeleteButton, setShowDeleteButton] = useState(false)
    const [loaded, setLoaded] = useState(false)
    const [showModalWindow, setShowModalWindow] = useState(false)
    const [modalWindowInfo, setModalWindowInfo] = useState({days:[], 
      total:{
        buyPrice:0, sellPrice:0, sellCash:0, sellCard:0, goodsCount:0
      }
    })
    const [dt, setDt] = useState(new Date())

    const [rows, setRows] = useState([
      { id: 1, name: 'Аренда', price: 0 },
      { id: 2, name: 'Таргет', price: 0 },
      { id: 3, name: 'Податки', price: 0 },
      { id: 4, name: 'Термінал', price: 0 },
      { id: 5, name: 'Інтернет', price: 0 },
      { id: 6, name: 'ЗП бухгалтер', price: 0 },
      { id: 7, name: 'ЗП продавець Ніна', price: 0 },
      { id: 8, name: 'ЗП продавець Аня', price: 0 },
      { id: 9, name: 'ЗП оператори СМС 1', price: 0 },
      { id: 10, name: 'ЗП оператор СМС 2', price: 0},
      { id: 11, name: 'Премії', price: 0},
      { id: 12, name: 'Побутові витрати', price: 0},
    ]);



    let totalExpenses = 0
    rows.forEach((v=>{
      totalExpenses+=v.price*1
    }))

    const dispatch = useDispatch()

    const loadExpenses = (date)=>{
      electronApi.getMonthExpenses({date})
      .then(data=>{
        //console.log(data)
        if(data.state == "success"){
          setRows(data.data.expenses)
          dispatch(createMessage(`Витрати за ${moment(dt).format("MM.YYYY")} успішно завантажені!`, true))
        }
        else{
          dispatch(createMessage(data.data, false))
        }
        setLoaded(true)
      })
      .catch(err=>{
        //
      })
    }


    useEffect(()=>{
      loadExpenses(dt)
    },[])

    
    const apiRef = useGridApiRef();

    const handleDeleteRow = () => {
      const newRows = rows.filter((e)=>{
        return !selectedRows.includes(e.id)
      })
      dispatch({type: "LOCK_PAGE"})
      setRows(newRows)
    };
    
      //For newRowForm
      const handleAddRow = (data) => {
        //console.log(data)
        const newRows = [...rows, data]
        setRows(newRows)
        dispatch({type: "LOCK_PAGE"})
      };

      const handleDate = (num = 1)=>{
        const now = new Date()
        const d = dt
        d.setMonth(d.getMonth()+num);
        if(d > now) return;

        loadExpenses(d)
        setDt(new Date(d))
      }

      /////////////////////////////////////////////////////

    const selectDeleteRows = (rows)=>{
      selectedRows = rows
      if(rows.length && !showDeleteButton){
        setShowDeleteButton(true)
      }
      else if(!rows.length){
        setShowDeleteButton(false)
      }
    }

    const handleModelChange = (param)=>{
      
      const id = Object.keys(param)[0];
      
      if(!id) return
      const key = Object.keys(param[id])[0]
      //console.log("handleModelChange", param)

      const newExpenses = [...rows]
      let arrPos = newExpenses.findIndex((v)=>v.id == id)
      newExpenses[arrPos][key] = apiRef.current.getRowWithUpdatedValues(id, key)[key]

      dispatch({type: "LOCK_PAGE"})
      setRows(newExpenses)
    }

    const saveToExcel = async()=>{
      const res = await electronApi.saveMonthExpenses({expenses: rows, total: totalExpenses, date: dt})
      console.log(res)
      if(res.state == "success"){
        dispatch(createMessage("Витрати успішно збережено!",true))
        dispatch({type: "UNLOCK_PAGE"})
      }
      else{
        dispatch(createMessage("Сталась помилка збереження!", false))
      }
    }


    const getStatistic = async()=>{
      //console.log("start")
      let st = new Date().getTime()
      const res = await electronApi.getMonthStat({date: dt})
      //console.log(res) 
      if(res.state == "success"){
        setModalWindowInfo(res.data)
        setShowModalWindow(true)
        //console.log("stop ", new Date().getTime() -st)
      }
      else{
        dispatch(createMessage("Сталась помилка збереження!", false))
      }
    }

  if(!loaded){
    return <div>...Завантаження...</div>
  }

  return (
    <>
    <header>
        <div><img className='logo' src={Logo} alt="logo" /></div>
        <div>
            <PageSelector/>
            <h3>Додаткові витрати і звіт за {moment(dt).format("MM.YYYY")}</h3>
        </div>
    </header>
    <main>
        <Box
        className='cat-editable-area'
        component="form"
        sx={{
            '& > :not(style)': { m: 1,},
        }}
        noValidate
        autoComplete="off"
        >
            <NewRowForm addRowFn={handleAddRow.bind(this)} records={rows}/>
            {showDeleteButton && <Button variant='contained' color='error' onClick={handleDeleteRow}>Видалити</Button>}
            <Button variant='contained' onClick={saveToExcel}>Зберігти в Excel</Button>
        </Box>
        <DataGrid
            apiRef={apiRef}
            rows={rows}
            columns={columns}
            initialState={{
              sorting: {
                sortModel: [{ field: 'id', sort: 'desc' }],
            },
            pagination: {
                paginationModel: {
                pageSize: 10,
                },
            },
            }}
            pageSizeOptions={[10]}
            checkboxSelection
            disableRowSelectionOnClick
            slots={{ noRowsOverlay: CustomNoRowsOverlay }}
            sx={{ '--DataGrid-overlayHeight': '300px' }}
            autoHeight
            onRowSelectionModelChange={selectDeleteRows}
            onCellModesModelChange={handleModelChange}
        />
        <div className="about-manager">
          <div className="amount-expenses">Загальна сума: {totalExpenses}</div>
          <div className="control">
            <IconButton  color="primary" onClick={()=>handleDate(-1)}>
              <SkipPreviousIcon/>
            </IconButton>
            <Button onClick={getStatistic}>Розрахунок за {moment(dt).format("MM.YYYY")}</Button>
            <IconButton color="primary" onClick={()=>handleDate(1)}>
                <SkipNextIcon />
            </IconButton>
          </div>
        </div>
    </main>
    <ModalWindow open={showModalWindow} handleClose={()=>setShowModalWindow(false)} info={modalWindowInfo} day={dt}/>
    </>
  )
}

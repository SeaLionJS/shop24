import React, { useEffect, useState } from 'react'
import Logo from "../../Pics/logo_m.png"
import { DataGrid, useGridApiRef } from '@mui/x-data-grid';
import { useDispatch, useSelector } from 'react-redux';
import PageSelector from '../../Widgets/PageSelector';
import { Box, TextField, Button} from '@mui/material';
import NewRowForm from './NewRowForm';
import CustomNoRowsOverlay from '../../Widgets/NoTableData';

import { catalogueColumns as columns } from '../../data/tableFields';
import electronApi from '../../Controllers/electronApi';
import IDChanger from './IdChanger';

//для выбора определенных рядков
let selectedRows = []

export default function Catalogue() {
    const [showDeleteButton, setShowDeleteButton] = useState(false)

    const rows = useSelector(store=>store.goods)
    const [selectedId, setSelectedId] = useState(-1) 
    const [showIdSelector, setShowIdSelector] = useState(false) 

    const dispatch = useDispatch()
    
    const apiRef = useGridApiRef();

      const handleDeleteRow = () => {
        // selectedRows.forEach((id)=>{
        //   //console.log(id)
        //   apiRef.current.updateRows([{ id, _action: 'delete' }]);
        // })

        const newRows = rows.filter((e)=>!selectedRows.includes(e.id))
        dispatch({type: "SET_GOODS", payload: newRows})

        dispatch({type: "LOCK_PAGE"})
      };
    
      //For newRowForm
      const handleAddRow = (data) => {
        //console.log(data)
        const newRows = [...rows, data]
        dispatch({type: "SET_GOODS", payload: newRows})
        dispatch({type: "LOCK_PAGE"})
      };


      /////////////////////////////////////////////////////

    const onCellClick = (params)=>{
      //console.log(params)
      if(params.field !== "id") return
      setSelectedId(params.id)
      setShowIdSelector(true)
    }

    const selectDeleteRows = (rows)=>{
      selectedRows = rows
      if(rows.length && !showDeleteButton){
        setShowDeleteButton(true)
      }
      else if(!rows.length){
        setShowDeleteButton(false)
      }
    }

    function setNewId(newId){
      if(newId === null) {
        setShowIdSelector(false)
        return
      }

      const newRows = [...rows]
      for(let i in newRows){
        if(newRows[i].id == selectedId){
          newRows[i].id = newId
          break;
        }
      }
      setSelectedId(-1)
      dispatch({type: "SET_GOODS", payload: newRows})
      setShowIdSelector(false)
    }

    const saveToExcel = async ()=>{
      const models = apiRef.current.getRowModels()

      const arr = []
      models.forEach((row)=>arr.push(row))
      const res = await electronApi.saveCatalogue(arr)
      if(res.state == "success"){
        dispatch({type: "SHOW_MESSAGEBOX", 
        payload: {header: "Успіх", text: res.data,  
          onAccept:()=>dispatch({type:"HIDE_MESSAGEBOX"})}})

        dispatch({type: "SET_GOODS", payload: arr})
        dispatch({type: "UNLOCK_PAGE"})
      }
      else{
        dispatch({type: "SHOW_MESSAGEBOX", 
        payload: {header: "Помилка", text: res.data,  
          onAccept:()=>dispatch({type:"HIDE_MESSAGEBOX"})}})
      }
     }

  return (
    <>
    <header>
        <div><img className='logo' src={Logo} alt="logo" /></div>
        <div>
            <PageSelector/>
            <h3>Каталог товарів</h3>
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
            <NewRowForm addRowFn={handleAddRow.bind(this)} list={rows}/>
            {showDeleteButton && <Button variant='contained' color='error' onClick={handleDeleteRow}>Видалити</Button>}
            <Button variant='contained' onClick={saveToExcel}>Зберігти в Excel</Button>
        </Box>
        <DataGrid
            apiRef={apiRef}
            rows={rows}
            columns={columns}
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
            checkboxSelection
            disableRowSelectionOnClick
            slots={{ noRowsOverlay: CustomNoRowsOverlay }}
            sx={{ '--DataGrid-overlayHeight': '300px' }}
            autoHeight
            onRowSelectionModelChange={selectDeleteRows}
            onCellClick={onCellClick}
        />
    </main>
      <IDChanger  visible={showIdSelector} goods={rows} gid={selectedId} setId={setNewId.bind(this)}/>
    </>
  )
}



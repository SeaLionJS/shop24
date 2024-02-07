import React from 'react'
import { useState } from 'react'
import {TextField, Button} from '@mui/material';
import { useDispatch } from 'react-redux';

import createID, {nextID} from '../../Controllers/uniqueID';

const errorsNames = {
    name: {
      header:"Ошибка!", text:"Не вказано назву товара"
    },
    buy: {
      header:"Ошибка!", text:"Не вказано ціну закупівлі"
    },
    sell: {
      header:"Ошибка!", text:"Не вказано ціну продажу"
    }
  }


export default function NewRowForm({addRowFn, list}) {
    const [gname, setGName] = useState("")
    const [buyPrice, setBuyPrice] = useState(0)
    const [sellPrice, setSellPrice] = useState(0)
    const [notes, setNotes] = useState("")

    const dispatch = useDispatch()

    const addGoodHandle = ()=>{
        if(!gname.length){
          dispatch({type: "SHOW_MESSAGEBOX", 
          payload: {header: errorsNames.name.header, text: errorsNames.name.text,  
            onAccept:()=>dispatch({type:"HIDE_MESSAGEBOX"})}}
        )
        return
        }

        if(!buyPrice || buyPrice <= 0){
          dispatch({type: "SHOW_MESSAGEBOX", 
          payload: {header: errorsNames.buy.header, text: errorsNames.buy.text,  
            onAccept:()=>dispatch({type:"HIDE_MESSAGEBOX"})}}
        )
        return
        }

        if(!sellPrice || sellPrice <= 0){
          dispatch({type: "SHOW_MESSAGEBOX", 
          payload: {header: errorsNames.sell.header, text: errorsNames.sell.text,  
            onAccept:()=>dispatch({type:"HIDE_MESSAGEBOX"})}}
        )
        return
        }

        const newRecord = { id: nextID(list), 
          name: gname, 
          buy: buyPrice*1, 
          sell: sellPrice*1, 
          info: notes, 
          date: new Date() }

        setSellPrice(0)
        setBuyPrice(0)
        setGName("")
        setNotes("")

        addRowFn(newRecord)
    }

  return (
    <>
        <TextField 
            sx={{minWidth:400}}
            label="Назва товара" 
            variant="outlined" 
            value={gname}
            onChange={(e)=>setGName(e.target.value)}
        />
        <TextField 
            label="Ціна закупівлі" 
            variant="outlined" 
            type='number'
            value={buyPrice}
            onChange={(e)=>{
              setBuyPrice(e.target.value)
            }}
        />
        <TextField 
            label="Ціна продажу" 
            variant="outlined" 
            type='number'
            value={sellPrice}
            onChange={(e)=>{
              setSellPrice(e.target.value)
            }}
        />
        <TextField 
            label="Нотатки" 
            variant="outlined" 
            sx={{minWidth:400}}
            value={notes}
            onChange={(e)=>setNotes(e.target.value)}
        />
        <Button variant='contained' color='success' onClick={addGoodHandle.bind(this)}>Додати</Button>
    </>
  )
}

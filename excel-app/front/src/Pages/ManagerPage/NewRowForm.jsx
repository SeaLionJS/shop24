import React from 'react'
import { useState } from 'react'
import {TextField, Button} from '@mui/material';
import { useDispatch } from 'react-redux';

const errorsNames = {
    name: {
      header:"Помилка!", text:"Не вказано ім'я!"
    },
  }


export default function NewRowForm({addRowFn, records}) {
    const [gname, setGName] = useState("")
    const [price, setPrice] = useState(0)

    const dispatch = useDispatch()

    const addHandle = ()=>{
        if(!gname.length){
          dispatch({type: "SHOW_MESSAGEBOX", 
          payload: {header: errorsNames.name.header, text: errorsNames.name.text,  
            onAccept:()=>dispatch({type:"HIDE_MESSAGEBOX"})}}
        )
        return
        }

        const newRecord = {id: records[records.length - 1].id*1+1, 
          name: gname, 
          price}

        setGName("")
        setPrice(0);

        addRowFn(newRecord)
    }

  return (
    <>
        <TextField 
            sx={{minWidth:400}}
            label="Назва" 
            variant="outlined" 
            value={gname}
            onChange={(e)=>setGName(e.target.value)}
        />
        <TextField 
            label="Сума, грн" 
            variant="outlined" 
            type='number'
            value={price}
            onChange={(e)=>setPrice(e.target.value*1)}
        />
        <Button variant='contained' color='success' onClick={addHandle.bind(this)}>Додати</Button>
    </>
  )
}

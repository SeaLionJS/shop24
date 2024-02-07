import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
import "./style.css"

export default function Analizer({setNextPart}) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));


  const rows = useSelector(store=>store.goods)
  //console.log(rows)
  const errors = []

  for (let i=0; i< rows.length; i++){
    const refRow = rows[i]
    for(let j = i+1; j<rows.length; j++){
        //console.log(refRow, rows[j])
        if(refRow.id == rows[j].id){
            errors.push({v1: i, v2: j, id: refRow.id})
        }
    }
  }

  // console.log(errors)
  const errElems = errors.map((e, ind)=>{
    return (
        <div className='elem' key={ind}>
            <span>{ind+1})</span>
            <span>ID = {e.id}</span>
            <span>Рядок {e.v1 + 2} та рядок {e.v2 + 2}</span>
        </div>
    )
  })

  return (
      <Dialog
        fullScreen={fullScreen}
        open={true}
      >
        <DialogTitle>
          Перевірка кодів товарів
        </DialogTitle>
        <DialogContent>
            
            <div className='goods-index-errors'>
                {!errors.length && <h2>Помилок не знайдено!</h2>}
                {errors.length ? <h2>Є однакові коди товарів, змініть їх. Правильна робота при однакових кодах не гарантується!!!</h2> : ""}
                {errors.length ? errElems : ""}
            </div>
        </DialogContent>
        <DialogActions>
            <Button variant="outlined" color="success" onClick={setNextPart}>
                Ок
            </Button>
        </DialogActions>
      </Dialog>
  );
}

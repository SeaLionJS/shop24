import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { TextField } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useDispatch } from 'react-redux';


export default function IDChanger({visible, gid, setId, goods}) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const dispatch = useDispatch()

  const [newId, setNewId] = React.useState(0)
  const [isError, setIsError] = React.useState(true)


    const onChangeId = (e)=>{
        let v = e.target.value * 1
        if(v <= 0) {
            setIsError(true)
            setNewId(0)
            return
        }
        setNewId(v)

        let isGood = false

        for (let g of goods){
            if(g.id == v){
                isGood = true
                break
            }
        }

        setIsError(isGood)
    }

    const onSaveId = ()=>{
        //console.log(goods)
        if(isError){
            dispatch({type: "SHOW_MESSAGEBOX", 
            payload: {header: "Помилка", text: `Код ${newId} вже існує у каталогу або дорівнює 0`,  
              onAccept:()=>dispatch({type:"HIDE_MESSAGEBOX"})}})

            return
        }

        setId(newId)
    }

  return (
      <Dialog
        fullScreen={fullScreen}
        open={visible}
      >
        <DialogTitle>Зміна коду товара {gid}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            required
            id="name"
            color={ isError ? "error" : "success"}
            value={newId}
            onChange={onChangeId}
            label="Новий код"
            type="number"
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onSaveId}>Підтверджую</Button>
          <Button onClick={()=>setId(null)}>Відмінити</Button>
        </DialogActions>
      </Dialog>
  );
}

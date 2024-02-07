import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@mui/material';
import KeyIcon from '@mui/icons-material/Key';
import React, { useState } from 'react'
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import "./style.css"

///////////////////////////////////
//modal window
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };
  
function LoginWindow({open, setOpen}) {
    const pswdPattern = "1234"
    const [pswd, setPswd] = useState("")

    const handleAccept = ()=>{
        if(pswdPattern == pswd){
            setPswd("")
            setOpen(true)
        }
        else{
            setPswd("")
            setOpen(false)
        }
    }

    return (
        <Modal
          open={open}
          onClose={handleAccept}
        >
          <Box sx={style}>
            <Typography id="modal-title" variant="h4" component="h2">
              Введіть пароль:
            </Typography>
            <div className='pswd-field'>
                <input type="text"  value={pswd} onChange={(e)=>setPswd(e.target.value)}/>
            </div>
            <div className='pswd-field-buttons'>
                <Button variant='contained' color='success' onClick={handleAccept}>Готово</Button>
                <Button variant='contained' color='error' onClick={handleAccept}>Відміна</Button>
            </div>
          </Box>
        </Modal>
    );
  }
//////////////////////////////////////////



export default function PageSelector() {
    const {page, requiredConfirmation} = useSelector(store=>store.page)
    const dispatch = useDispatch()

    const [modalWindowOpen, setModalWindowOpen] = useState(false)

    const setOpenFn = (isOpen)=>{
        if(isOpen == true){
            dispatch({type:"SET_PAGE", payload: "MANAGER"})
          }
        setModalWindowOpen(false)
    }

    const handlePage = (page)=>{
        if(page == "MANAGER"){
            setModalWindowOpen(true)
        }
        else{
            dispatch({type:"SET_PAGE", payload: page})
        }
    }

    const changePageDialog = (page)=>{
        if(requiredConfirmation){
            dispatch({type: "SHOW_MESSAGEBOX", 
            payload:{header: "Увага", 
            text: "Є незбережені дані, які можуть бути втрачено!!!",
            onAccept: ()=>handlePage(page) ,
            onReject: ()=> dispatch({type: "HIDE_MESSAGEBOX"})     
          }})
        }
        else{
            handlePage(page)
        }
    }
    
  return (
    <>
        <div className='navigation'>
            <Button 
                variant={page == "CATALOGUE" ? "contained" : "outlined"}
                onClick = {()=>changePageDialog("CATALOGUE")}
            >
                Каталог товарів
            </Button>
            <Button 
                variant={page == "SALES" ? "contained" : "outlined"}
                onClick = {()=>changePageDialog("SALES")}
            >
                Журнал продажів
            </Button>
            <Button 
                startIcon={<KeyIcon />}  
                variant={page == "MANAGER" ? "contained" : "outlined"}
                onClick = {()=>changePageDialog("MANAGER")}
            >
                Зведення
            </Button>
        </div>
        <LoginWindow setOpen={setOpenFn} open={modalWindowOpen} />
    </>

  )
}

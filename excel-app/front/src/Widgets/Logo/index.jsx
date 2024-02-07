import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
import "./style.css"
import logo from "../../Pics/logo_m.png"
import logoback from "../../Pics/Logo.svg"

export default function LogoAnimation({setNextPart}) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  React.useEffect(()=>{
    setTimeout(setNextPart, 3000)
  },[])

  return (
      <Dialog
        fullScreen={fullScreen}
        open={true}
      >
        <DialogContent >
            <div className='animated-logo'>
            <img className='rotated-logo' src={logoback} alt="" />
            <img src={logo} className='developer-logo' alt="developer-logo" />
            </div>
            <h2>Created by Bohdan</h2>
        </DialogContent>
      </Dialog>
  );
}

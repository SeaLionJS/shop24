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

export default function MessageBox() {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const dispatch = useDispatch()


  const {visible, header, text, onAccept, onReject, isDefault} = useSelector(store=>store.messageBox)
  return (
      <Dialog
        fullScreen={fullScreen}
        open={visible}
        onClose={onReject}
      >
        <DialogTitle>
          {header}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {text}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          {onAccept &&(
            <Button variant="outlined" color="success" onClick={onAccept}>
                Ок
            </Button>
            )}
          {isDefault &&(
            <Button variant="outlined" color="success" onClick={()=>dispatch({type:"HIDE_MESSAGEBOX"})}>
                Ок
            </Button>
            )}
          {onReject &&(
            <Button variant="outlined" color="error" onClick={onReject}>
                Відміна
            </Button>
            )}
        </DialogActions>
      </Dialog>
  );
}

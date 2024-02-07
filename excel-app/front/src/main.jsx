import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import store from './Store/index'
import { Provider as ReduxProvider } from 'react-redux'
import { SnackbarProvider } from 'notistack'
import MessageBox from './Widgets/MessageBox'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {ukUA} from '@mui/x-data-grid';


const greenTheme = createTheme({
  palette: {
    // primary: {
    //   main: "rgb(0,255,0)",
    // },
  },
}, ukUA);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={greenTheme}>
    <ReduxProvider store={store}>
        <SnackbarProvider autoHideDuration={5000} maxSnack={3}>
            <App />
        </SnackbarProvider>
        <MessageBox/>
      </ReduxProvider>
    </ThemeProvider>
  </React.StrictMode>,
)

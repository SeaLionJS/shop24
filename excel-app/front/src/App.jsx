import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Loader from './Widgets/Loader'

import Catalogue from './Pages/Catalogue'
import ManagerPage from './Pages/ManagerPage'
import SaleList from './Pages/SaleList'

import electronApi from './Controllers/electronApi'
import Analizer from './Widgets/Analizer'
import LogoAnimation from './Widgets/Logo'

//"CATALOGUE", "SALES", "MANAGER"

export default function App() {
  const {page, requiredConfirmation} = useSelector(store=>store.page)
  const dispatch = useDispatch() 

  electronApi.subscribe((function(data){
    //console.log(data.type, requiredConfirmation)
    if(data.type=="EXIT_APP" && requiredConfirmation){
      dispatch({type: "SHOW_MESSAGEBOX", 
      payload: {header: "Увага", text: "Ви маєте незбережену інформацію!!! Ви дійсно хочете вийти?",  
        onReject:()=>dispatch({type:"HIDE_MESSAGEBOX"}),
        onAccept:()=> electronApi.exit()     
      }})
    }
    else{
      electronApi.exit() 
    }
  }).bind(this))

  const [loaded, isLoaded] = useState(0)
  
  useEffect(async ()=>{
    const res = await electronApi.getCatalogue()

    //console.log(res)

    if(res.state == "success" && res.data.length){
      dispatch({type: "SET_GOODS", payload: res.data})
      isLoaded(1);
    }
    else{
      if(!res){
        dispatch({type: "SHOW_MESSAGEBOX", 
        payload: {header: "Помилка", text: "Сталась помилка!",  
          onAccept:()=>dispatch({type:"HIDE_MESSAGEBOX"})}})

          isLoaded(3);
      }
      else if(res.state == "warning"){
        dispatch({type: "SHOW_MESSAGEBOX", 
        payload: {header: "Увага!", text: res.data,  
          onAccept:()=>dispatch({type:"HIDE_MESSAGEBOX"})}})

        isLoaded(3);
      }
    }
    
  },[])

  if(loaded == 0) return <Loader visible/>
  if(loaded == 1) return <LogoAnimation setNextPart={()=>isLoaded(2)}/>
  if(loaded == 2) return <Analizer setNextPart={()=>isLoaded(3)}/>

  switch(page){
    case "CATALOGUE": return <Catalogue/>
    case "SALES": return <SaleList/>
    case "MANAGER": return <ManagerPage/>
    default: return <SaleList/>
  }
}

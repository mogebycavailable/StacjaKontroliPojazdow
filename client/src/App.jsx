import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
//import './App.css'
import {BrowserRouter, Routes, Route} from 'react-router-dom'

import Strona_glowna from './components/Strona_glowna/Strona_glowna'
import O_nas from './components/O_nas/O_nas'
import Moje_konto from './components/Moje_konto/Moje_konto'
import Moje_pojazdy from './components/Moje_pojazdy/Moje_pojazdy'
import Moje_rezerwacje from './components/Moje_rezerwacje/Moje_rezerwacje'
import Zamow_usluge from './components/Zamow_usluge/Zamow_usluge'
import Rejestracja from './components/Rejestracja/Rejestracja'
import Logowanie from './components/Logowanie/Logowanie'

function App() {

  return (
    <Routes>
      <Route path='/' element={<Strona_glowna/>}/>
      <Route path='/o_nas' exact element={<O_nas/>}/>
      <Route path='/moje_konto' exact element={<Moje_konto/>}/>
      <Route path='/moje_pojazdy' exact element={<Moje_pojazdy/>}/>
      <Route path='/moje_rezerwacje' exact element={<Moje_rezerwacje/>}/>
      <Route path='/zamow_usluge' exact element={<Zamow_usluge/>}/>
      <Route path='/rejestracja' exact element={<Rejestracja/>}/>
      <Route path='/logowanie' exact element={<Logowanie/>}/>
    </Routes>
  )
}

export default App

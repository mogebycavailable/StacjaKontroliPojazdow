import { useState, useEffect } from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom'

import Menu from './components/Menu/Menu'
import Footer from './components/Footer/Footer'
import StronaGlowna from './components/Strona_glowna/StronaGlowna'
import ONas from './components/O_nas/ONas'
import MojeKonto from './components/Moje_konto/MojeKonto'
import MojePojazdy from './components/Moje_pojazdy/MojePojazdy'
import DodajPojazd from './components/Moje_pojazdy/DodajPojazd'
import EdytujPojazd from './components/Moje_pojazdy/EdytujPojazd'
import MojeRezerwacje from './components/Moje_rezerwacje/MojeRezerwacje'
import ZamowUsluge from './components/Zamow_usluge/ZamowUsluge'
import Rejestracja from './components/Rejestracja/Rejestracja'
import Logowanie from './components/Logowanie/Logowanie'

function App() {
  const [user, setUser] = useState(null)
  const [isLogged, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const userToken = localStorage.getItem('authToken')
    setUser(userToken)
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken')
    console.log("Usunięcie tokenu uwierzytelniającego użytkownika")
    setIsLoggedIn(false)
    console.log("Wylogowanie użytkownika")
  };

  return (
    <BrowserRouter>
      <div>
        <Menu />
        <div>
          <Routes>
            <Route path='/' element={<StronaGlowna/>}/>
            <Route path='/o_nas' exact element={<ONas/>}/>
            { user && <Route path='/moje_konto' exact element={<MojeKonto onLogout={handleLogout}/>}/> }
            { user && <Route path='/moje_pojazdy' exact element={<MojePojazdy/>}/> }
            { user && <Route path='/moje_pojazdy/dodaj_pojazd' exact element={<DodajPojazd/>}/> }
            { user && <Route path='/moje_pojazdy/edytuj_pojazd/:id' exact element={<EdytujPojazd/>}/> }
            { user && <Route path='/moje_rezerwacje' exact element={<MojeRezerwacje/>}/> }
            { user && <Route path='/zamow_usluge' exact element={<ZamowUsluge/>}/> }
            { !user && <Route path='/rejestracja' exact element={<Rejestracja/>}/> }
            { !user && <Route path='/logowanie' exact element={<Logowanie onLogin={setUser} />}/> }
          </Routes>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App

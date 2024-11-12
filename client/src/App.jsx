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
  const [token, setToken] = useState(null)
  const [user, setUser] = useState(null)
  const [isLogged, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const userToken = localStorage.getItem('authToken')
    const userData = localStorage.getItem('userData')
    setToken(userToken)
    setUser(userData)
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('userData')
    setToken(null)
    setUser(null)
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
            { token && <Route path='/moje_pojazdy' exact element={<MojePojazdy/>}/> }
            { token && <Route path='/moje_pojazdy/dodaj_pojazd' exact element={<DodajPojazd/>}/> }
            { token && <Route path='/moje_pojazdy/edytuj_pojazd/:id' exact element={<EdytujPojazd/>}/> }
            { token && <Route path='/moje_rezerwacje' exact element={<MojeRezerwacje/>}/> }
            { token && <Route path='/zamow_usluge' exact element={<ZamowUsluge/>}/> }
            { token && <Route path='/moje_konto' exact element={<MojeKonto onLogout={handleLogout}/>}/> }
            { !token && <Route path='/rejestracja' exact element={<Rejestracja/>}/> }
            { !token && <Route path='/logowanie' exact element={<Logowanie onLogin={setToken} />}/> }
          </Routes>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App

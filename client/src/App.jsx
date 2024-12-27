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
import EdytujRezerwacje from './components/Moje_rezerwacje/EdytujRezerwacje'
import ZamowUsluge from './components/Zamow_usluge/ZamowUsluge'
import Rejestracja from './components/Rejestracja/Rejestracja'
import Logowanie from './components/Logowanie/Logowanie'

function App() {
  const [accessToken, setAccessToken] = useState(null)
  const [refreshToken, setRefreshToken] = useState(null)
  const [role, setRole] = useState(null)
  const [isLogged, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const accessTokenLocal = localStorage.getItem('access-token')
    const refreshTokenLocal = localStorage.getItem('refresh-token')
    const roleLocal = localStorage.getItem('role')
    setAccessToken(accessTokenLocal)
    setRefreshToken(refreshTokenLocal)
    setRole(roleLocal)
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access-token')
    localStorage.removeItem('refresh-token')
    localStorage.removeItem('role')
    setAccessToken(null)
    setRefreshToken(null)
    setRole(null)
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
            { accessToken && <Route path='/moje_pojazdy' exact element={<MojePojazdy/>}/> }
            { accessToken && <Route path='/moje_pojazdy/dodaj_pojazd' exact element={<DodajPojazd/>}/> }
            { accessToken && <Route path='/moje_pojazdy/edytuj_pojazd/:id' exact element={<EdytujPojazd/>}/> }
            { accessToken && <Route path='/moje_rezerwacje' exact element={<MojeRezerwacje/>}/> }
            { accessToken && <Route path='/moje_rezerwacje/edytuj_rezerwacje/:id' exact element={<EdytujRezerwacje/>}/> }
            { accessToken && <Route path='/zamow_usluge' exact element={<ZamowUsluge/>}/> }
            { accessToken && <Route path='/moje_konto' exact element={<MojeKonto onLogout={handleLogout}/>}/> }
            { !accessToken && <Route path='/rejestracja' exact element={<Rejestracja onRegister={setAccessToken}/>}/> }
            { !accessToken && <Route path='/logowanie' exact element={<Logowanie onLogin={setAccessToken} />}/>}
          </Routes>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App
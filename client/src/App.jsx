import { useState, useEffect } from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom'

import Menu from './components/Menu/Menu'
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
import PanelPracownika from './components/Panel_Pracownika/PanelPracownika'
import ZarzadzanieBadaniami from './components/Panel_Pracownika/Zarzadzanie_badaniami/Zarzadzanie_badaniami'
import PanelAdministratora from './components/Panel_Administratora/PanelAdministratora'
import Stanowiska from './components/Panel_Administratora/Stanowiska/Stanowiska'
import TydzienPracy from './components/Panel_Administratora/TydzienPracy/TydzienPracy'
import Kalendarz from './components/Panel_Administratora/Kalendarz/Kalendarz'
import Pracownicy from './components/Panel_Administratora/Pracownicy/Pracownicy'
import Klienci from './components/Panel_Administratora/Klienci/Klienci'
import Rezerwacje from './components/Panel_Administratora/Rezerwacje/Rezerwacje'

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
    window.location.assign('/logowanie')
  };

  return (
    <BrowserRouter>
      <div>
        <Menu onLogout={handleLogout}/>
        <div>
          <Routes>
            <Route path='/' element={<StronaGlowna/>}/>
            <Route path='/o_nas' exact element={<ONas/>}/>
            { accessToken && <Route path='/moje_pojazdy' exact element={<MojePojazdy/>}/> }
            { accessToken && <Route path='/moje_pojazdy/dodaj_pojazd' exact element={<DodajPojazd/>}/> }
            { accessToken && <Route path='/moje_pojazdy/edytuj_pojazd/:id' exact element={<EdytujPojazd/>}/> }
            { accessToken && <Route path='/moje_rezerwacje' exact element={<MojeRezerwacje/>}/> }
            { accessToken && <Route path='/zamow_usluge' exact element={<ZamowUsluge/>}/> }
            { accessToken && <Route path='/moje_konto' exact element={<MojeKonto onLogout={handleLogout}/>}/> }
            { accessToken && (role === 'ROLE_WORKER' || role === 'ROLE_ADMIN') && <Route path='/panel_pracownika' exact element={<PanelPracownika/>}/> }
            { accessToken && (role === 'ROLE_WORKER' || role === 'ROLE_ADMIN') && <Route path='/panel_pracownika/zarzadzanie_badaniami/:standId/:standName/:date' exact element={<ZarzadzanieBadaniami/>}/> }
            { accessToken && role === 'ROLE_ADMIN' && <Route path='/panel_administratora' exact element={<PanelAdministratora/>}/> }
            { accessToken && role === 'ROLE_ADMIN' && <Route path='/panel_administratora/stanowiska' exact element={<Stanowiska/>}/> }
            { accessToken && role === 'ROLE_ADMIN' && <Route path='/panel_administratora/tydzien_pracy' exact element={<TydzienPracy/>}/> }
            { accessToken && role === 'ROLE_ADMIN' && <Route path='/panel_administratora/kalendarz' exact element={<Kalendarz/>}/> }
            { accessToken && role === 'ROLE_ADMIN' && <Route path='/panel_administratora/pracownicy' exact element={<Pracownicy/>}/> }
            { accessToken && role === 'ROLE_ADMIN' && <Route path='/panel_administratora/klienci' exact element={<Klienci/>}/> }
            { accessToken && role === 'ROLE_ADMIN' && <Route path='/panel_administratora/rezerwacje' exact element={<Rezerwacje/>}/> }
            { !accessToken && <Route path='/rejestracja' exact element={<Rejestracja onRegister={setAccessToken}/>}/> }
            { !accessToken && <Route path='/logowanie' exact element={<Logowanie onLogin={setAccessToken} />}/>}
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App
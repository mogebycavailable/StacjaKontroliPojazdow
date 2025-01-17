import React from 'react';
import { Link } from "react-router-dom"
import '../css/Style.css'
import logo from '../css/img/mechanik-alpha.png';

const Menu = ({ onLogout }) => {
    const token = localStorage.getItem('access-token')
    const role = localStorage.getItem('role')

    return(
        <header>
            <div>
                <Link to="/">
                    <img src={logo}/>
                </Link>
                <h1>Stacja Kontroli Pojazdów</h1>
            </div>
            <nav>
                <ul>
                    <Link to="/">Strona główna</Link>
                    <Link to="/o_nas">O nas</Link>
                    { token && <Link to="/moje_pojazdy">Moje pojazdy</Link> }
                    { token && <Link to="/moje_rezerwacje">Moje rezerwacje</Link> }
                    { token && <Link to="/zamow_usluge">Zamów usługę</Link> }
                    { token && <Link to="/moje_konto">Moje konto</Link> }
                    { !token && <Link to="/logowanie">Zaloguj się</Link> }
                    { !token && <Link to="/rejestracja">Zarejestruj się</Link> }
                    { token && (role === 'ROLE_WORKER' || role === 'ROLE_ADMIN') && <Link to="/panel_pracownika">Panel pracownika</Link> }
                    { token && role === 'ROLE_ADMIN' && <Link to="/panel_administratora">Panel administratora</Link> }
                    { token && <Link to='/' onClick={onLogout}>Wyloguj się</Link> }
                </ul>
            </nav>
        </header>
    )
}

export default Menu
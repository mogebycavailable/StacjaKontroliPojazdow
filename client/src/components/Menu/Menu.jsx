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
                <a href="/">
                    <img src={logo}/>
                </a>
                <h1>Stacja Kontroli Pojazdów</h1>
            </div>
            <nav>
                <ul>
                    <Link to="/" className="btn">Strona główna</Link>
                    <Link to="/o_nas" className="btn">O nas</Link>
                    { token && <Link to="/moje_pojazdy" className="btn">Moje pojazdy</Link> }
                    { token && <Link to="/moje_rezerwacje" className="btn">Moje rezerwacje</Link> }
                    { token && <Link to="/zamow_usluge" className="btn">Zamów usługę</Link> }
                    { token && <Link to="/moje_konto" className="btn">Moje konto</Link> }
                    { !token && <Link to="/logowanie" className="btn">Zaloguj się</Link> }
                    { !token && <Link to="/rejestracja" className="btn">Zarejestruj się</Link> }
                    { token && (role === 'ROLE_WORKER' || role === 'ROLE_ADMIN') && <Link to="/panel_pracownika" className="btn">Panel pracownika</Link> }
                    { token && role === 'ROLE_ADMIN' && <Link to="/panel_administratora" className="btn">Panel administratora</Link> }
                    { token && <Link to='/' className="btn" onClick={onLogout}>Wyloguj się</Link> }
                </ul>
            </nav>
        </header>
    )
}

export default Menu
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom"
import '../css/Style.css'
import '../css/formstyle.css'
import logo from '../css/img/mechanik-alpha.png';


const Rejestracja = () => {
    const [data, setData] = useState({
        name: "",
        surname: "",
        email: "",
        phone_nr: "",
        password: "",
    })

    const handleChange = ({ currentTarget: input }) => {
        setData({ ...data, [input.name]: input.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const url = process.env.REGISTER_API_URL+"/api/users"
            const { data: res } = await axios.post(url, data)
            navigate("/login")
            console.log(res.message)
        } catch (error) {
            if (
                error.response &&
                error.response.status >= 400 &&
                error.response.status <= 500
            ) {
                setError(error.response.data.message)
            }
        }
    }

    return(
        <div className='div-body'>
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
                        <Link to="/moje_konto" className="btn">Moje konto</Link>
                        <Link to="/moje_pojazdy" className="btn">Moje pojazdy</Link>
                        <Link to="/moje_rezerwacje" className="btn">Moje rezerwacje</Link>
                        <Link to="/zamow_usluge" className="btn">Zamów usługę</Link>
                        <Link to="/logowanie" className="btn">Zaloguj się</Link>
                        <Link to="/rejestracja" className="btn">Zarejestruj się</Link>
                    </ul>
                </nav>
            </header>
            <h2>Rejestracja do serwisu</h2>
            <form onSubmit={handleSubmit}>
                <div className='form'>
                    <label>Imię</label>
                    <input
                        type="text"
                        placeholder="Wprowadź imię"
                        name="name"
                        onChange={handleChange}
                        value={data.name}
                        required
                    />

                    <label>Nazwisko</label>
                    <input
                        type="text"
                        placeholder="Wprowadź nazwisko"
                        name="surname"
                        onChange={handleChange}
                        value={data.surname}
                        required
                    />

                    <label>E-mail</label>
                    <input 
                        type="email"
                        placeholder="Wprowadź adres e-mail"
                        name="email"
                        onChange={handleChange}
                        value={data.email}
                        required
                    />		
                    
                    <label htmlFor="pass">Hasło</label>
                    <input
                        type="password"
                        placeholder="Wprowadź hasło"
                        name="password"
                        onChange={handleChange}
                        value={data.password}
                        required
                    />
                    
                    <label htmlFor="passrpt">Powtórz hasło</label>
                    <input type="password" placeholder="Powtórz hasło" id="passrpt"/>
                    <br/>
                    <label className="policy"><input type="checkbox" id="policy"/> Akceptuję <a href="https://pl.wikipedia.org/wiki/Regulamin" target="_blank">regulamin</a> i <a href="https://pl.wikipedia.org/wiki/Polityka_prywatno%C5%9Bci" target="_blank">politykę prywatności</a>
                    </label>
                    
                    <input type="submit" value="Zarejestruj się"/>
                </div>
            </form>
        </div>
    );
};

export default Rejestracja;
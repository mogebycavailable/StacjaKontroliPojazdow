import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom"
import '../css/Style.css'
import '../css/formstyle.css'

const Logowanie = () => {
    const navigate = useNavigate()
    const [data, setData] = useState({
        email: "",
        haslo: "",
        token: ""
    })

    const loginToAccount = async() => {
        localStorage.setItem('authToken', token)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        loginToAccount()
    }

    return(
        <div className='div-body'>
            <h2>Logowanie do serwisu</h2>
            <form onSubmit={handleSubmit}>
                <div className='form'>
                    <label>E-mail</label>
                    <input
                        type="text"
                        placeholder="Wprowadź e-mail"
                        name="email"
                        onChange={(e) => setData((prevData) => ({ ...prevData, email: e.target.value }))}
                        required
                    />

                    <label>Hasło</label>
                    <input
                        type="password"
                        placeholder="Wprowadź hasło"
                        name="haslo"
                        onChange={(e) => setData((prevData) => ({ ...prevData, haslo: e.target.value }))}
                        required
                    />
                    
                    <br/>
                    <a href="https://pl.wikipedia.org/wiki/Has%C5%82o" target="_blank">Zapomniałem hasła</a>

                    <input type="submit" value="Zaloguj się"/>
                </div>
            </form>
	    </div>
    );
};

export default Logowanie;
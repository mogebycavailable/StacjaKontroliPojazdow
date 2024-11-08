import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom"
import '../css/Style.css'
import '../css/formstyle.css'

const Logowanie = ({ onLogin }) => {
    const navigate = useNavigate()
    const [data, setData] = useState({
        email: "",
        haslo: "",
        error: ""
    })

    const validData = data.email && data.haslo

    const loginToAccount = async() => {
        const response = await fetch(`http://localhost:3000/users?email=${data.email}`)
        const users = await response.json()
        const user = users.find((user) => user.password === data.password)

        if(user){
            const token = `token_${Date.now()}`
            localStorage.setItem('authToken', token)
            setData({ ...data, error: "" })
            onLogin(token)
            console.log("Utworzenie tokenu uwierzytelniającego i zalogowanie użytkownika")
            navigate('/')
        }else{
            setData((prevData) => ({ ...prevData, error: 'Nieprawidłowy email lub hasło.' }))
        }
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
                        autoComplete="email"
                        onChange={(e) => setData((prevData) => ({ ...prevData, email: e.target.value }))}
                        required
                    />

                    <label>Hasło</label>
                    <input
                        type="password"
                        placeholder="Wprowadź hasło"
                        name="haslo"
                        autoComplete="current-password"
                        onChange={(e) => setData((prevData) => ({ ...prevData, haslo: e.target.value }))}
                        required
                    />
                    
                    <br/>
                    <a href="https://pl.wikipedia.org/wiki/Has%C5%82o" target="_blank">Zapomniałem hasła</a>

                    { validData && (
                        <button type="submit">Zaloguj się</button>
                    )}
                    {data.error && <p style={{ color: 'red' }}>{data.error}</p>}
                </div>
            </form>
	    </div>
    );
};

export default Logowanie;
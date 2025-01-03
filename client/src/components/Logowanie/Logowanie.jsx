import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom"
import '../css/Style.css'
import '../css/formstyle.css'

const Logowanie = ({ onLogin }) => {
    const navigate = useNavigate()
    const [error, setError] = useState("")
    const [data, setData] = useState({
        email: "root@skp.pl",
        pwdHash: "root"
    })

    const validData = data.email && data.pwdHash

    const handleChange = ({ currentTarget: input }) => {
        setData({ ...data, [input.name]: input.value })
    }
    
    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const url = "http://localhost:8080/api/login"
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })
			
            if(response.ok){
                const user = await response.json()
                localStorage.setItem("access-token", user.accessToken)
                localStorage.setItem("refresh-token", user.refreshToken)
                localStorage.setItem("role", user.role)
                navigate('/')
                window.location.reload()
            }else if (response.status === 403){
                setError("Niepoprawne dane logowania. Spróbuj ponownie.");
            }else {
                setError(`Wystąpił błąd: ${response.status} ${response.statusText}`);
            }
        } catch (error) {
            setError("Nie udało się połączyć z serwerem. Spróbuj ponownie później.");
        }
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
                        value={data.email}
                        onChange={handleChange}
                        required
                    />

                    <label>Hasło</label>
                    <input
                        type="password"
                        placeholder="Wprowadź hasło"
                        name="pwdHash"
                        autoComplete="current-password"
                        value={data.pwdHash}
                        onChange={handleChange}
                        required
                    />
                    
                    <br/>
                    <a href="https://pl.wikipedia.org/wiki/Has%C5%82o" target="_blank">Zapomniałem hasła</a>

                    { validData && (
                        <button type="submit">Zaloguj się</button>
                    )}
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                </div>
            </form>
	    </div>
    );
};

export default Logowanie;
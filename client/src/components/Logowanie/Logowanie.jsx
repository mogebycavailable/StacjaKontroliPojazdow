import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom"
import '../css/Style.css'
import '../css/formstyle.css'

const Logowanie = ({ onLogin }) => {
    const navigate = useNavigate()
    const [data, setData] = useState({
        email: "",
        pwdHash: ""
    })

    const validData = data.email && data.pwdHash
    
    
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
			
              
            const user = await response.json()
			console.log(user)
            localStorage.setItem("access-token", user.accessToken)
            localStorage.setItem("refresh-token", user.refreshToken)
            localStorage.setItem("role", user.role)
			navigate('/')
			window.location.reload()
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
                        name="pwdHash"
                        autoComplete="current-password"
                        onChange={(e) => setData((prevData) => ({ ...prevData, pwdHash: e.target.value }))}
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
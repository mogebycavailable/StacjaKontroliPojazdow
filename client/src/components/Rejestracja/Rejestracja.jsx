import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom"
import '../css/Style.css'
import '../css/formstyle.css'

const Rejestracja = ({ onRegister }) => {
    const navigate = useNavigate()
    const [error, setError] = useState("")
    const [data, setData] = useState({
        name: "",
        surname: "",
        email: "",
        phone: "",
        pwdHash: "",
        confirmPwdHash: "",
        policy: false
    })

    const validData = data.name && data.surname && data.email && data.phone && data.pwdHash && data.confirmPwdHash && data.policy && (data.pwdHash === data.confirmPwdHash)

    const handleChange = ({ currentTarget: input }) => {
        setData({ ...data, [input.name]: input.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        const userData = { 
            name: data.name,
            surname: data.surname,
            email: data.email,
            phone: data.phone,
            pwdHash: data.pwdHash
        }
		
		try {
            const url = "http://localhost:8080/api/register"
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            })

            if(response.ok) {
                const user = await response.json()
                console.log("Dodano nowego użytkownika")
                localStorage.setItem("access-token", user.accessToken)
                localStorage.setItem("refresh-token", user.refreshToken)
                localStorage.setItem("role", user.role)
                navigate('/')
                window.location.reload()
            }else if (response.status === 400){
                setError("Istnieje już konto o podanym adresie e-mail!");
            }else {
                setError(`Wystąpił błąd: ${response.status} ${response.statusText}`);
            }
        } catch (error) {
            setError("Nie udało się połączyć z serwerem. Spróbuj ponownie później.")
        }
    }

    return(
        <div className='div-body'>
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

                    <label>Nr telefonu</label>
                    <input 
                        type="phone"
                        placeholder="Wprowadź nr telefonu"
                        name="phone"
                        onChange={handleChange}
                        value={data.phone}
                        required
                    />			
                    
                    <label>Hasło</label>
                    <input
                        type="password"
                        placeholder="Wprowadź hasło"
                        name="pwdHash"
                        autoComplete="new-password"
                        onChange={handleChange}
                        value={data.pwdHash}
                        required
                    />
                    
                    <label>Powtórz hasło</label>
                    <input
                        type="password"
                        placeholder="Powtórz hasło"
                        name="confirmPwdHash"
                        autoComplete="off"
                        onChange={handleChange}
                        value={data.confirmPwdHash}
                        required
                    />
                    <br/>
                    <label className="policy">
                        <input type="checkbox" id="policy" checked={data.policy} onChange={(e) => setData((prevData) => ({ ...prevData, policy: e.target.checked }))} />
                        Akceptuję <a href="https://pl.wikipedia.org/wiki/Regulamin" target="_blank">regulamin</a> i <a href="https://pl.wikipedia.org/wiki/Polityka_prywatno%C5%9Bci" target="_blank">politykę prywatności</a>
                    </label>
                    { validData && (
                        <button type="submit">Zarejestruj się</button>
                    )}
                    { error && (
                        <p style={{ color: 'red' }}>
                            {error}
                        </p>
                    )}
                </div>
            </form>
        </div>
    );
};

export default Rejestracja;
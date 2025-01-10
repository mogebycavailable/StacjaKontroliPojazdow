import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom"
import { toast, ToastContainer } from 'react-toastify'
import '../css/Style.css'
import '../css/formstyle.css'
import apiRequest from '../../service/restApiService'

const Rejestracja = ({ onRegister }) => {
    const [isBlocked, setIsBlocked] = useState(false)
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

        const url = "http://localhost:8080/api/register"

        await apiRequest({
            url,
            method: 'POST',
            body: userData,
            onSuccess: ((status, data) => {
                localStorage.setItem("access-token", data.accessToken)
                localStorage.setItem("refresh-token", data.refreshToken)
                localStorage.setItem("role", data.role)
                toast.success(
                    <div>
                        Pomyślnie zarejestrowano konto
                    </div>,
                    {
                    onOpen: () => setIsBlocked(true),
                    onClose: () => {
                        window.location.assign('/')
                        setIsBlocked(false)
                    },
                    autoClose: 3000,
                })
            }),
            onError: ((status, data) => {
                toast.error(data, {
                    autoClose: 3000,
                })
            }),
        })
    }

    return(
        <div className='div-body'>
            {isBlocked && (<div className="overlay"></div>)}
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
            <ToastContainer 
                position="top-center"
                theme="dark"
                closeOnClick={true}
            />
        </div>
    );
};

export default Rejestracja;
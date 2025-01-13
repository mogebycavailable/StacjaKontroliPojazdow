import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom"
import { toast, ToastContainer } from 'react-toastify'
import '../css/Style.css'
//import '../css/formstyle.css'
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

    const handleChange = ({ currentTarget: input }) => {
        setData({ ...data, [input.name]: input.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const validData = data.pwdHash === data.confirmPwdHash
        if(validData) {
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
        } else {
            toast.error("Podane hasła nie są identyczne!" ,
            {
                onClose: () => { setIsBlocked(false) },
                autoClose: 3000
            })
        }
    }

    return(
        <div>
            {isBlocked && (<div className="overlay"></div>)}
            <h2>Rejestracja do serwisu</h2>
            <main>
                <fieldset className='fieldset-form'>
                    <legend>Zaloguj się</legend>
                    <form onSubmit={handleSubmit}>
                        <div className='form-group'>
                            <label>Imię:</label>
                            <input
                                type="text"
                                placeholder="Wprowadź imię"
                                name="name"
                                onChange={handleChange}
                                value={data.name}
                                required
                            />
                        </div>

                        <div className='form-group'>
                            <label>Nazwisko:</label>
                            <input
                                type="text"
                                placeholder="Wprowadź nazwisko"
                                name="surname"
                                onChange={handleChange}
                                value={data.surname}
                                required
                            />
                        </div>

                        <div className='form-group'>
                            <label>E-mail:</label>
                            <input 
                                type="email"
                                placeholder="Wprowadź adres e-mail"
                                name="email"
                                onChange={handleChange}
                                value={data.email}
                                required
                            />
                        </div>

                        <div className='form-group'>
                            <label>Nr telefonu:</label>
                            <input 
                                type="phone"
                                placeholder="Wprowadź nr telefonu"
                                name="phone"
                                onChange={handleChange}
                                value={data.phone}
                                required
                            />
                        </div>

                        <div className='form-group'>   
                            <label>Hasło:</label>
                            <input
                                type="password"
                                placeholder="Wprowadź hasło"
                                name="pwdHash"
                                autoComplete="new-password"
                                onChange={handleChange}
                                value={data.pwdHash}
                                required
                            />
                        </div>

                        <div className='form-group'>  
                            <label>Powtórz hasło:</label>
                            <input
                                type="password"
                                placeholder="Powtórz hasło"
                                name="confirmPwdHash"
                                autoComplete="off"
                                onChange={handleChange}
                                value={data.confirmPwdHash}
                                required
                            />
                        </div>

                        <div className='btns'>
                            <label className="policy">
                                <input type="checkbox" id="policy" required checked={data.policy} onChange={(e) => setData((prevData) => ({ ...prevData, policy: e.target.checked }))} />
                                Akceptuję <a href="https://pl.wikipedia.org/wiki/Regulamin" target="_blank">regulamin</a> i <a href="https://pl.wikipedia.org/wiki/Polityka_prywatno%C5%9Bci" target="_blank">politykę prywatności</a>
                            </label>
                        </div>

                        <div className='btns'>
                            <button type='submit'>Zarejestruj się</button>
                        </div>
                    </form>
                </fieldset>
            </main>
            <ToastContainer 
                position="top-center"
                theme="dark"
                closeOnClick={true}
            />
        </div>
    );
};

export default Rejestracja;
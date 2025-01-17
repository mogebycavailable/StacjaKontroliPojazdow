import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify'
import '../css/Style.css'
import apiRequest from '../../service/restApiService'

const Logowanie = ({ onLogin }) => {
    const [isBlocked, setIsBlocked] = useState(false)
    const [data, setData] = useState({
        email: '',
        pwdHash: ''
    })

    const handleChange = ({ currentTarget: input }) => {
        setData({ ...data, [input.name]: input.value })
    }
    
    const handleSubmit = async (e) => {
        e.preventDefault()

        const url = "http://localhost:8080/api/login"

        await apiRequest({
            url,
            method: 'POST',
            body: data,
            onSuccess: ((status, data) => {
                localStorage.setItem("access-token", data.accessToken)
                localStorage.setItem("refresh-token", data.refreshToken)
                localStorage.setItem("role", data.role)
                toast.success(
                    <div>
                        Pomyślne logowanie do konta
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
                toast.error(
                    <div>
                        Niepoprawne dane logowania. Spróbuj ponownie.
                    </div>, 
                    {
                    autoClose: 3000,
                })
            }),
        })
    }   

    return(
        <div>
            {isBlocked && (<div className="overlay"></div>)}
            <h2>Logowanie do serwisu</h2>
            <main>
                <fieldset className='fieldset-form'>
                    <legend>Zaloguj się</legend>
                    <form onSubmit={handleSubmit}>
                        <div className='form-group'>
                            <label>E-mail:</label>
                            <input
                                type="text"
                                placeholder="Wprowadź e-mail"
                                name="email"
                                autoComplete="email"
                                value={data.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className='form-group'>
                            <label>Hasło:</label>
                            <input
                                type="password"
                                placeholder="Wprowadź hasło"
                                name="pwdHash"
                                autoComplete="current-password"
                                value={data.pwdHash}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className='btns'>
                            <button tyoe='submit'>Zaloguj</button>
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
    )
}

export default Logowanie
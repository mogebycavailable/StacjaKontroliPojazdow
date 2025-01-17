import React, { useState, useEffect } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import '../css/Style.css'
import styles from './MojeKonto.module.css'
import user_icon from '../css/img/user.png'
import useRefresh from '../../service/useRefresh'
import apiRequest from '../../service/restApiService'

const MojeKonto = ({ onLogout }) => {
    const [isBlocked, setIsBlocked] = useState(false)
    const role = localStorage.getItem('role')
    const refreshTokens = useRefresh()
    const [data, setData] = useState([])

    const [newData, setNewData] = useState({
        name: '',
        surname: '',
        email: '',
        phone: ''
    })

    const [editPwd, editNewPwd] = useState({
        oldPassword: '',
        newPassword: '',
        confirmNewPassword: ''
    })

    const [toDelete, setToDelete] = useState({
        password: ''
    })

    const [isEditingData, setIsEditingData] = useState(false)
    const [isEditingPwd, setIsEditingPwd] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    const validPassword = (pwd) => {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,26}$/
        return regex.test(pwd)
    }

    const handleAccountChange = ({ currentTarget: input }) => {
        setNewData({ ...newData, [input.name]: input.value })
    }

    const handlePasswordChange = ({ currentTarget: input }) => {
        editNewPwd({ ...editPwd, [input.name]: input.value })
    }

    const handleToDeleteChange = ({ currentTarget: input }) => {
        setToDelete({ ...toDelete, [input.name]: input.value })
    }

    const openCloseEditDataSection = () => {
        if(isEditingData === false){
            setNewData(data)
        } else {
            setNewData({
                name: "",
                surname: "",
                email: "",
                phone: ""
            })
        }
        setIsEditingData((prev) => !prev)
    }

    const openCloseEditPwdSection = () => {
        editNewPwd({
            oldPassword: "",
            newPassword: "",
            confirmNewPassword: ""
        })
        setIsEditingPwd((prev) => !prev)
    }

    const openCloseDeleteSection = () => {
        setIsDeleting((prev) => !prev)
        setToDelete({
            password: ""
        })
        setIsBlocked(false)
    }

    useEffect(() => {
        getUserData()
    }, [])

    // GET
    const getUserData = async () => {
        const url = "http://localhost:8080/api/user/my-account"
        await apiRequest({
            url,
            useToken: true,
            onSuccess: ((status, data) => {
                setData(data)
            }),
            refreshTokens,
        })
    }

    // PATCH
    const handleEditAccount = async (e) => {
        e.preventDefault()
        
        const newUserData = { 
            name: newData.name,
            surname: newData.surname,
            email: newData.email,
            phone: newData.phone
        }

        const url = "http://localhost:8080/api/user/my-account"
        await apiRequest({
            url,
            useToken: true,
            method: 'PATCH',
            body: newUserData,
            onSuccess: ((status, data) => {
                const newRefreshToken = data.refreshToken
                localStorage.setItem('refresh-token', newRefreshToken)
                toast.success(
                    <div>
                        Zaaktualizowano dane konta
                    </div>,
                    {
                    onOpen: () => setIsBlocked(true),
                    onClose: () => {
                        window.location.assign('/moje_konto')
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
            refreshTokens,
        })
    }

    const handleEditPassword = async (e) => {
        e.preventDefault()
        
        if(window.confirm('Czy na pewno chcesz zmienić hasło?')){
            if(validPassword(editPwd.newPassword)) {
                const validNewPassword = editPwd.newPassword === editPwd.confirmNewPassword
                if(validNewPassword){
                    const passwords = {
                        oldPassword: editPwd.oldPassword,
                        newPassword: editPwd.newPassword
                    }
                    const url = "http://localhost:8080/api/user/my-account/change-password"
                    await apiRequest({
                        url,
                        useToken: true,
                        method: 'PATCH',
                        body: passwords,
                        onSuccess: ((status, data) => {
                            toast.success(
                                <div>
                                    Twoje hasło zostało zmienione
                                </div>,
                                {
                                onOpen: () => setIsBlocked(true),
                                onClose: () => {
                                    window.location.assign('/moje_konto')
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
                        refreshTokens,
                    })
                } else {
                    toast.error("Podane hasła nie są identyczne!" ,
                    {
                        autoClose: 3000
                    })
                }
            } else {
                toast.error("Nowe hasło musi zawierać od 8 do 26 znaków, w tym 1 małą literę, 1 wielką literę, 1 cyfrę i 1 znak specjalny." ,
                {
                    autoClose: 3000
                })
            }
        } else {
            console.log("Brak zgody użytkownika na zmianę hasła.")
        }
    }

    // DELETE
    const handleDeleteAccount = async (e) => {
        e.preventDefault()

        if(window.confirm('Czy na pewno chcesz usunąć swoje konto?')){
            const password = {
                pwdHash: toDelete.password
            }
            const url = "http://localhost:8080/api/user/my-account"
            await apiRequest({
                url,
                useToken: true,
                method: 'DELETE',
                body: password,
                onSuccess: ((status, data) => {
                    localStorage.removeItem('access-token')
                    localStorage.removeItem('refresh-token')
                    localStorage.removeItem('role')
                    toast.success(
                        <div>
                            Konto zostało pomyślnie usunięte!
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
                refreshTokens,
            })
        } else {
            console.log("Brak zgody użytkownika na usunięcie konta.")
        }
    }

    return(
        <div>
            {/* Nakładka blokująca */}
            {isBlocked && (
                <div className="overlay">
                    {isDeleting && (
                        <div className='confirm-section'>
                            <fieldset className='confirm-fielset-form'>
                                <legend>Potwierdź operację hasłem</legend>
                                <form onSubmit={handleDeleteAccount} className='confirm-form'>
                                    <div className='form-group'>
                                        <label>Hasło:</label>
                                        <input
                                            type="password"
                                            placeholder="Podaj hasło"
                                            name="password"
                                            required
                                            value={toDelete.password}
                                            onChange={handleToDeleteChange}
                                        />
                                    </div>
                                    <div className='btns'>
                                        <button className='ok-btn' type='submit'>&#x2714;</button>
                                        <button className='cancel-btn' onClick={openCloseDeleteSection}>&#x2716;</button>
                                    </div>
                                </form>
                            </fieldset>
                        </div>
                    )}
                </div>
            )}

            <h2>Witaj {data.name}</h2>

            <main>
                <div className={styles['user-info']}>
                    <div className={styles.photo}>
                        <img className={styles['user-img']} src={user_icon}/>
                    </div>
                    <div className={styles['user-container']}>
                        <div className={styles['user-data']}>
                            <div>Imię i nazwisko:</div><div>{data.name} {data.surname}</div>
                        </div>

                        <div className={styles['user-data']}>
                            <div>E-mail:</div><div>{data.email}</div>
                        </div>

                        <div className={styles['user-data']}>
                            <div>Numer telefonu:</div><div>{data.phone}</div>
                        </div>

                        <div className='btns' style={{margin: '3% auto'}}>
                            <button className='edit-btn' onClick={openCloseEditDataSection}>&#9881;</button>
                            <button onClick={openCloseEditPwdSection}>Zmień hasło</button>
                            <button className={styles['logout-btn']} onClick={onLogout}>Wyloguj się</button>
                            { !(role === 'ROLE_WORKER' || role === 'ROLE_ADMIN') && <button className={styles['delete-account-btn']} onClick={() => {setIsDeleting(true); setIsBlocked(true)}}>Usuń konto</button> }
                        </div>
                    </div>
                </div>

                { isEditingData && (
                    <div className='moje_konto-edit-div'>
                        <fieldset className='fieldset-form'>
                            <legend>Edytuj dane</legend>
                            <form onSubmit={handleEditAccount}>
                                <div className='form-group'>
                                    <label>Imię:</label>
                                    <input
                                        type="text"
                                        placeholder="Podaj nowe imię"
                                        name="name"
                                        required
                                        value={newData.name}
                                        onChange={handleAccountChange}
                                    />
                                </div>

                                <div className='form-group'>
                                    <label>Nazwisko:</label>
                                    <input
                                        type="text"
                                        placeholder="Podaj nowe nazwisko"
                                        name="surname"
                                        required
                                        value={newData.surname}
                                        onChange={handleAccountChange}
                                    />
                                </div>

                                <div className='form-group'>
                                    <label>E-mail:</label>
                                    <input
                                        type="email"
                                        placeholder="Podaj nowy adres e-mail"
                                        name="email"
                                        required
                                        value={newData.email}
                                        onChange={handleAccountChange}
                                    />
                                </div>

                                <div className='form-group'>
                                    <label>Nr telefonu:</label>
                                    <input
                                        type="phone"
                                        placeholder="Podaj nowy nr telefonu"
                                        name="phone"
                                        required
                                        value={newData.phone}
                                        onChange={handleAccountChange}
                                    />
                                </div>

                                <div className='btns'>
                                    <button className="save-btn" type="submit">&#x1F4BE;</button>
                                    <button className="cancel-btn" onClick={openCloseEditDataSection}>&#x2716;</button>
                                </div>
                            </form>
                        </fieldset>
                    </div>
                )}
                { isEditingPwd && (
                    <div className='moje_konto-edit-div'>
                        <fieldset className='fieldset-form'>
                            <legend>Zmiana hasła</legend>
                            <form onSubmit={handleEditPassword}>
                                <div className='form-group'>
                                    <label>Aktualne hasło:</label>
                                    <input
                                        type="password"
                                        placeholder="Podaj aktualne hasło"
                                        name="oldPassword"
                                        required
                                        value={editPwd.oldPassword}
                                        onChange={handlePasswordChange}
                                    />
                                </div>

                                <div className='form-group'>
                                    <label>Nowe hasło:</label>
                                    <input
                                        type="password"
                                        placeholder="Podaj nowe hasło"
                                        name="newPassword"
                                        required
                                        value={editPwd.newPassword}
                                        onChange={handlePasswordChange}
                                    />
                                </div>

                                <div className='form-group'>
                                    <label>Powtórz nowe hasło:</label>
                                    <input
                                        type="password"
                                        placeholder="Powtórz nowe hasło"
                                        name="confirmNewPassword"
                                        required
                                        value={editPwd.confirmNewPassword}
                                        onChange={handlePasswordChange}
                                    />
                                </div>

                                <div className='btns'>
                                    <button className="ok-btn" type="submit">&#x2714;</button>
                                    <button className="cancel-btn" onClick={openCloseEditPwdSection}>&#x2716;</button>
                                </div>
                            </form>
                        </fieldset>
                    </div>
                )}
            </main>

            <ToastContainer 
                position="top-center"
                theme="dark"
                closeOnClick={true}
            />
	    </div>
    )
}

export default MojeKonto
import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from "react-router-dom"
import { toast, ToastContainer } from 'react-toastify'
import '../css/Style.css'
import './MojeKonto.css'
import user_icon from '../css/img/user.png'
import useRefresh from '../../service/useRefresh'

const MojeKonto = ({ onLogout }) => {
    const [isBlocked, setIsBlocked] = useState(false)
    const [data, setData] = useState([])
    const refreshTokens = useRefresh()

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
    
    const validNewPassword = editPwd.newPassword === editPwd.confirmNewPassword
    const [pwdError, setPwdError] = useState("")
    const [pwdChangeSuccess, setPwdChangeSuccess] = useState({
        success: false,
        text: ""
    })
    const [deleteError, setDeleteError] = useState("")

    const [isEditingData, setIsEditingData] = useState(false)
    const [isEditingPwd, setIsEditingPwd] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    const handleAccountChange = ({ currentTarget: input }) => {
        setNewData({ ...newData, [input.name]: input.value })
    }

    const handlePasswordChange = ({ currentTarget: input }) => {
        editNewPwd({ ...editPwd, [input.name]: input.value })
    }

    const handleToDeleteChange = ({ currentTarget: input }) => {
        setToDelete({ ...toDelete, [input.name]: input.value })
    }
    
    useEffect(() => {
        const getUserData = async () => {
            try {
                const accessToken = localStorage.getItem('access-token')
                const url = "http://localhost:8080/api/user/my-account"
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`,
                    }
                })

                const responseStatus = response.status

                if (responseStatus >= 200 && responseStatus <= 299) {
                    const resData = await response.json()
                    setData(resData)
                } else {
                    console.error("Błąd podczas pobierania danych zabezpieczonych:", responseStatus)
                }

                await refreshTokens(responseStatus)
            } catch(error) {
                console.error("Błąd sieci:", error)
            }
        }

        getUserData()
    }, [])

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
        setToDelete({
            password: ""
        })
        setIsDeleting((prev) => !prev)
    }

    const handleEditAccount = async (e) => {
        e.preventDefault()
        
        const newUserData = { 
            name: newData.name,
            surname: newData.surname,
            email: newData.email,
            phone: newData.phone
        }

        try {
            const accessToken = localStorage.getItem('access-token')
            const url = "http://localhost:8080/api/user/my-account"
            const response = await fetch(url, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify(newUserData),
            })

            const responseStatus = response.status

            if(responseStatus >= 200 && responseStatus <= 299){
                const responseData = await response.json()
                const newRefreshToken = responseData.refreshToken
                localStorage.setItem('refresh-token', newRefreshToken)
            } else {
                console.error("Błąd podczas przetwarzania przesłanych danych!", responseStatus)
            }

            await refreshTokens(responseStatus)
            window.location.reload()
        } catch(error) {
            console.error("Błąd sieci:", error)
        }
    }

    const handleEditPassword = async (e) => {
        e.preventDefault()
        
        if(validNewPassword){
            const passwords = {
                oldPassword: editPwd.oldPassword,
                newPassword: editPwd.newPassword
            }

            try {
                const accessToken = localStorage.getItem('access-token')
                const url = "http://localhost:8080/api/user/my-account/change-password"
                const response = await fetch(url, {
                    method: "PATCH",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`
                    },
                    body: JSON.stringify(passwords),
                })

                const responseStatus = response.status

                if(responseStatus >= 200 && responseStatus <= 299){
                    const responseData = await response.text()
                    setPwdChangeSuccess({
                        success: true,
                        text: responseData
                    })

                    window.location.reload()
                } else if(responseStatus === 400) {
                    const responseData = await response.text()
                    setPwdError(responseData)
                } else {
                    console.error("Błąd podczas przetwarzania przesłanych danych!", responseStatus)
                }

                await refreshTokens(responseStatus)
            } catch(error) {
                console.error("Błąd sieci:", error)
            }
        } else {
            setPwdError("Podane nowe hasła nie są identyczne!")
        }
    }

    const handleDeleteAccount = async (e) => {
        e.preventDefault()

        if(window.confirm('Czy na pewno chcesz usunąć swoje konto?')){
            setIsBlocked(true)

            const password = {
                pwdHash: toDelete.password
            }

            try {
                const accessToken = localStorage.getItem('access-token')
                const url = "http://localhost:8080/api/user/my-account"
                const response = await fetch(url, {
                    method: "DELETE",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`
                    },
                    body: JSON.stringify(password),
                })

                const responseStatus = response.status

                if(responseStatus >= 200 && responseStatus <= 299){
                    localStorage.removeItem('access-token')
                    localStorage.removeItem('refresh-token')
                    localStorage.removeItem('role')
                    
                    toast.success('Konto zostało pomyślnie usunięte!', {
                        onClose: () => {
                            window.location.assign('/'),
                            setIsBlocked(false)
                        },
                        autoClose: 3000,
                    })
                } else if(responseStatus === 400) {
                    setIsBlocked(false)
                    const responseData = await response.text()
                    setDeleteError(responseData)
                } else {
                    setIsBlocked(false)
                    console.error("Błąd podczas usuwania konta!", responseStatus)
                    setDeleteError("Error status 403 (Forbidden)")
                }

            } catch(error) {
                setIsBlocked(false)
                console.error("Błąd sieci:", error)
            }
        } else {
            console.log("Brak zgody użytkownika na usunięcie konta.")
        }
    }

    return(
        <div className='body-div'>
            {/* Nakładka blokująca */}
            {isBlocked && <div className="overlay"></div>}

            <h2>Witaj {data.name}</h2>
            <div className='moje_konto-main-div'>
                <div>
                    <img className='user_icon-img' src={user_icon}/>
                </div>
                <div>
                    <h3>Imię i nazwisko: {data.name} {data.surname}</h3>
                    <h3>E-mail: {data.email}</h3>
                    <h3>Numer telefonu: {data.phone}</h3>
                    <span>
                        <button id="edit-account" onClick={openCloseEditDataSection}>Edytuj konto</button>
                        <button id="change-password" onClick={openCloseEditPwdSection}>Zmień hasło</button>
                        <Link to='/'><button id="logout" onClick={onLogout}>Wyloguj się</button></Link>
                        <button id="delete" onClick={openCloseDeleteSection}>Usuń konto</button>
                    </span>
                </div>
            </div>

            { isEditingData && (
                <div className='moje_konto-edit-div'>
                    <h3 className='edit-section-h3'>Sekcja edycji informacji o koncie</h3>
                    <form onSubmit={handleEditAccount}>
                        <label>Imię</label>
                        <input
                            type="text"
                            placeholder="Podaj nowe imię"
                            name="name"
                            required
                            value={newData.name}
                            onChange={handleAccountChange}
                        />
                        <label>Nazwisko</label>
                        <input
                            type="text"
                            placeholder="Podaj nowe nazwisko"
                            name="surname"
                            required
                            value={newData.surname}
                            onChange={handleAccountChange}
                        />
                        <label>E-mail</label>
                        <input
                            type="email"
                            placeholder="Podaj nowy adres e-mail"
                            name="email"
                            required
                            value={newData.email}
                            onChange={handleAccountChange}
                        />
                        <label>Nr telefonu</label>
                        <input
                            type="phone"
                            placeholder="Podaj nowy nr telefonu"
                            name="phone"
                            required
                            value={newData.phone}
                            onChange={handleAccountChange}
                        />

                        <div className='editing-buttons-div'>
                            <button className="save-changes-button" type="submit">Zapisz</button>
                            <button className="cancel-editing-button" onClick={openCloseEditDataSection}>Anuluj</button>
                        </div>
                    </form>
                </div>
            )}
            { isEditingPwd && (
                <div className='moje_konto-edit-div'>
                    <h3 className='edit-section-h3'>Sekcja edycji hasła</h3>
                    <form onSubmit={handleEditPassword}>
                        <label>Aktualne hasło</label>
                        <input
                            type="password"
                            placeholder="Podaj aktualne hasło"
                            name="oldPassword"
                            required
                            value={editPwd.oldPassword}
                            onChange={handlePasswordChange}
                        />
                        <label>Nowe hasło</label>
                        <input
                            type="password"
                            placeholder="Podaj nowe hasło"
                            name="newPassword"
                            required
                            value={editPwd.newPassword}
                            onChange={handlePasswordChange}
                        />
                        <label>Powtórz nowe hasło</label>
                        <input
                            type="password"
                            placeholder="Powtórz nowe hasło"
                            name="confirmNewPassword"
                            required
                            value={editPwd.confirmNewPassword}
                            onChange={handlePasswordChange}
                        />
                        <div className='editing-buttons-div'>
                            <button className="save-changes-button" type="submit">Zmień</button>
                            <button className="cancel-editing-button" onClick={openCloseEditPwdSection}>Anuluj</button>
                        </div>
                    </form>
                    { pwdError && (<p>{pwdError}</p>)}
                    { pwdChangeSuccess.success && (<p>{pwdChangeSuccess.text}</p>)}
                </div>
            )}
            { isDeleting && (
                <div className='moje_konto-delete-div'>
                    <h3 className='edit-section-h3'>Sekcja usuwanie konta</h3>
                    <form onSubmit={handleDeleteAccount}>
                        <label>Podaj hasło aby usunąć konto</label>
                        <input
                            type="password"
                            placeholder="Podaj hasło"
                            name="password"
                            required
                            value={toDelete.password}
                            onChange={handleToDeleteChange}
                        />
                        <div className='delete-buttons-div'>
                            <button className="delete-button" type="submit">Usuń</button>
                            <button className="cancel-delete-button" onClick={openCloseDeleteSection}>Anuluj</button>
                        </div>
                    </form>
                    {deleteError && (<p>{deleteError}</p>)}
                </div>
            )}
            <ToastContainer 
                position="top-center"
                theme="dark"
                closeOnClick={true}
            />
	    </div>
    );
};

export default MojeKonto;
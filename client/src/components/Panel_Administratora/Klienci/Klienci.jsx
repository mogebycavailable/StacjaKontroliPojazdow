import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from "react-router-dom"
import { toast, ToastContainer } from 'react-toastify'
import '../../css/Style.css'
import '../TydzienPracy/TydzienPracy.css'
import './klienci.css'
import useRefresh from '../../../service/useRefresh'
import apiRequest from '../../../service/restApiService'

const Klienci = () => {
    const refreshTokens = useRefresh()
    const [isBlocked, setIsBlocked] = useState(false)
    const [data, setData] = useState([])
    const [editingClient, setEditingClient] = useState(null)
    const [editingClientData, setEditingClientData] = useState({
        name: '',
        surname: '',
        phone: '',
        email: '',
    })
    const [isChangingPassword, setIsChangingPassword] = useState(false)
    const [editPwdHash, setEditPwdHash] = useState({
        newPwdHash: '',
        confirmNewPwdHash: ''
    })

    const handleChange = ({ currentTarget: input }) => {
        setData({ ...data, [input.name]: input.value })
    }

    const handleEditingChange = ({ currentTarget: input }) => {
        setEditingClientData({ ...editingClientData, [input.name]: input.value })
    }

    const handleEditPwdChange = ({ currentTarget: input }) => {
        setEditPwdHash({ ...editPwdHash, [input.name]: input.value })
    }

    const handleEditClick = (client) => {
        setEditingClient(client.email)
        setEditingClientData({
            name: client.name,
            surname: client.surname,
            phone: client.phone,
            email: client.email
        })
    }

    const handleCancelEditing = () => {
        setEditingClient(null)
        setEditingClientData(null)
    }
    
    const handleCancelChangingPwd = () => {
        setIsChangingPassword(false)
        setEditPwdHash({
            newPwdHash: '',
            confirmNewPwdHash: ''
        })
        setIsBlocked(false)
    }

    useEffect(() => {
        getClients()
    }, [])

    // GET
    const getClients = async () => {
        const url = "http://localhost:8080/api/admin/users"
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
    const handleEditClientData = async (e) => {
        e.preventDefault()

        const updateClient = {
            name: editingClientData.name,
            surname: editingClientData.surname,
            phone: editingClientData.phone,
            email: editingClientData.email,
        }

        const url = "http://localhost:8080/api/admin/users/"+editingClient

        await apiRequest({
            url,
            useToken: true,
            method: 'PATCH',
            body: updateClient,
            onSuccess: ((status, data) => {
                toast.success(
                    <div>
                        Zaaktualizowano dane klienta:<br/>
                        {data.name} {data.surname}
                    </div>,
                    {
                    onOpen: () => setIsBlocked(true),
                    onClose: () => {
                        window.location.assign('/panel_administratora/klienci')
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

    const handleEditClientPwd = async (e) => {
        e.preventDefault()

        if(window.confirm('Czy na pewno chcesz zmienić hasło klienta?')){
            const validNewPwd = editPwdHash.newPwdHash === editPwdHash.confirmNewPwdHash

            if(validNewPwd) {
                const updateClientPwd = {
                    pwdHash: editPwdHash.newPwdHash
                }
        
                const url = "http://localhost:8080/api/admin/users/"+editingClient

                await apiRequest({
                    url,
                    useToken: true,
                    method: 'PATCH',
                    body: updateClientPwd,
                    onSuccess: ((status, data) => {
                        toast.success(
                            <div>
                                Hasło klienta:<br/>
                                {data.name} {data.surname}<br/>
                                zostało zmienione
                            </div>,
                            {
                            onOpen: () => setIsBlocked(true),
                            onClose: () => {
                                window.location.assign('/panel_administratora/klienci')
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
                        onClose: () => { setIsBlocked(false) },
                        autoClose: 3000
                    })
            }
        } else {
            console.log("Brak zgody administratora na zmianę hasła klienta.")
        }
        setIsChangingPassword(false)
        setEditPwdHash({
            newPwdHash: '',
            confirmNewPwdHash: ''
        })
        setEditingClient(null)
    }

    // DELETE
    const handleDeleteClient = async (e) => {
        e.preventDefault()

        if(window.confirm('Czy na pewno chcesz usunąć konto tego klienta?')){
            const url = "http://localhost:8080/api/admin/users/"+editingClient
            await apiRequest({
                url,
                useToken: true,
                method: 'DELETE',
                onSuccess: ((status, data) => {
                    toast.success(
                        <div>
                            Usunięto konto klienta:<br/>
                            {data.name} {data.surname}
                        </div>,
                        {
                        onOpen: () => setIsBlocked(true),
                        onClose: () => {
                            window.location.assign('/panel_administratora/klienci')
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
            console.log("Brak zgody administratora na usunięcie konta klienta.")
        }
        setEditingClient(null)
    }

    return(
        <div className='div-body'>
            {/* Nakładka blokująca */}
            {isBlocked && (
                <div className="overlay">
                    {editingClient && isChangingPassword && (
                        <form className='change-pwd-form'>
                            <h3 className='zmiana-hasla-h3'>Zamiana hasła do konta: {editingClient}</h3>
                            <div className='form-group'>
                                <label>Nowe hasło:</label>
                                <input type='password' name='newPwdHash' required value={editPwdHash.newPwdHash} onChange={handleEditPwdChange}/>
                            </div>
                            <div className='form-group'>
                                <label>Potwierdź nowe hasło:</label>
                                <input type='password' name='confirmNewPwdHash' required value={editPwdHash.confirmNewPwdHash} onChange={handleEditPwdChange}/>
                            </div>
                            <div className='form-group'>
                                <div className='save-client' onClick={handleEditClientPwd}>&#x1F4BE;</div>
                                <div className='cancel-editing-client' onClick={handleCancelChangingPwd}>&#x2716;</div>
                            </div>
                        </form>
                    )}
                </div>
            )}

            <h2>Zarządzanie klientami</h2>
            <Link to='/panel_administratora' className='back-arrow'>&#8592;</Link>

            <main>
                <table className='client-table'>
                    <thead>
                        <tr className='theaders'>
                            <th>Imię</th>
                            <th>Nazwisko</th>
                            <th>Nr telefonu</th>
                            <th>E-mail</th>
                            { editingClient && (<th>Hasło</th>)}
                            <th>Opcje</th>
                        </tr>
                    </thead>
                    <tbody>
                        { data && data.map((client) => {
                            if(editingClient === client.email){
                                return(
                                    <tr key={client.email}>
                                        <td>
                                            <input
                                                className='client-data-input'
                                                type='text'
                                                required
                                                name='name'
                                                value={editingClientData.name}
                                                onChange={handleEditingChange}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                className='client-data-input'
                                                type='text'
                                                required
                                                name='surname'
                                                value={editingClientData.surname}
                                                onChange={handleEditingChange}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                className='client-data-input'
                                                type='tel'
                                                placeholder='123-456-789'
                                                required
                                                name='phone'
                                                value={editingClientData.phone}
                                                onChange={handleEditingChange}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                className='client-data-input'
                                                type='email'
                                                required
                                                name='email'
                                                value={editingClientData.email}
                                                onChange={handleEditingChange}
                                            />
                                        </td>
                                        <td>
                                            <div className='change-client-pwd' onClick={() => {setIsChangingPassword(true); setIsBlocked(true)}}>&#x1F511;</div>
                                        </td>
                                        <td>
                                            <div className='save-cancel-delete-btns'>
                                                <div className='save-client' onClick={handleEditClientData}>&#x1F4BE;</div>
                                                <div className='cancel-editing-client' onClick={handleCancelEditing}>&#x2716;</div>
                                                <div className='delete-client' onClick={handleDeleteClient}>&#x1F5D1;</div>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            }

                            return(
                                <tr key={client.email} className='tbody-rows'>
                                    <td>{client.name}</td>
                                    <td>{client.surname}</td>
                                    <td>{client.phone}</td>
                                    <td>{client.email}</td>
                                    { editingClient && (<td></td>)}
                                    <td className='edit-workday' onClick={(e) => {e.stopPropagation(); handleEditClick(client)}}>&#9881;</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </main>
            
            <ToastContainer 
                position="top-center"
                theme="dark"
                closeOnClick={true}
            />
	    </div>
    );
};

export default Klienci;
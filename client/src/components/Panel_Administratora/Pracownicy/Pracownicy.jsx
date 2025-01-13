import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from "react-router-dom"
import { toast, ToastContainer } from 'react-toastify'
import '../../css/Style.css'
import panelStyles from '../PanelAdministratora.module.css'
import useRefresh from '../../../service/useRefresh'
import apiRequest from '../../../service/restApiService'

const Pracownicy = () => {
    const navigate = useNavigate()
    const refreshTokens = useRefresh()
    const [isBlocked, setIsBlocked] = useState(false)
    const [data, setData] = useState([])
    const [isAddingWorker, setIsAddingWorker] = useState(false)
    const [addingWorkerData, setAddingWorkerData] = useState({
        name: '',
        surname: '',
        phone: '',
        email: '',
        pwdHash: '',
    })
    const [editingWorker, setEditingWorker] = useState(null)
    const [editingWorkerData, setEditingWorkerData] = useState({
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

    const handleAddingChange = ({ currentTarget: input }) => {
        setAddingWorkerData({ ...addingWorkerData, [input.name]: input.value })
    }

    const handleEditingChange = ({ currentTarget: input }) => {
        setEditingWorkerData({ ...editingWorkerData, [input.name]: input.value })
    }

    const handleEditPwdChange = ({ currentTarget: input }) => {
        setEditPwdHash({ ...editPwdHash, [input.name]: input.value })
    }

    const handleAddClick = () => {
        setEditingWorker(null)
        setEditingWorkerData(null)
        setIsAddingWorker(true)
        setAddingWorkerData({
            name: '',
            surname: '',
            phone: '',
            email: '',
            pwdHash: '',
        })
    }

    const handleEditClick = (worker) => {
        setIsAddingWorker(null)
        setAddingWorkerData(null)
        setEditingWorker(worker.email)
        setEditingWorkerData({
            name: worker.name,
            surname: worker.surname,
            phone: worker.phone,
            email: worker.email
        })
    }

    const handleCancelAdding = () => {
        setIsAddingWorker(null)
        setAddingWorkerData({
            name: '',
            surname: '',
            phone: '',
            email: ''
        })
    }

    const handleCancelEditing = () => {
        setEditingWorker(null)
        setEditingWorkerData(null)
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
        getWorkers()
    }, [])

    // GET
    const getWorkers = async () => {
        const url = "http://localhost:8080/api/admin/worker"
        await apiRequest({
            url,
            useToken: true,
            onSuccess: ((status, data) => {
                setData(data)
            }),
            refreshTokens,
        })
    }

    // POST
    const handleCreateWorker = async (e) => {
        e.preventDefault()

        const newWorker = {
            name: addingWorkerData.name,
            surname: addingWorkerData.surname,
            phone: addingWorkerData.phone,
            email: addingWorkerData.email,
            pwdHash: addingWorkerData.pwdHash,
        }

        const url = "http://localhost:8080/api/admin/worker"

        await apiRequest({
            url,
            useToken: true,
            method: 'POST',
            body: newWorker,
            onSuccess: ((status, data) => {
                toast.success(
                    <div>
                        Utworzono pracownika:<br/>
                        {data.name} {data.surname}
                    </div>,
                    {
                    onOpen: () => setIsBlocked(true),
                    onClose: () => {
                        window.location.assign('/panel_administratora/pracownicy')
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

    // PATCH
    const handleEditWorkerData = async (e) => {
        e.preventDefault()

        const updateWorker = {
            name: editingWorkerData.name,
            surname: editingWorkerData.surname,
            phone: editingWorkerData.phone,
            email: editingWorkerData.email,
        }

        const url = "http://localhost:8080/api/admin/worker/"+editingWorker

        await apiRequest({
            url,
            useToken: true,
            method: 'PATCH',
            body: updateWorker,
            onSuccess: ((status, data) => {
                toast.success(
                    <div>
                        Zaaktualizowano pracownika:<br/>
                        {data.name} {data.surname}
                    </div>,
                    {
                    onOpen: () => setIsBlocked(true),
                    onClose: () => {
                        window.location.assign('/panel_administratora/pracownicy')
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

    const handleEditWorkerPwd = async (e) => {
        e.preventDefault()

        if(window.confirm('Czy na pewno chcesz zmienić hasło pracownika?')){
            const validNewPwd = editPwdHash.newPwdHash === editPwdHash.confirmNewPwdHash

            if(validNewPwd) {
                const updateWorkerPwd = {
                    pwdHash: editPwdHash.newPwdHash
                }
        
                const url = "http://localhost:8080/api/admin/worker/"+editingWorker

                await apiRequest({
                    url,
                    useToken: true,
                    method: 'PATCH',
                    body: updateWorkerPwd,
                    onSuccess: ((status, data) => {
                        toast.success(
                            <div>
                                Hasło pracownika:<br/>
                                {data.name} {data.surname}<br/>
                                zostało zmienione
                            </div>,
                            {
                            onOpen: () => setIsBlocked(true),
                            onClose: () => {
                                window.location.assign('/panel_administratora/pracownicy')
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
            console.log("Brak zgody administratora na zmianę hasła pracownika.")
        }
        setIsChangingPassword(false)
        setEditPwdHash({
            newPwdHash: '',
            confirmNewPwdHash: ''
        })
        setEditingWorker(null)
    }

    // DELETE
    const handleDeleteWorker = async (e) => {
        e.preventDefault()

        if(window.confirm('Czy na pewno chcesz usunąć tego pracownika?')){
            const url = "http://localhost:8080/api/admin/worker/"+editingWorker
            await apiRequest({
                url,
                useToken: true,
                method: 'DELETE',
                onSuccess: ((status, data) => {
                    toast.success(
                        <div>
                            Usunięto pracownika:<br/>
                            {data.name} {data.surname}
                        </div>,
                        {
                        onOpen: () => setIsBlocked(true),
                        onClose: () => {
                            window.location.assign('/panel_administratora/pracownicy')
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
            console.log("Brak zgody administratora na usunięcie pracownika.")
        }
        setEditingWorker(null)
    }

    return(
        <div>
            {/* Nakładka blokująca */}
            {isBlocked && (
                <div className="overlay">
                    {editingWorker && isChangingPassword && (
                        <div className='confirm-section'>
                            <form className='confirm-form'>
                                <h3>Zamiana hasła do konta: {editingWorker}</h3>
                                <div className='form-group'>
                                    <label>Nowe hasło:</label>
                                    <input type='password' name='newPwdHash' required value={editPwdHash.newPwdHash} onChange={handleEditPwdChange}/>
                                </div>
                                <div className='form-group'>
                                    <label>Potwierdź nowe hasło:</label>
                                    <input type='password' name='confirmNewPwdHash' required value={editPwdHash.confirmNewPwdHash} onChange={handleEditPwdChange}/>
                                </div>
                                <div className='btns'>
                                    <div className='save-btn' onClick={handleEditWorkerPwd}>&#x1F4BE;</div>
                                    <div className='cancel-btn' onClick={handleCancelChangingPwd}>&#x2716;</div>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            )}

            <h2>Zarządzanie pracownikami</h2>
            <button className={panelStyles['back-arrow']} onClick={() => navigate('/panel_administratora')}>&#8592;</button>

            <main>
                { !isAddingWorker && (<div className='plus-add-btn' onClick={handleAddClick}>&#x2b;</div>)}
                { isAddingWorker && (
                    <fieldset className='fieldset-form'>
                        <legend>Dodawanie pracownika</legend>
                        <form>
                            <div className='form-group'>
                                <label>Imię:</label>
                                <input type='text' name='name' required value={addingWorkerData.name} onChange={handleAddingChange}/>
                            </div>
                            <div className='form-group'>
                                <label>Nazwisko:</label>
                                <input type='text' name='surname' required value={addingWorkerData.surname} onChange={handleAddingChange}/>
                            </div>
                            <div className='form-group'>
                                <label>Nr tel:</label>
                                <input type='phone' name='phone' required value={addingWorkerData.phone} onChange={handleAddingChange}/>
                            </div>
                            <div className='form-group'>
                                <label>E-mail:</label>
                                <input type='email' name='email' required value={addingWorkerData.email} onChange={handleAddingChange}/>
                            </div>
                            <div className='form-group'>
                                <label>Hasło:</label>
                                <input type='password' name='pwdHash' required value={addingWorkerData.pwdHash} onChange={handleAddingChange}/>
                            </div>
                            <div className='btns'>
                                <div className='save-btn' onClick={handleCreateWorker}>&#x1F4BE;</div>
                                <div className='cancel-btn' onClick={handleCancelAdding}>&#x2716;</div>
                            </div>
                        </form>
                    </fieldset>
                )}
                { data.length === 0 && (<div className="prompt">Brak dodanych pracowników</div>)}
                { data.length > 0 && (
                    <table>
                        <thead>
                            <tr className={panelStyles.theaders}>
                                <th>Imię</th>
                                <th>Nazwisko</th>
                                <th>Nr telefonu</th>
                                <th>E-mail</th>
                                { editingWorker && (<th>Hasło</th>)}
                                <th>Opcje</th>
                            </tr>
                        </thead>
                        <tbody>
                            { data && data.map((worker) => {
                                if(editingWorker === worker.email){
                                    return(
                                        <tr key={worker.email}>
                                            <td data-title="Imię">
                                                <input
                                                    type='text'
                                                    required
                                                    name='name'
                                                    value={editingWorkerData.name}
                                                    onChange={handleEditingChange}
                                                />
                                            </td>
                                            <td data-title="Nazwisko">
                                                <input
                                                    type='text'
                                                    required
                                                    name='surname'
                                                    value={editingWorkerData.surname}
                                                    onChange={handleEditingChange}
                                                />
                                            </td>
                                            <td data-title="Nr telefonu">
                                                <input
                                                    type='tel'
                                                    placeholder='123-456-789'
                                                    required
                                                    name='phone'
                                                    value={editingWorkerData.phone}
                                                    onChange={handleEditingChange}
                                                />
                                            </td>
                                            <td data-title="E-mail">
                                                <input
                                                    type='email'
                                                    required
                                                    name='email'
                                                    value={editingWorkerData.email}
                                                    onChange={handleEditingChange}
                                                />
                                            </td>
                                            <td data-title="Hasło">
                                                <div className={panelStyles['change-pwd-key-btn']} onClick={() => {setIsChangingPassword(true); setIsBlocked(true)}}>&#x1F511;</div>
                                            </td>
                                            <td data-title="Opcje">
                                                <div className='btns'>
                                                    <button className='save-btn' onClick={handleEditWorkerData}>&#x1F4BE;</button>
                                                    <button className='cancel-btn' onClick={handleCancelEditing}>&#x2716;</button>
                                                    <button className='delete-btn' onClick={handleDeleteWorker}>&#x1F5D1;</button>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                }

                                return(
                                    <tr key={worker.email} className={panelStyles['tbody-rows']}>
                                        <td data-title="Imię">{worker.name}</td>
                                        <td data-title="Nazwisko">{worker.surname}</td>
                                        <td data-title="Nr telefonu">{worker.phone}</td>
                                        <td data-title="E-mail">{worker.email}</td>
                                        { editingWorker && (<td data-title="Hasło"></td>)}
                                        <td data-title="Opcje"><button className='edit-btn' style={{ width: '100%', cursor: 'pointer' }} onClick={(e) => {e.stopPropagation(); handleEditClick(worker)}}>&#9881;</button></td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                )}
            </main>
            
            <ToastContainer 
                position="top-center"
                theme="dark"
                closeOnClick={true}
            />
	    </div>
    );
};

export default Pracownicy;
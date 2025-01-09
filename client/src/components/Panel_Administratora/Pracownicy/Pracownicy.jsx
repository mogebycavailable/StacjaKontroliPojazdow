import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from "react-router-dom"
import { toast, ToastContainer } from 'react-toastify'
import '../../css/Style.css'
import '../TydzienPracy/TydzienPracy.css'
import './Pracownicy.css'
import useRefresh from '../../../service/useRefresh'
import apiRequest from '../../../service/restApiService'

const Pracownicy = () => {
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

    const handleChange = ({ currentTarget: input }) => {
        setData({ ...data, [input.name]: input.value })
    }

    const handleAddingChange = ({ currentTarget: input }) => {
        setAddingWorkerData({ ...addingWorkerData, [input.name]: input.value })
    }

    const handleEditingChange = ({ currentTarget: input }) => {
        setEditingWorkerData({ ...editingWorkerData, [input.name]: input.value })
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
        <div className='div-body'>
            {/* Nakładka blokująca */}
            {isBlocked && <div className="overlay"></div>}

            <h2>Zarządzanie pracownikami</h2>
            <Link to='/panel_administratora' className='back-arrow'>&#8592;</Link>

            <main>
                { !isAddingWorker && (<div className='add-new-worker' onClick={handleAddClick}>&#x2b;</div>)}
                { isAddingWorker && (
                    <form className='adding-worker-form'>
                        <h3>Tworzenie pracownika</h3>
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
                        <div className='form-group'>
                            <div className='save-worker' onClick={handleCreateWorker}>&#x1F4BE;</div>
                            <div className='cancel-editing-worker' onClick={handleCancelAdding}>&#x2716;</div>
                        </div>
                    </form>
                )}
                <table className='worker-table'>
                    <thead>
                        <tr className='theaders'>
                            <th>Imię</th>
                            <th>Nazwisko</th>
                            <th>Nr telefonu</th>
                            <th>E-mail</th>
                            <th>Opcje</th>
                        </tr>
                    </thead>
                    <tbody>
                        { data && data.map((worker) => {
                            if(editingWorker === worker.email){
                                return(
                                    <tr key={worker.email}>
                                        <td>
                                            <input
                                                className='worker-data-input'
                                                type='text'
                                                required
                                                name='name'
                                                value={editingWorkerData.name}
                                                onChange={handleEditingChange}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                className='worker-data-input'
                                                type='text'
                                                required
                                                name='surname'
                                                value={editingWorkerData.surname}
                                                onChange={handleEditingChange}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                className='worker-data-input'
                                                type='tel'
                                                placeholder='123-456-789'
                                                required
                                                name='phone'
                                                value={editingWorkerData.phone}
                                                onChange={handleEditingChange}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                className='worker-data-input'
                                                type='email'
                                                required
                                                name='email'
                                                value={editingWorkerData.email}
                                                onChange={handleEditingChange}
                                            />
                                        </td>
                                        <td>
                                            <div className='save-cancel-delete-btns'>
                                                <div className='save-worker' onClick={handleEditWorkerData}>&#x1F4BE;</div>
                                                <div className='cancel-editing-worker' onClick={handleCancelEditing}>&#x2716;</div>
                                                <div className='delete-worker' onClick={handleDeleteWorker}>&#x1F5D1;</div>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            }

                            return(
                                <tr key={worker.email} className='tbody-rows'>
                                    <td>{worker.name}</td>
                                    <td>{worker.surname}</td>
                                    <td>{worker.phone}</td>
                                    <td>{worker.email}</td>
                                    <td className='edit-workday' onClick={(e) => {e.stopPropagation(); handleEditClick(worker)}}>&#9881;</td>
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

export default Pracownicy;
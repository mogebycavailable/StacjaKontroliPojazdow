import React, { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom"
import { toast, ToastContainer } from 'react-toastify'
import Switch from 'react-switch'
import '../../css/Style.css'
import panelStyles from '../PanelAdministratora.module.css'
import styles from './Stanowiska.module.css'
import useRefresh from '../../../service/useRefresh'
import apiRequest from '../../../service/restApiService'

const Stanowiska = () => {
    const navigate = useNavigate()
    const refreshTokens = useRefresh()
    const [isBlocked, setIsBlocked] = useState(false)
    const [isAddingStand, setIsAddingStand] = useState(false)

    const [data, setData] = useState([])

    const [newStand, setNewStand] = useState({
        name: '',
        isActive: false
    })

    // Edytowanie stanowiska
    const [editingStandId, setEditingStandId] = useState(null)
    const [editingStandData, setEditingStandData] = useState({
        name: '',
        isActive: false
    })

    const handleChange = ({ currentTarget: input }) => {
        setNewStand({ ...newStand, [input.name]: input.value })
    }

    const openCloseAddingStandSection = () => {
        setNewStand({
            name: '',
            isActive: false
        })
        setIsAddingStand((prev) => !prev)
        setEditingStandId(null)
    }

    const handleEditClick = (stand) => {
        setEditingStandId(stand.id)
        setEditingStandData(stand)
        setIsAddingStand(false)
    }

    const handleEditingCancel = () => {
        setEditingStandId(null)
    }

    useEffect(() => {
        getStandData()
    }, [])

    // GET
    const getStandData = async () => {
        const url = "http://localhost:8080/api/admin/stand"
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
    const handleAddNewStand = async (e) => {
        e.preventDefault()

        const stand = {
            name: newStand.name,
            isActive: newStand.isActive,
        }

        const url = "http://localhost:8080/api/admin/stand"

        await apiRequest({
            url,
            useToken: true,
            method: 'POST',
            body: stand,
            onSuccess: ((status, data) => {
                toast.success(
                    <div>
                        Dodano nowe stanowisko:<br/>
                        {data.name}
                    </div>, 
                    {
                    onOpen: () => setIsBlocked(true),
                    onClose: () => {
                        window.location.assign('/panel_administratora/stanowiska')
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
    const handleEditStand = async (e) => {
        e.preventDefault()
        const stand = {
            name: editingStandData.name,
            isActive: editingStandData.isActive
        }
        const url = "http://localhost:8080/api/admin/stand/"+editingStandId
        await apiRequest({
            url,
            useToken: true,
            method: 'PATCH',
            body: stand,
            onSuccess: ((status, data) => {
                toast.success(
                    <div>
                        Zaaktualizowano zmiany dla stanowiska:<br/>
                        {data.name}
                    </div>, 
                    {
                    onOpen: () => setIsBlocked(true),
                    onClose: () => {
                        window.location.assign('/panel_administratora/stanowiska')
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
    const handleDeleteStand = async (e) => {
        e.preventDefault()

        if(window.confirm('Czy na pewno chcesz usunąć to stanowisko?')){
            const url = "http://localhost:8080/api/admin/stand/"+editingStandId
            await apiRequest({
                url,
                useToken: true,
                method: 'DELETE',
                onSuccess: ((status, data) => {
                    toast.success(
                        <div>
                            Usunięto stanowisko:<br/>
                            {data.name}
                        </div>, 
                        {
                        onOpen: () => setIsBlocked(true),
                        onClose: () => {
                            window.location.assign('/panel_administratora/stanowiska')
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
            console.log("Brak zgody administratora na usunięcie tego stanowiska.")
        }
    }

    return(
        <div>
            {/* Nakładka blokująca */}
            {isBlocked && <div className="overlay"></div>}

            <h2>Zarządzanie stanowiskami</h2>
            <button className={panelStyles['back-arrow']} onClick={() => navigate('/panel_administratora')}>&#8592;</button>

            <main>
                { data.length === 0 && (
                    <div className="prompt">Brak dodanych stanowisk</div>
                )}
                { data.length >= 0 && (
                    <div className={styles.stands}>
                        { data && data.map((stand) => {
                            if(editingStandId === stand.id){
                                return(
                                    <div key={stand.id} className={styles.stand}>
                                        <div className={styles['add-stand']}>
                                            <div className={styles['stand-title']}>Stanowisko</div>
                                            <form onSubmit={handleEditStand}>
                                                <div className='form-group'>
                                                    <label>Nazwa:</label>
                                                    <input
                                                        type="text"
                                                        placeholder="Podaj nazwę"
                                                        name="name"
                                                        required
                                                        value={editingStandData.name}
                                                        onChange={(e) => {setEditingStandData((prevState) => ({...prevState, name: e.target.value}))}}
                                                    />
                                                </div>
                                                <div className='form-group'>
                                                    <label>Aktywne:</label>
                                                    <Switch
                                                        name='isActive'
                                                        checked={editingStandData.isActive}
                                                        onChange={(checked) => {setEditingStandData((prevState) => ({...prevState, isActive: checked}))}}
                                                    />
                                                </div>
                                                <div className='btns'>
                                                    <button className='save-btn' onClick={handleEditStand}>&#x1F4BE;</button>
                                                    <button className='delete-btn' onClick={handleDeleteStand}>&#x1F5D1;</button>
                                                    <button className='cancel-btn' onClick={handleEditingCancel}>&#x2716;</button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                )  
                            }

                            return(
                                <div key={stand.id} className={styles.stand} onClick={() => handleEditClick(stand)}>
                                    <div className={styles['stand-title']}>Stanowisko</div>
                                    <div className={styles['stand-name']}>{stand.name || "Nieznana"}</div>
                                    <div className={styles['stand-activity']} style={{color: stand.isActive == false ? 'red' : 'green'}}>{stand.isActive ? "Aktywne" : "Nieaktywne"}</div>
                                </div>
                            )}
                        )}
                        { !isAddingStand && (
                            <div className={styles.stand} onClick={openCloseAddingStandSection}>
                                <div className={styles['plus-sign']}>&#x271A;</div>
                            </div>
                        )}
                        { isAddingStand && (
                            <div className={styles.stand}>
                                <div className={styles['add-stand']}>
                                    <div className={styles['stand-title']}>Stanowisko</div>
                                    <form>
                                        <div className='form-group'>
                                            <label>Nazwa:</label>
                                            <input
                                                type="text"
                                                placeholder="Podaj nazwę"
                                                name="name"
                                                required
                                                value={newStand.name}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className='form-group'>
                                            <label>Aktywne:</label>
                                            <Switch
                                                name='isActive'
                                                checked={newStand.isActive}
                                                onChange={(checked) => {setNewStand((prevState) => ({...prevState, isActive: checked}))}}
                                            />
                                        </div>
                                        <div className='btns'>
                                            <button className='ok-btn' onClick={handleAddNewStand}>&#x2714;</button>
                                            <button className='cancel-btn' onClick={openCloseAddingStandSection}>&#x2716;</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}
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

export default Stanowiska
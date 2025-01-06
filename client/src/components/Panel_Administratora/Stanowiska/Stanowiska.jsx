import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from "react-router-dom"
import { toast, ToastContainer } from 'react-toastify'
import Switch from 'react-switch'
//import '../../css/Style.css'
//import '../PanelAdministratora.css'
import './Stanowiska.css'
import useRefresh from '../../../service/useRefresh'
import useGet from '../../../service/useGet'

const Stanowiska = () => {
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
    const [isEditingStand, setIsEditingStand] = useState(false)
    const [editingStandData, setEditingStandData] = useState({
        name: '',
        isActive: false
    })

    const handleChange = ({ currentTarget: input }) => {
        setNewStand({ ...newStand, [input.name]: input.value })
    }

    useEffect(() => {
        const getStandData = async () => {
            try {
                const accessToken = localStorage.getItem('access-token')
                const url = "http://localhost:8080/api/admin/stand"
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
            } catch (error) {
                console.error("Błąd sieci:", error)
            }
        }

        getStandData()
    }, [])

    const openCloseAddingStandSection = () => {
        setNewStand({
            name: '',
            isActive: false
        })
        setIsAddingStand((prev) => !prev)
        setEditingStandId(null)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsBlocked(true)

        const stand = {
            name: newStand.name,
            isActive: newStand.isActive,
        }

        try {
            const accessToken = localStorage.getItem('access-token')
            const url = "http://localhost:8080/api/admin/stand"
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
                body: JSON.stringify(stand),
            })

            const responseStatus = response.status

            if (responseStatus >= 200 && responseStatus <= 299) {
                const resData = await response.json()
                toast.success(
                    <div>
                        Dodano nowe stanowisko:<br/>
                        {resData.name}
                    </div>, 
                    {
                    onClose: () => {
                        window.location.assign('/panel_administratora/stanowiska')
                        setIsBlocked(false)
                    },
                    autoClose: 3000,
                })
            } else if (responseStatus === 400) {
                const resData = await response.text()
                console.error(resData)
                toast.error(resData, {
                    onClose: () => {
                        setIsBlocked(false)
                    },
                    autoClose: 3000,
                })
                setIsBlocked(false)
            } else {
                console.error("Błąd podczas przetwrzania przesłanych danych:", responseStatus)
                setIsBlocked(false)
            }

            await refreshTokens(responseStatus)
        } catch(error) {
            console.error("Błąd sieci:", error)
            setIsBlocked(false)
        }
    }

    const handleEditClick = (stand) => {
        setEditingStandId(stand.id)
        setEditingStandData(stand)
        setIsAddingStand(false)
    }

    const handleEditingCancel = () => {
        setEditingStandId(null)
    }

    const handleEditStand = async (e) => {
        e.preventDefault
        setIsBlocked(true)

        const stand = {
            name: editingStandData.name,
            isActive: editingStandData.isActive
        }

        try {
            const accessToken = localStorage.getItem('access-token')
            const url = "http://localhost:8080/api/admin/stand/"+editingStandId
            const response = await fetch(url, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
                body: JSON.stringify(stand),
            })

            const responseStatus = response.status

            if (responseStatus >= 200 && responseStatus <= 299) {
                const resData = await response.json()
                toast.success(
                    <div>
                        Zaaktualizowano zmiany dla stanowiska:<br/>
                        {resData.name}
                    </div>,
                    {
                    onClose: () => {
                        window.location.assign('/panel_administratora/stanowiska')
                        setIsBlocked(false)
                    },
                    autoClose: 3000,
                })
            } else if (responseStatus === 400) {
                const resData = await response.text()
                console.error(resData, responseStatus)
                toast.error(resData, {
                    onClose: () => {
                        setIsBlocked(false)
                    },
                    autoClose: 3000,
                })
                setIsBlocked(false)
            } else {
                const resData = await response.text()
                console.error(resData, responseStatus)
                setIsBlocked(false)
            }

            await refreshTokens(responseStatus)
        } catch(error) {
            console.error("Błąd sieci:", error)
            setIsBlocked(false)
        }
    }

    const handleDeleteStand = async (e) => {
        e.preventDefault

        if(window.confirm('Czy na pewno chcesz usunąć to stanowisko?')){
            setIsBlocked(true)

            try {
                const accessToken = localStorage.getItem('access-token')
                const url = "http://localhost:8080/api/admin/stand/"+editingStandId
                const response = await fetch(url, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`,
                    },
                })
    
                const responseStatus = response.status
    
                if (responseStatus >= 200 && responseStatus <= 299) {
                    const resData = await response.json()
                    toast.success(
                        <div>
                            Usunięto stanowisko:<br/>
                            {resData.name}
                        </div>,
                        {
                        onClose: () => {
                            window.location.assign('/panel_administratora/stanowiska')
                            setIsBlocked(false)
                        },
                        autoClose: 3000,
                    })
                } else if (responseStatus === 400) {
                    const resData = await response.text()
                    console.error(resData)
                    toast.error(resData, {
                        onClose: () => {
                            setIsBlocked(false)
                        },
                        autoClose: 3000,
                    })
                } else {
                    console.error("Błąd podczas przetwrzania przesłanych danych:", responseStatus)
                    setIsBlocked(false)
                }
    
                await refreshTokens(responseStatus)
            } catch(error) {
                console.error("Błąd sieci:", error)
                setIsBlocked(false)
            }
        } else {
            console.log("Brak zgody administratora na usunięcie tego stanowiska.")
        }
    }

    return(
        <div className='div-body'>
            {/* Nakładka blokująca */}
            {isBlocked && <div className="overlay"></div>}

            <h2>Zarządzanie stanowiskami</h2>
            <Link to='/panel_administratora' className='back-arrow'>&#8592;</Link>

            <main>
                { data.length === 0 && (
                    <div className="empty-repo-heading">Brak dodanych stanowisk</div>
                )}
                { data.length >= 0 && (
                    <div className='stands-div'>
                        { data && data.map((stand) => {
                            if(editingStandId === stand.id){
                                return(
                                    <div key={stand.id} className='stand'>
                                        <div className='add-stand'>
                                            <div className='stand-title'>Stanowisko</div>
                                            <form onSubmit={handleEditStand} className='stand-adding-form'>
                                                <div className='name-stand'>
                                                    <input
                                                        type="text"
                                                        placeholder="Podaj nazwę"
                                                        name="name"
                                                        required
                                                        value={editingStandData.name}
                                                        onChange={(e) => {setEditingStandData((prevState) => ({...prevState, name: e.target.value}))}}
                                                    />
                                                </div>
                                                <div className='is-active-stand-switch'>
                                                    <label>Aktywne:&emsp;</label>
                                                    <Switch
                                                        name='isActive'
                                                        checked={editingStandData.isActive}
                                                        onChange={(checked) => {setEditingStandData((prevState) => ({...prevState, isActive: checked}))}}
                                                    />
                                                </div>
                                                <div className='adding-btns'>
                                                    <div className='add-stand-btn' onClick={handleEditStand}>&#x1F4BE;</div>
                                                    <div className='cancel-adding-stand-btn' onClick={handleEditingCancel}>&#x2716;</div>
                                                    <div className='delete-stand-btn' onClick={handleDeleteStand}>&#x1F5D1;</div>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                )  
                            }

                            return(
                                <div key={stand.id} className='stand' onClick={() => handleEditClick(stand)}>
                                    <div className='stand-title'>Stanowisko</div>
                                    <div className='stand-name'>{stand.name || "Nieznana"}</div>
                                    <div className='stand-activity' style={{color: stand.isActive == false ? 'red' : 'green'}}>{stand.isActive ? "Aktywne" : "Nieaktywne"}</div>
                                </div>
                            )}
                        )}
                        { !isAddingStand && (
                            <div className='stand' onClick={openCloseAddingStandSection}>
                                <div className='plus-sign'>&#x271A;</div>
                            </div>
                        )}
                        { isAddingStand && (
                            <div className='stand'>
                                <div className='add-stand'>
                                    <div className='stand-title'>Stanowisko</div>
                                    <form onSubmit={handleSubmit} className='stand-adding-form'>
                                        <div className='name-stand'>
                                            <input
                                                type="text"
                                                placeholder="Podaj nazwę"
                                                name="name"
                                                required
                                                value={newStand.name}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className='is-active-stand-switch'>
                                            <label>Aktywne:&emsp;</label>
                                            <Switch
                                                name='isActive'
                                                checked={newStand.isActive}
                                                onChange={(checked) => {setNewStand((prevState) => ({...prevState, isActive: checked}))}}
                                            />
                                        </div>
                                        <div className='adding-btns'>
                                            <div className='add-stand-btn' onClick={handleSubmit}>&#x2714;</div>
                                            <div className='cancel-adding-stand-btn' onClick={openCloseAddingStandSection}>&#x2716;</div>
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
    );
};

export default Stanowiska;
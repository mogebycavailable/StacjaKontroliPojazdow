import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from "react-router-dom"
import { toast, ToastContainer } from 'react-toastify'
import '../../css/Style.css'
import panelAdminStyles from '../../Panel_Administratora/PanelAdministratora.module.css'
import styles from '../PanelPracownika.module.css'
import useRefresh from '../../../service/useRefresh'
import apiRequest from '../../../service/restApiService'

const ZarzadzanieBadaniami = () => {
    const navigate = useNavigate()
    const {standId, standName, date} = useParams()

    const refreshTokens = useRefresh()
    const [isBlocked, setIsBlocked] = useState(false)

    const statutesTranslations = {
        ARRANGED: "Zaplanowane",
        PASSED: "Wynik pozytywny",
        NOT_PASSED: "Wynik negatywny",
    }

    const statutesTypes = [
        {key: 'ARRANGED', label: "Zaplanowane"},
        {key: 'PASSED', label: "Wynik pozytywny"},
        {key: 'NOT_PASSED', label: "Wynik negatywny"}
    ]

    const [data, setData] = useState([])
    const [editingInspection, setEditingInspection] = useState(null)
    const [editingInspectionData, setEditingInspectionData] = useState(null)

    const sortedByTime = data.sort((a, b) => {
        const [hourA, minuteA] = a.inspectionStart.split(':').map(Number);
        const [hourB, minuteB] = b.inspectionStart.split(':').map(Number);

        if (hourA !== hourB) {
            return hourA - hourB
        }
        return minuteA - minuteB
    })

    const handleEditClick = (inspection) => {
        setEditingInspection(inspection.id)
        setEditingInspectionData(inspection)
        setIsBlocked(true)
    }

    useEffect(() => {
        getAllInspectionsByStandAndDate()
    }, [])

    // GET
    const getAllInspectionsByStandAndDate = async () => {
        const url = 'http://localhost:8080/api/worker/inspections/'+standId+'/'+date
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
    const handleEditInspection = async (e) => {
        e.preventDefault()
        if(window.confirm('Czy na pewno chcesz wprowadzić zmiany w wybranym badaniu?')){
            const url = `http://localhost:8080/api/worker/inspections/${editingInspection}`
            const inspectionResult = {
                status: editingInspectionData.status,
                description: editingInspectionData.description,
            }
            await apiRequest({
                url,
                useToken: true,
                method: 'PATCH',
                body: inspectionResult,
                onSuccess: ((status, data) => {
                    toast.success(
                        <div>
                            Pomyślnie zapisano wprowadzone<br/>
                            zmiany w badaniu o id: {data.id}
                        </div>,
                        {
                        onOpen: () => setIsBlocked(true),
                        onClose: () => {
                            window.location.reload()
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
            console.log("Brak zgody użytkownika na wprowadzenie zmian.")
        }
    }

    return(
        <div>
            {/* Nakładka blokująca */}
            {isBlocked && (
                <div className="overlay">
                    { editingInspection && (
                        <div className={styles['edit-inspection-container']}>
                            <div className={styles['edit-inspection-content']}>
                                <div className={styles['edit-inspection-button']}>
                                    <button className='cancel-btn' style={{width: '10%'}} onClick={() => { setEditingInspection(null); setEditingInspectionData(null); setIsBlocked(false) }}>&#x2716;</button>
                                </div>
                                <div className={styles['edit-inspection-data']}>
                                    <fieldset className='fieldset-form' style={{width: '70%'}}>
                                        <legend>Dane badania technicznego</legend>
                                        <div className={styles['inspection-data']}>
                                            <div>Id badania:</div>
                                            <div>{editingInspectionData.id}</div>
                                        </div>
                                        <div className={styles['inspection-data']}>
                                            <div>Godz. rozpoczęcia:</div>
                                            <div>{editingInspectionData.inspectionStart}</div>
                                        </div>
                                        <div className={styles['inspection-data']}>
                                            <div>Godz. zakończenia:</div>
                                            <div>{editingInspectionData.inspectionEnd}</div>
                                        </div>
                                        <div className={styles['inspection-data']}>
                                            <div>Data:</div>
                                            <div>{editingInspectionData.date}</div>
                                        </div>
                                        <div className={styles['inspection-data']}>
                                            <div>Pojazd:</div>
                                            <div>{editingInspectionData.vehicle.brand} {editingInspectionData.vehicle.model} ({editingInspectionData.vehicle.registrationNumber})</div>
                                        </div>
                                        <div className={styles['inspection-data']}>
                                            <div>Stanowisko:</div>
                                            <div>{editingInspectionData.stand.name}</div>
                                        </div>
                                        <div className={styles['inspection-data']}>
                                            <div>Dane kontaktowe:</div>
                                            <div>{editingInspectionData.userEmail}</div>
                                        </div>

                                        <form onSubmit={handleEditInspection}>
                                            <div className='form-group'>
                                                <label>Status:</label>
                                                <select
                                                    name="status"
                                                    value={editingInspectionData.status}
                                                    onChange={(e) => setEditingInspectionData((prev) => ({ ...prev, status: e.target.value}))}
                                                >
                                                    <option value={editingInspectionData.status}>{statutesTranslations[editingInspectionData.status]}</option>
                                                    {statutesTypes
                                                        .filter((type) => type.key !== editingInspectionData.status)
                                                        .map((type) => (
                                                            <option key={type.key} value={type.key}>{type.label}</option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div className='form-group'>
                                                <label>Opis:</label>
                                                <textarea
                                                    name="description"
                                                    value={editingInspectionData.description}
                                                    onChange={(e) => setEditingInspectionData((prev) => ({ ...prev, description: e.target.value}))}
                                                />
                                            </div>

                                            <div className='btns'>
                                                <button type='submit' className='save-btn' style={{width: '20%', fontSize: '24px'}}>&#x1F4BE;</button>
                                            </div>
                                        </form>
                                    </fieldset>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            <h2>Zarządzanie badaniami</h2>
            <button className={panelAdminStyles['back-arrow']} onClick={() => navigate('/panel_pracownika')}>&#8592;</button>

            <main>
                <div>
                    { data.length === 0 ? (<div className="prompt">Brak zaplanowanych badań technicznych</div>) : (<div className='prompt'>Dzień {date}<br/>Stanowisko {standName}</div>)}
                    { data.length > 0 && (
                        <table>
                            <thead>
                                <tr className={panelAdminStyles.theaders}>
                                    <th>Id</th>
                                    <th>Godz. rozpoczęcia</th>
                                    <th>Godz. zakończenia</th>
                                    <th>Pojazd</th>
                                    <th>Status</th>
                                    <th>Opcje</th>
                                </tr>
                            </thead>
                            <tbody>
                                { data && sortedByTime.map((inspection) => {
                                    return(
                                        <tr key={inspection.id} className={panelAdminStyles['tbody-rows']}>
                                            <td data-title="Id">{inspection.id}</td>
                                            <td data-title="Godz. rozpoczęcia">{inspection.inspectionStart}</td>
                                            <td data-title="Godz. zakończenia">{inspection.inspectionEnd}</td>
                                            <td data-title="Pojazd">{inspection.vehicle.registrationNumber}</td>
                                            <td data-title="Status">{statutesTranslations[inspection.status]}</td>
                                            <td data-title="Opcje"><button className='edit-btn' style={{ width: '100%', cursor: 'pointer' }} onClick={(e) => {e.stopPropagation(); handleEditClick(inspection)} }>&#9881;</button></td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    )}
                </div>
            </main>
            
            <ToastContainer 
                position="top-center"
                theme="dark"
                closeOnClick={true}
            />
	    </div>
    )
}

export default ZarzadzanieBadaniami
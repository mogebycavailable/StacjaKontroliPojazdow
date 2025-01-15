import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from "react-router-dom"
import { toast, ToastContainer } from 'react-toastify'
import '../../css/Style.css'
import panelStyles from '../PanelAdministratora.module.css'
import './Rezerwacje.module.css'
import useRefresh from '../../../service/useRefresh'
import apiRequest from '../../../service/restApiService'

const Rezerwacje = () => {
    const navigate = useNavigate()
    const refreshTokens = useRefresh()
    const [isBlocked, setIsBlocked] = useState(false)

    const [data, setData] = useState([])

    const statutesTranslations = {
        ARRANGED: "Zaplanowane",
        PASSED: "Wynik pozytywny",
        NOT_PASSED: "Wynik negatywny",
    }

    useEffect(() => {
        getAllInspections()
    }, [])

    // GET
    const getAllInspections = async () => {
        const url = "http://localhost:8080/api/admin/inspections"
        await apiRequest({
            url,
            useToken: true,
            onSuccess: ((status, data) => {
                setData(data)
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
    const handleDeleteInspectionByAdmin = async (e, id) => {
        e.preventDefault()
        if(window.confirm('Czy na pewno chcesz odwołać tą rezerwację?')){
            const url = "http://localhost:8080/api/user/inspections/"+id
            await apiRequest({
                url,
                useToken: true,
                method: 'DELETE',
                onSuccess: ((status, data) => {
                    toast.success(
                        <div>
                            Pomyślnie odwołano<br/>
                            rezerwację o id: {data.id}
                        </div>,
                        {
                        onOpen: () => setIsBlocked(true),
                        onClose: () => {
                            window.location.assign('/panel_administratora/rezerwacje')
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
            console.log("Brak zgody administratora na odwołanie rezerwacji.")
        }
    }

    return(
        <div>
            {/* Nakładka blokująca */}
            {isBlocked && <div className="overlay"></div>}

            <h2>Zarządzanie rezerwacjami</h2>
            <button className={panelStyles['back-arrow']} onClick={() => navigate('/panel_administratora')}>&#8592;</button>

            <main>
                { data.length === 0 && (<div className="prompt">Brak rezerwacji terminów</div>)}
                { data.length > 0 && (
                    <table>
                        <thead>
                            <tr className={panelStyles.theaders}>
                                <th>Id</th>
                                <th>Pojazd</th>
                                <th>Data</th>
                                <th>Godz. rozpoczęcia</th>
                                <th>Godz. zakończenia</th>
                                <th>Stanowisko</th>
                                <th>Status</th>
                                <th>Opis</th>
                                <th>Dane kontaktowe</th>
                                <th>Opcje</th>
                            </tr>
                        </thead>
                        <tbody>
                            { data && data.map((inspection) => {
                                return(
                                    <tr key={inspection.id} className={panelStyles['tbody-rows']}>
                                        <td data-title="Id">{inspection.id}</td>
                                        <td data-title="Pojazd">{inspection.vehicle.brand} {inspection.vehicle.model} ({inspection.vehicle.registrationNumber})</td>
                                        <td data-title="Data">{inspection.date}</td>
                                        <td data-title="Godz. rozpoczęcia">{inspection.inspectionStart}</td>
                                        <td data-title="Godz. zakończenia">{inspection.inspectionEnd}</td>
                                        <td data-title="Stanowisko">{inspection.stand.name}</td>
                                        <td data-title="Status">{statutesTranslations[inspection.status]}</td>
                                        <td data-title="Opis">{ inspection.description.length > 0 ? <button className='loupe-btn'>&#x1F50D;</button> : "Brak" }</td>
                                        <td data-title="Dane kontaktowe">{inspection.userEmail}</td>
                                        <td data-title="Opcje"><button className='cancel-btn' style={{ width: '100%', cursor: 'pointer' }} onClick={(e) => handleDeleteInspectionByAdmin(e, inspection.id)}>Odwołaj</button></td>
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

export default Rezerwacje;
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
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)

    const [data, setData] = useState([])
    const [vehicles, setVehicles] = useState([])
    const [stands, setStands] = useState([])

    const statutesTranslations = {
        ARRANGED: "Zaplanowane",
        PASSED: "Wynik pozytywny",
        NOT_PASSED: "Wynik negatywny",
    }

    useEffect(() => {
        getAllInspections()
    }, [])

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
                                <th>Dane kontaktowe</th>
                                <th>Opcje</th>
                            </tr>
                        </thead>
                        <tbody>
                            { data && data.map((reservation) => {
                                return(
                                    <tr key={reservation.id} className={panelStyles['tbody-rows']}>
                                        <td data-title="Id">{reservation.id}</td>
                                        <td data-title="Pojazd">{reservation.id}</td>
                                        <td data-title="Data">{reservation.date}</td>
                                        <td data-title="Godz. rozpoczęcia">{reservation.inspectionStart}</td>
                                        <td data-title="Godz. zakończenia">{reservation.inspectionEnd}</td>
                                        <td data-title="Stanowisko">{reservation.standId}</td>
                                        <td data-title="Status">{statutesTranslations[reservation.status]}</td>
                                        <td data-title="Dane kontaktowe">{reservation.userEmail}</td>
                                        <td data-title="Opcje"><button className='cancel-btn' style={{ width: '100%', cursor: 'pointer' }} onClick={() => console.log('click')}>Odwołaj</button></td>
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
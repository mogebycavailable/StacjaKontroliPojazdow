import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom"
import { toast, ToastContainer } from 'react-toastify'
import '../css/Style.css'
import styles from './MojeRezerwacje.module.css'
import notes_icon from '../css/img/notes.png'
import useRefresh from '../../service/useRefresh'
import apiRequest from '../../service/restApiService'

const MojeRezerwacje = () => {
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
        const url = "http://localhost:8080/api/user/inspections"
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
    const handleDeleteInspection = async (e, id) => {
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
                            Pomyślnie odwołano rezerwację:<br/>
                            {data.vehicle.brand} {data.vehicle.model}<br/>
                            {data.vehicle.registrationNumber}
                        </div>,
                        {
                        onOpen: () => setIsBlocked(true),
                        onClose: () => {
                            window.location.assign('/moje_rezerwacje')
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
            console.log("Brak zgody użytkownika na odwołanie rezerwacji.")
        }
    }

    return(
        <div>
            {/* Nakładka blokująca */}
            {isBlocked && <div className="overlay"></div>}

            <h2>Moje rezerwacje</h2>
            <main>
                <button style={{margin: '20px auto', fontSize: '20px'}} onClick={() => navigate('/zamow_usluge')}>Umów się na przegląd</button>
                { data.length === 0 && (<div className="prompt">Brak rezerwacji</div>)}
                { data.length > 0 && data.map((inspection) => {
                    return(
                        <div key={inspection.id} className={styles.inspection}>
                            <div className={styles.photo}>
                                <img className={styles['inspection-img']} src={notes_icon}/>
                            </div>
                            <div className={styles['inspection-container']}>
                                <div className={styles['inspection-data']}>
                                    <div>Pojazd:</div><div>{inspection.vehicle.brand} {inspection.vehicle.model} ({inspection.vehicle.registrationNumber})</div>
                                </div>

                                <div className={styles['inspection-data']}>
                                    <div>Data:</div><div>{inspection.date}</div>
                                </div>

                                <div className={styles['inspection-data']}>
                                    <div>Planowany czas rozpoczęcia:</div><div>{inspection.inspectionStart}</div>
                                </div>

                                <div className={styles['inspection-data']}>
                                    <div>Planowany czas zakończenia:</div><div>{inspection.inspectionEnd}</div>
                                </div>

                                <div className={styles['inspection-data']}>
                                    <div>Stanowisko:</div><div>{inspection.stand.name}</div>
                                </div>

                                <div className={styles['inspection-data']}>
                                    <div>Nazwa użytkownika:</div><div>{inspection.userEmail}</div>
                                </div>

                                <div className={styles['inspection-data']}>
                                    <div>Status:</div><div>{statutesTranslations[inspection.status]}</div>
                                </div>

                                <div className={styles['inspection-data']}>
                                    <div>Opis:</div>
                                    { inspection.description.length > 0 ? <textarea readOnly value={inspection.description}/> : <div>Brak</div> }
                                </div>

                                <div className='btns'>
                                    <button className='cancel-btn' style={{width: 'auto'}} onClick={(e) => handleDeleteInspection(e, inspection.id)}>Odwołaj</button>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </main>
            <ToastContainer 
                position="top-center"
                theme="dark"
                closeOnClick={true}
            />
	    </div>
    );
};

export default MojeRezerwacje;
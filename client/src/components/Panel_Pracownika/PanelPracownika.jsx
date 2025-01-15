import React, { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom"
import { toast, ToastContainer } from 'react-toastify'
import '../css/Style.css'
import useRefresh from '../../service/useRefresh'
import apiRequest from '../../service/restApiService'

const PanelPracownika = () => {
    const navigate = useNavigate()
    const refreshTokens = useRefresh()
    const [isBlocked, setIsBlocked] = useState(false)

    const [paramsToFetch, setParamsToFetch] = useState({
        standId: '',
        standName: '',
        date: '',
    })

    const [stands, setStands] = useState([])

    const validStep = paramsToFetch.standId && paramsToFetch.date
    
    useEffect(() => {
        getAllStands()
    }, [])

    // GET
    const getAllStands = async () => {
        const url = "http://localhost:8080/api/user/stand"
        await apiRequest({
            url,
            useToken: true,
            onSuccess: ((status, data) => {
                setStands(data)
            }),
            refreshTokens,
        })
    }

    return(
        <div>
            {/* Nakładka blokująca */}
            {isBlocked && (<div className="overlay"></div>)}

            <h2>Panel pracownika</h2>

            <main>
                <fieldset className='fieldset-form'>
                    <legend>Wybierz stanowisko i datę</legend>
                    <div className='step-form-div'>
                        <div className='form-group'>
                            <label>Stanowisko</label>
                            <select
                                name="standId"
                                value={`${paramsToFetch.standId},${paramsToFetch.standName}`}
                                onChange={ (e) => {
                                    const [standId, standName] = e.target.value.split(',')
                                    setParamsToFetch((prev) => ({ ...prev, standId, standName }))
                                }}
                                required
                            >
                                <option value="">{ stands.length === 0 ? "Brak dodanych stanowisk" : "Wybierz stanowisko"}</option>
                                {stands.map((stand) => (
                                    <option key={stand.id} value={`${stand.id},${stand.name}`}>
                                        Stanowisko {stand.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className='form-group'>
                            <label>Data:</label>
                            <input
                                type="date"
                                name="date"
                                value={paramsToFetch.date}
                                onChange={(e) => setParamsToFetch((prev) => ({ ...prev, date: e.target.value }))}
                                required
                            /> 
                        </div>

                        <div className='btns'>
                            <button className='refresh-btn' onClick={() => setParamsToFetch((prev) => ({ ...prev, standId: '', date: '' }))}>&#x27F2;</button>
                            { validStep && <button className='step-btn' onClick={() => navigate(`/panel_pracownika/zarzadzanie_badaniami/${paramsToFetch.standId}/${paramsToFetch.standName}/${paramsToFetch.date}`)}>&#129094;</button> }
                        </div>
                    </div>
                </fieldset>
            </main>
            
            <ToastContainer 
                position="top-center"
                theme="dark"
                closeOnClick={true}
            />
	    </div>
    )
}

export default PanelPracownika
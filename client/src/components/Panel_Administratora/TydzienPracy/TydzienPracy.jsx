import React, { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom"
import { toast, ToastContainer } from 'react-toastify'
import Switch from 'react-switch'
import '../../css/Style.css'
import panelStyles from '../PanelAdministratora.module.css'
import useRefresh from '../../../service/useRefresh'
import apiRequest from '../../../service/restApiService'

const TydzienPracy = () => {
    const navigate = useNavigate()
    const refreshTokens = useRefresh()
    const [isBlocked, setIsBlocked] = useState(false)

    const [data, setData] = useState([])

    const [editingWorkDay, setEditingWorkDay] = useState(null)
    const [editingWorkDayData, setEditingWorkDayData] = useState({
        workStart: '',
        workEnd: '',
        isWorkFree: false
    })

    const weekDays = [
        {key: 'MONDAY', label: 'Poniedziałek'},
        {key: 'TUESDAY', label: 'Wtorek'},
        {key: 'WEDNESDAY', label: 'Środa'},
        {key: 'THURSDAY', label: 'Czwartek'},
        {key: 'FRIDAY', label: 'Piątek'},
        {key: 'SATURDAY', label: 'Sobota'},
        {key: 'SUNDAY', label: 'Niedziela'},
    ]

    const handleChange = ({ currentTarget: input }) => {
        setEditingWorkDayData((prev) => ({ ...prev , [input.name]: input.value }))
    }

    const handleEditClick = (day) => {
        setEditingWorkDay(day.weekDay)
        setEditingWorkDayData({
            weekDay: day.weekDay,
            workStart: day.workStart,
            workEnd: day.workEnd,
            isWorkFree: day.isWorkFree
        })
    }
  
    const handleCancelEditing = () => {
        setEditingWorkDay(null)
        setEditingWorkDayData({
            workStart: '',
            workEnd: '',
            isWorkFree: false
        })
    }

    const sortedWorkWeekDays = data.sort((a, b) => {
        const indexA = weekDays.findIndex((d) => d.key === a.weekDay);
        const indexB = weekDays.findIndex((d) => d.key === b.weekDay);
        return indexA - indexB;
    })

    useEffect(() => {
        getWorkWeek()
    }, [])

    // GET
    const getWorkWeek = async () => {
        const url = "http://localhost:8080/api/admin/workweek"
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
    const handleEditWorkDay = async (e) => {
        e.preventDefault()

        if(window.confirm('Czy na pewno chcesz zaaktualizować tydzień pracy?')){
            const workDay = {
                workStart: editingWorkDayData.workStart,
                workEnd: editingWorkDayData.workEnd,
                isWorkFree: editingWorkDayData.isWorkFree
            }
            const url = "http://localhost:8080/api/admin/workweek/"+editingWorkDay
            await apiRequest({
                url,
                useToken: true,
                method: 'PATCH',
                body: workDay,
                onSuccess: ((status, data) => {
                    toast.success(
                        <div>
                            Zapisano zmiany dla dnia pracy:<br/>
                            {weekDays.find((day) => day.key === data.weekDay)?.label || 'Nieznany dzień'}
                        </div>,
                        {
                        onOpen: () => setIsBlocked(true),
                        onClose: () => {
                            window.location.assign('/panel_administratora/tydzien_pracy')
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
            console.log("Brak zgody administratora na edycje tygodnia pracy.")
        }
        setEditingWorkDay(null)
    }

    return(
        <div>
            {/* Nakładka blokująca */}
            {isBlocked && <div className="overlay"></div>}

            <h2>Zarządzanie tygodniem pracy</h2>
            <button className={panelStyles['back-arrow']} onClick={() => navigate('/panel_administratora')}>&#8592;</button>

            <main>
                <table>
                    <thead>
                        <tr className={panelStyles.theaders}>
                            <th>Dzień tygodnia</th>
                            <th>Godzina rozpoczęcia</th>
                            <th>Godzina zakończenia</th>
                            <th>Dzień wolny</th>
                            <th>Opcje</th>
                        </tr>
                    </thead>
                    <tbody>
                        { data && sortedWorkWeekDays.map((day) => {
                            const matchedDay = weekDays.find(d => d.key === day.weekDay)

                            if(editingWorkDay === day.weekDay){
                                return(
                                    <tr key={day.weekDay}>
                                        <td data-title="Dzień tygodnia">{matchedDay ? matchedDay.label : "Nieznany dzień"}</td>
                                        <td data-title="Godzina rozpoczęcia">
                                            <input
                                                style={{width: '70%', fontSize: '150%', borderRadius: '8px'}}
                                                type='time'
                                                required
                                                name='workStart'
                                                value={editingWorkDayData.workStart}
                                                onChange={handleChange}
                                            />
                                        </td>
                                        <td data-title="Godzina zakończenia">
                                            <input
                                                style={{width: '70%', fontSize: '150%', borderRadius: '8px'}}
                                                type='time'
                                                required
                                                name='workEnd'
                                                value={editingWorkDayData.workEnd}
                                                onChange={handleChange}
                                            />
                                        </td>
                                        <td data-title="Dzień wolny">
                                            <Switch
                                                name='isWorkFree'
                                                checked={editingWorkDayData.isWorkFree}
                                                onChange={(checked) => {setEditingWorkDayData((prevState) => ({...prevState, isWorkFree: checked}))}}
                                            />
                                        </td>
                                        <td data-title="Opcje">
                                            <div className='btns'>
                                                <button className='save-btn' onClick={handleEditWorkDay}>&#x1F4BE;</button>
                                                <button className='cancel-btn' onClick={handleCancelEditing}>&#x2716;</button>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            }

                            return(
                                <tr key={day.weekDay} className={panelStyles['tbody-rows']}>
                                    <td data-title="Dzień tygodnia">{matchedDay ? matchedDay.label : "Nieznany dzień"}</td>
                                    <td data-title="Godzina rozpoczęcia">{day.workStart}</td>
                                    <td data-title="Godzina zakończenia">{day.workEnd}</td>
                                    <td data-title="Dzień wolny">{day.isWorkFree ? 'TAK' : 'NIE' }</td>
                                    <td data-title="Opcje"><button className='edit-btn' style={{ width: '100%', cursor: 'pointer' }} onClick={(e) => {e.stopPropagation(); handleEditClick(day)}}>&#9881;</button></td>
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
    )
}

export default TydzienPracy

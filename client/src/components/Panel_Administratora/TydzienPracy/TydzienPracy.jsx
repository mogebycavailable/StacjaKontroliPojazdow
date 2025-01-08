import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from "react-router-dom"
import { toast, ToastContainer } from 'react-toastify'
import Switch from 'react-switch'
import '../../css/Style.css'
import './TydzienPracy.css'
import useRefresh from '../../../service/useRefresh'

const TydzienPracy = () => {
    const refreshTokens = useRefresh()
    const [isBlocked, setIsBlocked] = useState(false)

    const [data, setData] = useState([])
    const [isEditingWorkDay, setIsEditingWorkDay] = useState(false)

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

    useEffect(() => {
        const getWorkWeek = async () => {
            try {
                const accessToken = localStorage.getItem('access-token')
                const url = "http://localhost:8080/api/admin/workweek"
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
            } catch(error) {
                console.error("Błąd sieci:", error)
            }
        }

        getWorkWeek()
    }, [])

    const openCloseEditWorkDaySection = () => {
        setIsEditingWorkDay((prev) => !prev)
        setEditingWorkDay(null)
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

    const handleEditWorkDay = async (e) => {
        e.preventDefault()

        if(window.confirm('Czy na pewno chcesz zaaktualizować tydzień pracy?')){
            setIsBlocked(true)

            const workDay = {
                workStart: editingWorkDayData.workStart,
                workEnd: editingWorkDayData.workEnd,
                isWorkFree: editingWorkDayData.isWorkFree
            }

            try {
                const accessToken = localStorage.getItem('access-token')
                const url = "http://localhost:8080/api/admin/workweek/"+editingWorkDay
                const response = await fetch(url, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`,
                    },
                    body: JSON.stringify(workDay),
                })

                const responseStatus = response.status

                if (responseStatus >= 200 && responseStatus <= 299) {
                    const resData = await response.json()
                    const matchedDay = weekDays.find(d => d.key === resData.weekDay)
                    toast.success(
                        <div>
                            Zapisano zmiany dla dnia pracy:<br/>
                            {matchedDay.label}
                        </div>,
                        {
                        onClose: () => {
                            window.location.assign('/panel_administratora/tydzien_pracy')
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
        } else {
            console.log("Brak zgody administratora na edycje tygodnia pracy.")
        }
        setEditingWorkDay(null)
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

    return(
        <div className='div-body'>
            {/* Nakładka blokująca */}
            {isBlocked && <div className="overlay"></div>}

            <h2>Zarządzanie tygodniem pracy</h2>
            <Link to='/panel_administratora' className='back-arrow'>&#8592;</Link>

            <main>
                <table>
                    <thead>
                        <tr className='theaders'>
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
                                        <td>{matchedDay ? matchedDay.label : "Nieznany dzień"}</td>
                                        <td>
                                            <input
                                                type='time'
                                                required
                                                name='workStart'
                                                value={editingWorkDayData.workStart}
                                                onChange={handleChange}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type='time'
                                                required
                                                name='workEnd'
                                                value={editingWorkDayData.workEnd}
                                                onChange={handleChange}
                                            />
                                        </td>
                                        <td>
                                            <Switch
                                                name='isWorkFree'
                                                checked={editingWorkDayData.isWorkFree}
                                                onChange={(checked) => {setEditingWorkDayData((prevState) => ({...prevState, isWorkFree: checked}))}}
                                            />
                                        </td>
                                        <td>
                                            <div className='save-cancel-btns'>
                                                <div className='save-workday' onClick={handleEditWorkDay}>&#x1F4BE;</div>
                                                <div className='cancel-editing-workday' onClick={handleCancelEditing}>&#x2716;</div>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            }

                            return(
                                <tr key={day.weekDay} className='tbody-rows'>
                                    <td>{matchedDay ? matchedDay.label : "Nieznany dzień"}</td>
                                    <td>{day.workStart}</td>
                                    <td>{day.workEnd}</td>
                                    <td>{day.isWorkFree ? 'TAK' : 'NIE' }</td>
                                    <td className='edit-workday' onClick={(e) => {e.stopPropagation(); handleEditClick(day)}}>&#9881;</td>
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

export default TydzienPracy;

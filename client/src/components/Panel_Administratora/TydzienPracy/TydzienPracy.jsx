import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from "react-router-dom"
import { toast, ToastContainer } from 'react-toastify'
import Switch from 'react-switch'
import '../../css/Style.css'
import './TydzienPracy.css'
import useRefresh from '../../../service/useRefresh'
import apiRequest from '../../../service/restApiService'

const TydzienPracy = () => {
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

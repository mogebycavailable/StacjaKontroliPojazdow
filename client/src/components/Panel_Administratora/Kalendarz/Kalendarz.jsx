import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from "react-router-dom"
import { toast, ToastContainer } from 'react-toastify'
import Switch from 'react-switch'
import Calendar from 'react-calendar'
import { format, getMonth, getYear } from 'date-fns'
//import 'react-calendar/dist/Calendar.css'
import '../../css/Style.css'
import './Kalendarz.css'
import useRefresh from '../../../service/useRefresh'

const Kalendarz = () => {
    const refreshTokens = useRefresh()
    const weekDays = [
        {key: 'MONDAY', label: 'Poniedziałek'},
        {key: 'TUESDAY', label: 'Wtorek'},
        {key: 'WEDNESDAY', label: 'Środa'},
        {key: 'THURSDAY', label: 'Czwartek'},
        {key: 'FRIDAY', label: 'Piątek'},
        {key: 'SATURDAY', label: 'Sobota'},
        {key: 'SUNDAY', label: 'Niedziela'},
    ]
    const [isBlocked, setIsBlocked] = useState(false)
    const [activeDays, setActiveDays] = useState([])
    const [calendarDate, setCalendarDate] = useState(null)
    const [currentMonth, setCurrentMonth] = useState(getMonth(new Date())) // aktualny miesiac (0-11)
    const [currentYear, setCurrentYear] = useState(getYear(new Date()))

    const isDateActive = activeDays.some((day) => day.date === calendarDate)

    const [dateDetails, setDateDetails] = useState({
        weekDay: '',
        date: '',
        description: '',
        workStart: '',
        workEnd: '',
        isWorkFree: false
    })
    
    const [dateRange, setDateRange] = useState({
        startingDate: '',
        endingDate: ''
    })

    const handleActiveStartDateChange = ({ activeStartDate }) => {
        setCurrentMonth(getMonth(activeStartDate))
        setCurrentYear(getYear(activeStartDate))
    }

    // GET-y
    const getActiveDates = async (year, month) => {
        try {
            const accessToken = localStorage.getItem('access-token')
            const url = `http://localhost:8080/api/admin/calendar/${year}/${month+1}`
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
                setActiveDays(resData)
            } else {
                console.error("Błąd podczas pobierania danych zabezpieczonych:", responseStatus)
            }

            await refreshTokens(responseStatus)
        } catch (error) {
            console.error("Błąd sieci:", error)
        }
    }

    useEffect(() => {
        getActiveDates(currentYear, currentMonth)
    }, [currentYear, currentMonth])

    const handleDateChange = (date) => {
        const formattedDate = format(date, 'yyyy-MM-dd')
        setCalendarDate(formattedDate)

        const getDateDetails = async () => {
            try {
                const accessToken = localStorage.getItem('access-token')
                const url = "http://localhost:8080/api/admin/calendar/"+formattedDate
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
                    setDateDetails(resData)
                } else if(responseStatus === 404) {
                    console.log("Wybrany dzień jest nieaktywowany:", responseStatus)
                    toast.warning("Wybrany dzień jest nieaktywowany", {
                        onClose: () => {
                            setIsBlocked(false)
                        },
                        autoClose: 1000,
                    })
                    setIsBlocked(false)
                } else {
                    console.error("Błąd podczas pobierania danych zabezpieczonych:", responseStatus)
                }

                await refreshTokens(responseStatus)
            } catch (error) {
                console.error("Błąd sieci:", error)
            }
        }

        getDateDetails()
    }

    // POST-y
    const handleActivationDateRange = async (e) => {
        e.preventDefault()

        if(window.confirm('Czy na pewno chcesz aktywować ten zakres dat?')){
            setIsBlocked(true)

            const activationDateRange = {
                startingDate: dateRange.startingDate,
                endingDate: dateRange.endingDate
            }

            try {
                const accessToken = localStorage.getItem('access-token')
                const url = "http://localhost:8080/api/admin/calendar/range"
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`,
                    },
                    body: JSON.stringify(activationDateRange),
                })

                const responseStatus = response.status

                if (responseStatus >= 200 && responseStatus <= 299) {
                    toast.success(
                        <div>
                            Aktywowano daty z podanego zakresu
                        </div>,
                        {
                        onClose: () => {
                            window.location.assign('/panel_administratora/kalendarz')
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
        } else {
            console.log("Brak zgody administratora na aktywowanie kalendarza w podanym zakresie.")
        }
    }

    const handleSetActiveDate = async (e) => {
        e.preventDefault()
        setIsBlocked(true)

        try {
            const accessToken = localStorage.getItem('access-token')
            const url = "http://localhost:8080/api/admin/calendar"
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
                body: JSON.stringify(calendarDate),
            })

            const responseStatus = response.status

            if (responseStatus >= 200 && responseStatus <= 299) {
                const resData = await response.json()
                toast.success(
                    <div>
                        Aktywowano date: {resData.date}
                    </div>,
                    {
                    onClose: () => {
                        window.location.assign('/panel_administratora/kalendarz')
                        setIsBlocked(false)
                    },
                    autoClose: 1000,
                })
            } else if (responseStatus === 400) {
                const resData = await response.text()
                console.error(resData)
                toast.error(resData, {
                    onClose: () => {
                        setIsBlocked(false)
                    },
                    autoClose: 1000,
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

    // UPDATE-y
    const handleEditDateDetails = async (e) => {
        e.preventDefault()

        if(window.confirm('Czy na pewno chcesz zapisać zmiany dla tego dnia?')){
            setIsBlocked(true)
            
            const editingDate = {
                date: dateDetails.date,
                updateData: {
                    description: dateDetails.description,
                    workStart: dateDetails.workStart,
                    workEnd: dateDetails.workEnd,
                    isWorkFree: dateDetails.isWorkFree
                }
            }

            try {
                const accessToken = localStorage.getItem('access-token')
                const url = "http://localhost:8080/api/admin/calendar"
                const response = await fetch(url, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`,
                    },
                    body: JSON.stringify(editingDate),
                })

                const responseStatus = response.status

                if (responseStatus >= 200 && responseStatus <= 299) {
                    const resData = await response.json()
                    toast.success(
                        <div>
                            Zapisano zmiany dla dnia:<br/>
                            {resData.date}
                        </div>,
                        {
                        onClose: () => {
                            getActiveDates(currentYear, currentMonth)
                            window.location.assign('/panel_administratora/kalendarz')
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
            console.log("Brak zgody administratora na dokonanie zmian dla tego dnia w kalendarzu.")
        }
    }

    // DELETE-y (dezaktywacje)
    const handleDeactivationDate = async (e) => {
        e.preventDefault()
        setIsBlocked(true)

        try {
            const accessToken = localStorage.getItem('access-token')
            const url = "http://localhost:8080/api/admin/calendar"
            const response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
                body: JSON.stringify(calendarDate)
            })

            const responseStatus = response.status

            if (responseStatus >= 200 && responseStatus <= 299) {
                const resData = await response.json()
                toast.success(
                    <div>
                        Dezaktywowano datę: {resData.date}
                    </div>,
                    {
                    onClose: () => {
                        window.location.assign('/panel_administratora/kalendarz')
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
    }

    const handleDeactivationDateRange = async (e) => {
        e.preventDefault()

        if(window.confirm('Czy na pewno chcesz zdezaktywować ten zakres dat?')) {
            setIsBlocked(true)

            const deactivationDateRange = {
                startingDate: dateRange.startingDate,
                endingDate: dateRange.endingDate
            }

            try {
                const accessToken = localStorage.getItem('access-token')
                const url = "http://localhost:8080/api/admin/calendar/range"
                const response = await fetch(url, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`,
                    },
                    body: JSON.stringify(deactivationDateRange)
                })
    
                const responseStatus = response.status

                if (responseStatus >= 200 && responseStatus <= 299) {
                    const resData = await response.json()
                    toast.success(
                        <div>
                            Zdezaktywowano zakres podanych dat
                        </div>,
                        {
                        onClose: () => {
                            window.location.assign('/panel_administratora/kalendarz')
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
            console.log("Brak zgody administratora na dezaktywacje podanej daty.")
        }
    }
    
    // FUNKCJA OBSŁUGUJĄCA WYGLĄD KOMPONENTU <CALENDAR/>

    const tileClassName = ({ date, view }) => {
        if (view === 'month') {
            const formattedDate = format(date, 'yyyy-MM-dd')
            const todayFormatted = format(new Date(), 'yyyy-MM-dd')
            const dayData = activeDays.find((day) => day.date === formattedDate)

            let classes = []
            if (formattedDate === todayFormatted) {
                classes.push('today')
            }

            if (dayData) {
                classes.push(dayData.isWorkFree ? 'free-day' : 'work-day')
            } else {
                classes.push('inactive-day')
            }

            return classes.join(' ')
        }
        return ''
    }

    return(
        <div className='div-body'>
            {/* Nakładka blokująca */}
            {isBlocked && <div className="overlay"></div>}

            <h2>Zarządzanie kalendarzem</h2>
            <Link to='/panel_administratora' className='back-arrow'>&#8592;</Link>

            <main>
                <div className='calendar-content'>
                    <div className='calendar-container'>
                        <Calendar
                            value={calendarDate}
                            onChange={handleDateChange}
                            onActiveStartDateChange={handleActiveStartDateChange}
                            tileClassName={tileClassName}
                            //tileDisabled={tileDisabled}
                        />
                    </div>
                    <div className='other-content'>
                        {calendarDate ? ( 
                            isDateActive ? (
                                <div className="date-details">
                                    Wybrano dzień: {format(new Date(calendarDate), 'yyyy-MM-dd')}
                                    <form onSubmit={handleEditDateDetails}>
                                        <label>Dzień: {weekDays.find((day) => day.key === dateDetails.weekDay)?.label || 'Nieznany dzień'}</label>
                                        <label>Start pracy:
                                            <input
                                                type='time'
                                                name='workStart'
                                                value={dateDetails.workStart}
                                                onChange={(e) => {setDateDetails((prevState) => ({...prevState, workStart: e.target.value}))}}
                                                required
                                            />
                                        </label>
                                        <label>Koniec pracy:
                                            <input
                                                type='time'
                                                name='workEnd'
                                                value={dateDetails.workEnd}
                                                onChange={(e) => {setDateDetails((prevState) => ({...prevState, workEnd: e.target.value}))}}
                                                required
                                            />
                                        </label>
                                        <label>Dzień wolny: 
                                            <Switch
                                                name='isWorkFree'
                                                checked={dateDetails.isWorkFree}
                                                onChange={(checked) => {setDateDetails((prevState) => ({...prevState, isWorkFree: checked}))}}
                                            />
                                        </label>
                                        <label>Opis</label>
                                        <textarea
                                            className='description'
                                            name='description'
                                            value={dateDetails.description}
                                            onChange={(e) => {setDateDetails((prevState) => ({...prevState, description: e.target.value}))}}
                                        />
                                        <div className='editing-date-details-btns'>
                                            <button className='save-date-details' type='submit'>&#x1F4BE;</button>
                                            <button className='deactivate-date' onClick={handleDeactivationDate}>&#x1F512;</button>
                                            <button className='cancel-editing-date-details' onClick={() => setCalendarDate(null)}>&#x2716;</button>
                                        </div>
                                    </form>
                                </div>
                            ) : (
                                <div>
                                    <button onClick={handleSetActiveDate}>Aktywuj &gt; &#x1F513;</button>
                                </div>
                            )
                        ) : (
                            <div className="date-details">Nie wybrano żadnego dnia</div>
                        )}
                    </div>
                </div>
                <div className='setting-calendar-range'>
                    <form>
                        <label>
                            Początek zakresu:
                            <input
                                type='date'
                                name='startingDate'
                                value={dateRange.startingDate}
                                onChange={(e) => {setDateRange((prevState) => ({...prevState, startingDate: e.target.value}))}}
                                required
                            />
                        </label>
                        <label>
                            Koniec zakresu:
                            <input
                                type='date'
                                name='endingDate'
                                value={dateRange.endingDate}
                                onChange={(e) => {setDateRange((prevState) => ({...prevState, endingDate: e.target.value}))}}
                                required
                            />
                        </label>
                        <div className='activation-dates-btns'>
                            <button className='activate-range' onClick={handleActivationDateRange}>&#x1F513;</button>
                            <button className='deactivate-range' onClick={handleDeactivationDateRange}>&#x1F512;</button>
                            <button className='cancel-activation' onClick={() => setDateRange({startingDate: '', endingDate: ''})}>&#x2716;</button>
                        </div>
                    </form>
                </div>
            </main>
            
            <ToastContainer 
                position="top-center"
                theme="dark"
                closeOnClick={true}
            />
	    </div>
    );
};

export default Kalendarz;

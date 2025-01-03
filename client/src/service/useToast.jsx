import { useState, useEffect } from 'react'
import { toast, ToastContainer } from 'react-toastify'

const useToast = () => {
    const [isBlocked, setIsBlocked] = useState(true)

    const displayToast = async (type, message, link) => {
        if(type == 'success') {
            toast.success(message, {
                onClose: () => {
                    window.location.assign(link)
                    setIsBlocked(false)
                },
                autoClose: 3000,
            })
        } else {
            toast.success('Przepraszamy, błąd modułu powiadomień.', {
                onClose: () => {
                    window.location.assign(link)
                    setIsBlocked(false)
                },
                autoClose: 3000,
            })
        }
    }

    return displayToast
}

export default useToast
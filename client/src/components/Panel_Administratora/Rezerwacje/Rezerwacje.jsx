import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from "react-router-dom"
import { toast, ToastContainer } from 'react-toastify'
import '../../css/Style.css'
import useRefresh from '../../../service/useRefresh'

const Rezerwacje = () => {
    const refreshTokens = useRefresh()
    const [isBlocked, setIsBlocked] = useState(false)

    return(
        <div className='div-body'>
            {/* Nakładka blokująca */}
            {isBlocked && <div className="overlay"></div>}

            <h2>Zarządzanie rezerwacjami</h2>

            
            
            <ToastContainer 
                position="top-center"
                theme="dark"
                closeOnClick={true}
            />
	    </div>
    );
};

export default Rezerwacje;
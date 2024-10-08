import React from 'react'
import { Route, Routes } from 'react-router-dom'
import HomePage from '../Pages/HomePage'
import SelectSeat from '../Pages/SelectSeat'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

export default function ProjectRoutes() {
    return (
        <>
            <Routes>
                <Route path='' element={<HomePage />} />
                <Route path='/select-seat' element={<SelectSeat />} />
            </Routes>
            <ToastContainer
                autoClose={1500}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss={false}
                draggable={false}
                pauseOnHover={true}
                theme="light" />
        </>
    )
}

import React from 'react'
import { PulseLoader } from 'react-spinners'

export default function Loader({ className }) {
    return (
        <button
            type='button'
            disabled
            className={className ? className : "flex w-full justify-center tracking-wider font-tbPop rounded-md bg-sky-400 px-3 py-2.5 text-base font-semibold leading-6 text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400"}
        >
            Loading<span><PulseLoader color="#fff" size={5} /></span>
        </button>
    )
}

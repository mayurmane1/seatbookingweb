import { Location } from 'iconsax-react'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import Loader from '../Components/Loader/Loader';
import { useNavigate } from 'react-router-dom';
import Error from '../Components/Error/Error';
import { toast } from 'react-toastify';
import { getCities, getRoute } from '../API/Api';

export default function HomePage() {
    const [cities, setCities] = useState([]);
    const [loader, setLoader] = useState(false);
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors },
    } = useForm();
    let from = watch('from')
    let to = watch('to')
    const Submit = async (data) => {
        setLoader(true);
        if (from === to) {
            toast.error('Origin can not be equal to destination')
            setLoader(false);
            return;
        } else {
            try {
                await getRoute(data).then(res => {
                    if (res.status == 200) {
                        setLoader(false)
                        navigate('/select-seat', { state: res?.data })
                    } else {
                        toast.error(res?.message)
                        setLoader(false)
                    }
                })
            } catch (error) {
                console.log('error', error)
                setLoader(false)
            }
        }
    }

    useEffect(() => {
        getCities().then(res => {
            if (res?.status == 200) {
                setCities(res?.data)
            } else {
                toast.error(res?.message)
            }
        })
    }, [])

    return (
        <>
            <div className='flex bg-slate-100 h-screen justify-center items-center p-4 bg-Background'>
                <form onSubmit={handleSubmit(Submit)} className='w-full flex justify-center items-center'>
                    <div className='bg-white px-4 py-2 w-1/2 shadow-xl space-y-2'>
                        <p>BUY TICKET</p>
                        <div className='grid grid-cols-12 gap-x-2'>
                            <div className='col-span-5 space-y-1'>
                                <div className='flex items-center gap-x-1'>
                                    <Location variant='Bold' size={20} />
                                    <p className='font-semibold capitalize font-tbMon'>From :</p>
                                </div>
                                <div>
                                    <select
                                        className='border-2 border-slate-100 w-full p-2 rounded'
                                        {...register('from', { required: true })}
                                    >
                                        <option className='!text-gray-200' value=''>Please Select</option>
                                        {
                                            cities.map(item => (
                                                <option key={item?.id} value={item?.id}>{item?.city}</option>
                                            ))
                                        }
                                    </select>
                                    {errors?.from && <Error title='This field is important' />}
                                </div>
                            </div>
                            <div className='col-span-5 space-y-1'>
                                <div className='flex items-center gap-x-1'>
                                    <Location variant='Bold' size={20} />
                                    <p className='font-semibold capitalize font-tbMon'>To :</p>
                                </div>
                                <div>
                                    <select
                                        className='border-2 w-full border-slate-100 p-2 rounded'
                                        {...register('to', { required: true })}
                                    >
                                        <option className='!text-gray-200' value=''>Please Select</option>
                                        {
                                            cities.map(item => (
                                                <option key={item?.id} value={item?.id}>{item?.city}</option>
                                            ))
                                        }
                                    </select>
                                    {errors?.to && <Error title='This field is important' />}
                                </div>
                            </div>
                        </div>
                        <div className='bg-sky-400'>
                            {
                                loader ? <Loader /> : <button type='submit' className='w-full p-2 text-white font-semibold border-0 rounded-md hover:bg-sky-600' >
                                    Search
                                </button>
                            }
                        </div>
                    </div>
                </form>

            </div>
        </>
    )
}

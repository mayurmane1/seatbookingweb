import { Armchair } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import rightImg from '../assets/Images/Flight Booking-pana.png'
import { bookSeat, getBookings, getSeats } from '../API/Api';
import { toast } from 'react-toastify';
import Loader from '../Components/Loader/Loader';

export default function SelectSeat() {
    const [seat, setSeat] = useState();
    const [seatData, setSeatData] = useState([]);
    const [bookingData, setBookingData] = useState([]);
    const [loader, setLoader] = useState(false);

    const { state } = useLocation();
    const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm();
    const selectedSeat = watch("selectedSeat");

    const fetchData = async () => {
        try {
            const seatResponse = await getSeats();
            const bookingResponse = await getBookings(state?.id);

            if (seatResponse?.status === 200 && bookingResponse?.status === 200) {
                const seats = seatResponse?.data;
                const bookings = bookingResponse?.data;

                // Mark seats as booked based on booking data
                const updatedSeats = seats.map(seat => {
                    const isBooked = bookings.some(booking => booking.seat.id === seat.id);
                    return { ...seat, is_booked: isBooked };
                });

                setSeatData(updatedSeats);
                setBookingData(bookings);
            } else {
                toast.error(seatResponse?.message || bookingResponse?.message);
            }
        } catch (error) {
            toast.error('Failed to fetch seat or booking data');
        }
    };


    const handleSeatClick = (seat) => {
        setSeat(seat);
        if (!seat.is_booked) {
            if (selectedSeat === seat.seat_number) {
                setValue("selectedSeat", "");
            } else {
                setValue("selectedSeat", seat.seat_number);
            }
        }
    };

    const onSubmit = async (data) => {
        console.log('data===========', data)
        setLoader(true);
        if (!data.selectedSeat) {
            toast.error('Please select a seat to proceed with your booking.');
            setLoader(true);
        } else {
            const updatedData = {
                seat: seat?.id,
                route: state?.id,
                total_fare: state?.fare + seat?.fare,
                is_booked: true,
            }
            await bookSeat(updatedData).then(res => {
                if (res?.status == 200) {
                    toast.success(res?.message);
                    setLoader(false);
                    fetchData();
                } else {
                    toast.error(res?.message);
                    setLoader(false);
                }
            })
        }
    };

    const renderSeat = (seat) => (
        <div key={seat?.seat_number} className="flex flex-col items-center">
            <button
                type='button'
                onClick={() => handleSeatClick(seat)}
                className={`flex justify-center items-center rounded-md
                            ${seat?.is_booked ? 'bg-slate-400 cursor-not-allowed' :
                        selectedSeat === seat?.seat_number ? 'bg-green-400' :
                            'bg-white hover:bg-slate-100'}
                            `}
                disabled={seat?.is_booked}
            >
                <Armchair strokeWidth={0.5} size={28} />
            </button>
            <p className="text-xs mt-2 text-gray-500">{seat.seat_number}</p>
            <p className="text-sm mt-2 text-gray-500">{`₹${seat.fare}`}</p>
        </div>
    );

    useEffect(() => {
        // Fetch seat data and booking data
        fetchData();
    }, [state?.id]);

    return (
        <form onSubmit={handleSubmit(onSubmit)} className='bg-sky-100 h-screen grid grid-cols-2  p-2 place-items-center'>
            <div className='col-span-1 grid grid-cols-6 border-2 border-slate-300 rounded-md p-2 gap-x-2 space-y-4 '>
                <p className='col-span-6 bg-indigo-300 text-center py-1 px-4 rounded-md capitalize font-tbMon'>
                    Click on available seats to proceed with your booking
                </p>
                <div className="col-span-4 grid grid-cols-4 w-full bg-white p-4 rounded-md mt-10">
                    <div className="col-span-2">
                        <div className="grid grid-cols-1 gap-4">
                            {seatData?.filter(seat => seat.seat_type === 'single').map(renderSeat)}
                        </div>
                    </div>
                    <div className="col-span-2 ml-10">
                        <div className="grid grid-cols-2 gap-4">
                            {seatData?.filter(seat => seat.seat_type === 'double').map(renderSeat)}
                        </div>
                    </div>
                    <input type="hidden" {...register("selectedSeat")} /> {/* Hidden input for selected seat */}
                </div>
                <div className='col-span-2 flex flex-col border-2 py-2 px-4 bg-white border-slate-300 rounded-md'>
                    <p className='text-center font-semibold font-tbPop'>Seat Legend</p>
                    <div className='mt-2 flex justify-around'>
                        <div className='bg-white rounded-md'>
                            <Armchair strokeWidth={0.5} size={28} />
                        </div>
                        <p className='font-medium font-tbMon'>Empty Seats</p>
                    </div>
                    <div className='mt-2 flex justify-around'>
                        <div className='bg-slate-400 rounded-md'>
                            <Armchair strokeWidth={0.5} size={28} />
                        </div>
                        <p className='font-medium font-tbMon'>Booked Seats</p>
                    </div>
                    <div className='mt-2 flex justify-around'>
                        <div className='bg-green-400 rounded-md'>
                            <Armchair strokeWidth={0.5} size={28} />
                        </div>
                        <p className='font-medium font-tbMon'>Selected Seats</p>
                    </div>
                </div>
                {/* Move the button outside of the flex container for better positioning */}
            </div>
            <div className=' col-span-1 w-full rounded-md p-2'>
                {
                    selectedSeat ?
                        <div className='grid grid-cols-2 bg-white shadow-xl h-[100%] rounded-md py-2 px-4'>
                            <div className='border-r-2 border-b-2 space-y-2 px-4 py-2'>
                                <p className='font-bold text-xl'>Route Information</p>
                                <ul className='list-none space-y-1'>
                                    <li className='capitalize'><strong>Origin:</strong>{state?.source_city?.city}</li>
                                    <li className='capitalize'><strong>Seat Type:</strong>{state?.destination_city?.city}</li>
                                </ul>
                            </div>
                            <div className='border-b-2 space-y-2 px-4 py-2'>
                                <p className='font-bold text-xl'>Seat Information</p>
                                <ul className='list-none space-y-1'>
                                    <li><strong>Seat Number:</strong>{seat?.seat_number}</li>
                                    <li className='capitalize'><strong>Seat Type:</strong>{seat?.seat_type}</li>
                                </ul>
                            </div>
                            <div className="col-span-2 grid grid-cols-2 place-items-center mt-4">
                                <p className='font-bold text-xl col-span-2'>Breakdown</p>
                                <ul className='col-span-2 list-none space-y-1'>
                                    <li className='capitalize'><strong>Seat Fare:</strong>{seat?.fare}</li>
                                    <li className='capitalize'><strong>Route Fare:</strong>{state?.fare}</li>
                                    <li className='capitalize'><strong>Total Fare:</strong>{seat?.fare + state?.fare}</li>
                                </ul>
                            </div>
                            <div className="col-span-2 flex justify-center mt-4">
                                {
                                    loader ? <Loader /> : <button type="submit" className="bg-blue-500 w-full text-white py-2 px-4 rounded-md">
                                        Book Seat
                                    </button>
                                }
                            </div>
                        </div> :
                        <div className='bg-white flex justify-center rounded-md items-center'>
                            <img className='w-[63%]' src={rightImg} />
                        </div>
                }
            </div>

        </form>

    );
}

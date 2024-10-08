import axios from "axios"
import { environment } from "./env"


export const getCities = async () => {
    const url = `${environment.python_baseUrl}add-city/`
    try {
        const response = await axios.get(url);
        return response?.data
    } catch (error) {
        console.log('error===========', error);
    }
}

export const getRoute = async (data) => {
    const url = `${environment.python_baseUrl}get-route?source=${data?.from}&destination=${data?.to}`
    try {
        const response = await axios.get(url);
        return response?.data
    } catch (error) {
        console.log('error===========', error);
    }
}

export const getSeats = async () => {
    const url = `${environment.python_baseUrl}add-seat/`
    try {
        const response = await axios.get(url);
        return response?.data
    } catch (error) {
        console.log('error===========', error);
    }
}

export const getBookings = async (routeId) => {
    const url = `${environment.python_baseUrl}get-booking/${routeId}`
    try {
        const response = await axios.get(url);
        return response?.data
    } catch (error) {
        console.log('error===========', error);
    }
}

export const bookSeat = async (data) => {
    const url = `${environment.python_baseUrl}book-seat/`
    try {
        const response = await axios.post(url, data);
        return response?.data
    } catch (error) {
        console.log('error===========', error);
    }
}
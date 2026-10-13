import React from 'react'
import { useNavigate } from 'react-router-dom'
import CarForm from '../components/CarForm'
import CarsAPI from '../services/CarsAPI'
import { DEFAULT_CAR, useCarOptions, usePageTitle } from '../utilities/carUtils'
import '../App.css'

const CreateCar = ({ title }) => {
    usePageTitle(title)
    const navigate = useNavigate()
    const { options, error } = useCarOptions()

    const handleCreate = async (car) => {
        await CarsAPI.createCar(car)
        navigate('/customcars')
    }

    if (error) return <p className='page-message'>Couldn't load options: {error}</p>
    if (!options) return <p className='page-message' aria-busy='true'>Loading options…</p>

    return (
        <div className='page'>
            <CarForm options={options} initialCar={DEFAULT_CAR} submitLabel='Create' onSubmit={handleCreate} />
        </div>
    )
}

export default CreateCar

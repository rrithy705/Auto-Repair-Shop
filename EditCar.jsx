import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import CarForm from '../components/CarForm'
import CarsAPI from '../services/CarsAPI'
import { useCarOptions, usePageTitle } from '../utilities/carUtils'
import '../App.css'

const EditCar = ({ title }) => {
    usePageTitle(title)
    const { id } = useParams()
    const navigate = useNavigate()
    const { options, error: optionsError } = useCarOptions()
    const [car, setCar] = useState(null)
    const [error, setError] = useState('')

    useEffect(() => {
        CarsAPI.getCarById(id)
            .then(setCar)
            .catch(err => setError(err.message))
    }, [id])

    const handleUpdate = async (updatedCar) => {
        await CarsAPI.updateCar(id, updatedCar)
        navigate(`/customcars/${id}`)
    }

    const handleDelete = async () => {
        if (!window.confirm(`Delete "${car.name}"?`)) return
        try {
            await CarsAPI.deleteCar(id)
            navigate('/customcars')
        } catch (err) {
            setError(err.message)
        }
    }

    if (error || optionsError) return <p className='page-message'>Something went wrong: {error || optionsError}</p>
    if (!car || !options) return <p className='page-message' aria-busy='true'>Loading car…</p>

    const initialCar = {
        name: car.name,
        convertible: car.convertible,
        exterior: car.exterior,
        roof: car.roof,
        wheels: car.wheels,
        interior: car.interior
    }

    return (
        <div className='page'>
            <CarForm options={options} initialCar={initialCar} submitLabel='Update' onSubmit={handleUpdate}>
                <button type='button' className='danger-btn' onClick={handleDelete}>Delete</button>
            </CarForm>
        </div>
    )
}

export default EditCar

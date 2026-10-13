import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import CarPreview from '../components/CarPreview'
import CarSpecs from '../components/CarSpecs'
import CarsAPI from '../services/CarsAPI'
import { useCarOptions, usePageTitle } from '../utilities/carUtils'
import '../App.css'
import '../css/Customizer.css'

const ViewCars = ({ title }) => {
    usePageTitle(title)
    const { options, error: optionsError } = useCarOptions()
    const [cars, setCars] = useState(null)
    const [error, setError] = useState('')

    useEffect(() => {
        CarsAPI.getAllCars()
            .then(setCars)
            .catch(err => setError(err.message))
    }, [])

    const handleDelete = async (car) => {
        if (!window.confirm(`Delete "${car.name}"?`)) return
        try {
            await CarsAPI.deleteCar(car.id)
            setCars(prev => prev.filter(c => c.id !== car.id))
        } catch (err) {
            setError(err.message)
        }
    }

    if (error || optionsError) return <p className='page-message'>Something went wrong: {error || optionsError}</p>
    if (!cars || !options) return <p className='page-message' aria-busy='true'>Loading cars…</p>

    if (cars.length === 0) {
        return (
            <div className='page page-message'>
                <h2>No custom cars yet</h2>
                <Link to='/' role='button'>Build one</Link>
            </div>
        )
    }

    return (
        <div className='page car-list'>
            {cars.map(car => (
                <article key={car.id} className='car-card'>
                    <CarPreview car={car} options={options} />
                    <h3>{car.name}</h3>
                    <CarSpecs car={car} options={options} />
                    <footer>
                        <Link to={`/customcars/${car.id}`} role='button'>Details</Link>
                        <Link to={`/edit/${car.id}`} role='button' className='secondary-btn'>Edit</Link>
                        <button type='button' className='danger-btn' onClick={() => handleDelete(car)}>Delete</button>
                    </footer>
                </article>
            ))}
        </div>
    )
}

export default ViewCars

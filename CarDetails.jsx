import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import CarPreview from '../components/CarPreview'
import CarSpecs from '../components/CarSpecs'
import CarsAPI from '../services/CarsAPI'
import { useCarOptions, usePageTitle } from '../utilities/carUtils'
import '../App.css'
import '../css/Customizer.css'

const CarDetails = ({ title }) => {
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

    return (
        <div className='page details'>
            <article>
                <h2>{car.name}</h2>
                <CarPreview car={car} options={options} />
            </article>
            <article>
                <h3>Build sheet</h3>
                <CarSpecs car={car} options={options} />
                <footer>
                    <Link to={`/edit/${car.id}`} role='button'>Edit</Link>
                    <button type='button' className='danger-btn' onClick={handleDelete}>Delete</button>
                </footer>
            </article>
        </div>
    )
}

export default CarDetails

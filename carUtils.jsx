import { useEffect, useState } from 'react'
import CarsAPI from '../services/CarsAPI'

export const DEFAULT_CAR = {
    name: '',
    convertible: false,
    exterior: 'racing-red',
    roof: 'body-color',
    wheels: 'standard',
    interior: 'black-cloth'
}

export const formatPrice = (amount) => `$${Number(amount).toLocaleString()}`

export const findOption = (options, featureKey, optionId) =>
    options?.features.find(f => f.key === featureKey)?.options.find(o => o.id === optionId)

export const calculatePrice = (options, car) => {
    if (!options) return 0
    let total = options.basePrice + (car.convertible ? options.convertiblePrice : 0)
    for (const feature of options.features) {
        total += findOption(options, feature.key, car[feature.key])?.price ?? 0
    }
    return total
}

export const isOptionAvailable = (option, convertible) => {
    if (option.convertible === 'required') return convertible
    if (option.convertible === 'forbidden') return !convertible
    return true
}

// Mirrors the server's validateCar so users see the problem before the request is sent.
export const validateCar = (options, car) => {
    const errors = []

    if (!car.name.trim()) {
        errors.push('Give your car a name.')
    }

    for (const feature of options.features) {
        const option = findOption(options, feature.key, car[feature.key])
        if (!option) {
            errors.push(`Choose a valid ${feature.label.toLowerCase()} option.`)
        } else if (!isOptionAvailable(option, car.convertible)) {
            errors.push(option.convertible === 'required'
                ? `The ${option.name} ${feature.label.toLowerCase()} option is only available on convertibles.`
                : `The ${option.name} ${feature.label.toLowerCase()} option is not available on convertibles.`)
        }
    }

    return errors
}

export const useCarOptions = () => {
    const [options, setOptions] = useState(null)
    const [error, setError] = useState('')

    useEffect(() => {
        CarsAPI.getOptions()
            .then(setOptions)
            .catch(err => setError(err.message))
    }, [])

    return { options, error }
}

export const usePageTitle = (title) => {
    useEffect(() => {
        if (title) document.title = title
    }, [title])
}

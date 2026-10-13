import React, { useState } from 'react'
import CarPreview from './CarPreview'
import { calculatePrice, formatPrice, isOptionAvailable, validateCar } from '../utilities/carUtils'
import '../css/Customizer.css'

const CarForm = ({ options, initialCar, submitLabel, onSubmit, children }) => {
    const [car, setCar] = useState(initialCar)
    const [errors, setErrors] = useState([])
    const [submitting, setSubmitting] = useState(false)

    const update = (changes) => {
        setCar(prev => ({ ...prev, ...changes }))
        setErrors([])
    }

    const handleSubmit = async (event) => {
        event.preventDefault()

        const problems = validateCar(options, car)
        if (problems.length > 0) {
            setErrors(problems)
            return
        }

        setSubmitting(true)
        try {
            await onSubmit({ ...car, name: car.name.trim() })
        } catch (err) {
            setErrors([err.message])
            setSubmitting(false)
        }
    }

    return (
        <form className='customizer' onSubmit={handleSubmit}>
            <article className='preview-panel'>
                <CarPreview car={car} options={options} />
                <div className='price-tag'>
                    <span>Total</span>
                    <strong>{formatPrice(calculatePrice(options, car))}</strong>
                </div>
                <p className='base-price'>Base price {formatPrice(options.basePrice)}</p>

                {errors.length > 0 && (
                    <div className='form-errors' role='alert'>
                        <strong>We can't build this car:</strong>
                        <ul>
                            {errors.map(message => <li key={message}>{message}</li>)}
                        </ul>
                    </div>
                )}

                <div className='form-actions'>
                    <input type='submit' value={submitting ? 'Saving…' : submitLabel} disabled={submitting} />
                    {children}
                </div>
            </article>

            <article className='options-panel'>
                <label htmlFor='car-name'>
                    Car name
                    <input
                        id='car-name'
                        type='text'
                        placeholder='My Dream Car'
                        maxLength={100}
                        value={car.name}
                        onChange={e => update({ name: e.target.value })}
                    />
                </label>

                <label htmlFor='convertible' className='convertible-toggle'>
                    <input
                        id='convertible'
                        type='checkbox'
                        role='switch'
                        checked={car.convertible}
                        onChange={e => update({ convertible: e.target.checked })}
                    />
                    Convertible (+{formatPrice(options.convertiblePrice)})
                </label>

                {options.features.map(feature => (
                    <fieldset key={feature.key} className='feature'>
                        <legend>{feature.label}</legend>
                        <div className='option-grid'>
                            {feature.options.map(option => {
                                const available = isOptionAvailable(option, car.convertible)
                                const selected = car[feature.key] === option.id
                                const classes = ['option-btn', selected && 'selected', !available && 'unavailable']
                                    .filter(Boolean).join(' ')
                                return (
                                    <button
                                        key={option.id}
                                        type='button'
                                        className={classes}
                                        disabled={!available}
                                        aria-pressed={selected}
                                        title={available ? undefined
                                            : option.convertible === 'required' ? 'Convertibles only' : 'Not available on convertibles'}
                                        onClick={() => update({ [feature.key]: option.id })}
                                    >
                                        <span className='swatch' style={{ background: option.color ?? 'linear-gradient(135deg, #888, #fff)' }} />
                                        <span className='option-name'>{option.name}</span>
                                        <span className='option-price'>{option.price ? `+${formatPrice(option.price)}` : 'Included'}</span>
                                    </button>
                                )
                            })}
                        </div>
                    </fieldset>
                ))}
            </article>
        </form>
    )
}

export default CarForm

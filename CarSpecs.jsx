import React from 'react'
import { findOption, formatPrice } from '../utilities/carUtils'

const CarSpecs = ({ car, options }) => (
    <ul className='spec-list'>
        <li>
            <span>Body</span>
            <span>{car.convertible ? `Convertible (+${formatPrice(options.convertiblePrice)})` : 'Coupe'}</span>
        </li>
        {options.features.map(feature => {
            const option = findOption(options, feature.key, car[feature.key])
            return (
                <li key={feature.key}>
                    <span>{feature.label}</span>
                    <span>
                        {option?.name ?? car[feature.key]}
                        {option?.price ? ` (+${formatPrice(option.price)})` : ''}
                    </span>
                </li>
            )
        })}
        <li className='spec-total'>
            <span>Total</span>
            <span>{formatPrice(car.price)}</span>
        </li>
    </ul>
)

export default CarSpecs

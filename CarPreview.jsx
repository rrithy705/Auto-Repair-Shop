import React from 'react'
import { findOption } from '../utilities/carUtils'

const GLASS = '#9fd3f0'

const Wheel = ({ cx, wheel }) => {
    const offRoad = wheel?.id === 'off-road'
    const tireRadius = offRoad ? 30 : 26
    const rimRadius = wheel?.id === 'sport' || wheel?.id === 'track' ? 17 : 14
    const cy = 150 - tireRadius
    const spokes = wheel?.spokes ?? 5

    return (
        <g>
            <circle cx={cx} cy={cy} r={tireRadius} fill='#111' />
            {offRoad && (
                <circle cx={cx} cy={cy} r={tireRadius - 2} fill='none' stroke='#3a3a3a' strokeWidth='4' strokeDasharray='5 4' />
            )}
            <circle cx={cx} cy={cy} r={rimRadius} fill={wheel?.color ?? '#9ca3af'} />
            {Array.from({ length: spokes }, (_, i) => {
                const angle = (i / spokes) * Math.PI * 2
                return (
                    <line
                        key={i}
                        x1={cx}
                        y1={cy}
                        x2={cx + Math.cos(angle) * (rimRadius - 1)}
                        y2={cy + Math.sin(angle) * (rimRadius - 1)}
                        stroke='#4b5563'
                        strokeWidth={spokes > 6 ? 1.5 : 3}
                    />
                )
            })}
            <circle cx={cx} cy={cy} r='3.5' fill='#374151' />
        </g>
    )
}

const Seat = ({ x, color }) => (
    <path d={`M${x} 92 L${x + 4} 66 Q${x + 6} 60 ${x + 12} 61 L${x + 14} 62 L${x + 16} 92 Z`} fill={color} stroke='#00000040' />
)

// Side view of the car, redrawn from the currently selected options.
const CarPreview = ({ car, options }) => {
    const exterior = findOption(options, 'exterior', car.exterior)
    const roof = findOption(options, 'roof', car.roof)
    const wheels = findOption(options, 'wheels', car.wheels)
    const interior = findOption(options, 'interior', car.interior)

    const bodyColor = exterior?.color ?? '#888'
    const interiorColor = interior?.color ?? '#27272a'
    const roofColor = roof?.color ?? bodyColor
    const lift = wheels?.id === 'off-road' ? 8 : 0

    return (
        <svg className='car-preview' viewBox='0 0 400 160' role='img' aria-label={`Preview of ${car.name || 'your car'}`}>
            <ellipse cx='200' cy='152' rx='170' ry='6' fill='#00000055' />

            <g transform={`translate(0 ${-lift})`}>
                {car.convertible ? (
                    <g>
                        <Seat x={150} color={interiorColor} />
                        <Seat x={205} color={interiorColor} />
                        {/* windshield */}
                        <path d='M262 92 L242 62' stroke={GLASS} strokeWidth='5' strokeLinecap='round' opacity='0.85' />
                        {roof?.id === 'soft-top' && (
                            <rect x='112' y='80' width='38' height='14' rx='7' fill={roofColor} />
                        )}
                    </g>
                ) : (
                    <g>
                        <path d='M112 94 L148 56 Q156 48 170 48 L238 48 Q252 48 262 58 L298 94 Z' fill={roofColor} />
                        {roof?.id === 'carbon-fiber' && (
                            <path d='M150 54 L250 54' stroke='#555' strokeWidth='2' strokeDasharray='3 3' />
                        )}
                        <path d='M128 92 L154 62 L198 62 L198 92 Z' fill={GLASS} opacity={roof?.id === 'panoramic-glass' ? 0.6 : 0.85} />
                        <path d='M206 62 L244 62 Q252 62 258 68 L280 92 L206 92 Z' fill={GLASS} opacity={roof?.id === 'panoramic-glass' ? 0.6 : 0.85} />
                        <Seat x={165} color={interiorColor} />
                        <Seat x={215} color={interiorColor} />
                    </g>
                )}

                {/* body */}
                <path
                    d='M24 128 Q18 104 44 98 L112 92 L300 92 Q352 96 374 112 Q382 120 378 130 L368 134 L24 134 Z'
                    fill={bodyColor}
                    stroke='#00000060'
                    strokeWidth='1.5'
                />
                <path d='M40 112 L370 116' stroke='#ffffff30' strokeWidth='2' />
                <rect x='362' y='110' width='14' height='7' rx='3' fill='#fef08a' />
                <rect x='22' y='106' width='10' height='8' rx='2' fill='#dc2626' />
            </g>

            <Wheel cx={95} wheel={wheels} />
            <Wheel cx={305} wheel={wheels} />
        </svg>
    )
}

export default CarPreview

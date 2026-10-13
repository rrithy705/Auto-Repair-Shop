// Every customizable feature, its options, and what each option costs.
// The client fetches this from /api/options so prices and rules live in one place.
// `convertible: 'required'` means the option only exists on convertibles,
// `convertible: 'forbidden'` means it can't be put on a convertible.

export const BASE_PRICE = 45000
export const CONVERTIBLE_PRICE = 5000

export const FEATURES = [
    {
        key: 'exterior',
        label: 'Exterior',
        options: [
            { id: 'racing-red', name: 'Racing Red', price: 0, color: '#c1121f' },
            { id: 'midnight-black', name: 'Midnight Black', price: 750, color: '#1b1b1b' },
            { id: 'ocean-blue', name: 'Ocean Blue', price: 500, color: '#1d4ed8' },
            { id: 'arctic-silver', name: 'Arctic Silver', price: 500, color: '#b8bec6' },
            { id: 'electric-yellow', name: 'Electric Yellow', price: 1000, color: '#facc15' },
            { id: 'pearl-white', name: 'Pearl White', price: 800, color: '#f8fafc' },
            { id: 'gunmetal-gray', name: 'Gunmetal Gray', price: 600, color: '#4b5563' },
            { id: 'forest-green', name: 'Forest Green', price: 700, color: '#166534' },
            { id: 'sunset-orange', name: 'Sunset Orange', price: 900, color: '#ea580c' },
            { id: 'royal-purple', name: 'Royal Purple', price: 1100, color: '#6d28d9' },
            { id: 'teal-wave', name: 'Teal Wave', price: 900, color: '#0d9488' },
            { id: 'candy-pink', name: 'Candy Pink', price: 1200, color: '#ec4899' }
        ]
    },
    {
        key: 'roof',
        label: 'Roof',
        options: [
            { id: 'body-color', name: 'Body Color Hardtop', price: 0, color: null, convertible: 'forbidden' },
            { id: 'carbon-fiber', name: 'Carbon Fiber', price: 2500, color: '#2d2d2d', convertible: 'forbidden' },
            { id: 'panoramic-glass', name: 'Panoramic Glass', price: 1800, color: '#7dd3fc', convertible: 'forbidden' },
            { id: 'soft-top', name: 'Soft Top', price: 1200, color: '#3f3f46', convertible: 'required' }
        ]
    },
    {
        key: 'wheels',
        label: 'Wheels',
        options: [
            { id: 'standard', name: 'Standard 18"', price: 0, color: '#9ca3af', spokes: 5 },
            { id: 'sport', name: 'Sport 20"', price: 1500, color: '#e5e7eb', spokes: 10 },
            { id: 'off-road', name: 'Off-Road All-Terrain', price: 1200, color: '#57534e', spokes: 6, convertible: 'forbidden' },
            { id: 'track', name: 'Track Carbon 21"', price: 4000, color: '#111827', spokes: 3 }
        ]
    },
    {
        key: 'interior',
        label: 'Interior',
        options: [
            { id: 'black-cloth', name: 'Black Cloth', price: 0, color: '#27272a' },
            { id: 'tan-leather', name: 'Tan Leather', price: 1500, color: '#c08a5b' },
            { id: 'red-leather', name: 'Red Leather', price: 2000, color: '#991b1b' },
            { id: 'white-leather', name: 'White Leather', price: 2500, color: '#f4f4f5' },
            { id: 'navy-leather', name: 'Navy Leather', price: 2000, color: '#1e3a8a' },
            { id: 'gray-alcantara', name: 'Gray Alcantara', price: 2200, color: '#71717a' },
            { id: 'cognac-leather', name: 'Cognac Leather', price: 2300, color: '#7c2d12' }
        ]
    }
]

const findOption = (featureKey, optionId) =>
    FEATURES.find(f => f.key === featureKey)?.options.find(o => o.id === optionId)

export const calculatePrice = (car) => {
    let total = BASE_PRICE + (car.convertible ? CONVERTIBLE_PRICE : 0)
    for (const feature of FEATURES) {
        total += findOption(feature.key, car[feature.key])?.price ?? 0
    }
    return total
}

// Returns a list of human-readable problems; an empty list means the car can be built.
export const validateCar = (car) => {
    const errors = []

    if (!car.name || !String(car.name).trim()) {
        errors.push('Give your car a name.')
    }

    for (const feature of FEATURES) {
        if (!findOption(feature.key, car[feature.key])) {
            errors.push(`Choose a valid ${feature.label.toLowerCase()} option.`)
        }
    }

    for (const feature of FEATURES) {
        const option = findOption(feature.key, car[feature.key])
        if (option?.convertible === 'required' && !car.convertible) {
            errors.push(`The ${option.name} ${feature.label.toLowerCase()} option is only available on convertibles.`)
        }
        if (option?.convertible === 'forbidden' && car.convertible) {
            errors.push(`The ${option.name} ${feature.label.toLowerCase()} option is not available on convertibles.`)
        }
    }

    return errors
}

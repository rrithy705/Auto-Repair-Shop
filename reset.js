import { pool } from './database.js'
import { calculatePrice } from '../data/options.js'

const seedCars = [
    { name: 'Red Rocket', convertible: false, exterior: 'racing-red', roof: 'carbon-fiber', wheels: 'sport', interior: 'black-cloth' },
    { name: 'Sunset Cruiser', convertible: true, exterior: 'electric-yellow', roof: 'soft-top', wheels: 'standard', interior: 'tan-leather' },
    { name: 'Trailblazer', convertible: false, exterior: 'midnight-black', roof: 'panoramic-glass', wheels: 'off-road', interior: 'red-leather' }
]

const createCustomCarsTable = async () => {
    const createTableQuery = `
        DROP TABLE IF EXISTS custom_cars;

        CREATE TABLE IF NOT EXISTS custom_cars (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            convertible BOOLEAN NOT NULL DEFAULT FALSE,
            exterior VARCHAR(50) NOT NULL,
            roof VARCHAR(50) NOT NULL,
            wheels VARCHAR(50) NOT NULL,
            interior VARCHAR(50) NOT NULL,
            price INTEGER NOT NULL,
            created_at TIMESTAMP NOT NULL DEFAULT NOW()
        );
    `

    await pool.query(createTableQuery)
    console.log('🎉 custom_cars table created successfully')
}

const seedCustomCarsTable = async () => {
    for (const car of seedCars) {
        await pool.query(
            `INSERT INTO custom_cars (name, convertible, exterior, roof, wheels, interior, price)
             VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [car.name, car.convertible, car.exterior, car.roof, car.wheels, car.interior, calculatePrice(car)]
        )
        console.log(`✅ ${car.name} added successfully`)
    }
}

try {
    await createCustomCarsTable()
    await seedCustomCarsTable()
} catch (err) {
    console.error('⚠️ error resetting database', err)
    process.exitCode = 1
} finally {
    await pool.end()
}

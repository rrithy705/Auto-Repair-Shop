const request = async (url, options = {}) => {
    const response = await fetch(url, {
        headers: { 'Content-Type': 'application/json' },
        ...options
    })
    const data = await response.json().catch(() => ({}))
    if (!response.ok) {
        throw new Error(data.error || `Request failed (${response.status})`)
    }
    return data
}

const getOptions = () => request('/api/options')

const getAllCars = () => request('/api/cars')

const getCarById = (id) => request(`/api/cars/${id}`)

const createCar = (car) => request('/api/cars', {
    method: 'POST',
    body: JSON.stringify(car)
})

const updateCar = (id, car) => request(`/api/cars/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(car)
})

const deleteCar = (id) => request(`/api/cars/${id}`, { method: 'DELETE' })

export default {
    getOptions,
    getAllCars,
    getCarById,
    createCar,
    updateCar,
    deleteCar
}

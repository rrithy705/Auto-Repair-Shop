import express from 'express'
import CarsController from '../controllers/cars.js'

const router = express.Router()

router.get('/options', CarsController.getOptions)

router.get('/cars', CarsController.getCars)
router.get('/cars/:id', CarsController.getCarById)
router.post('/cars', CarsController.createCar)
router.patch('/cars/:id', CarsController.updateCar)
router.delete('/cars/:id', CarsController.deleteCar)

export default router

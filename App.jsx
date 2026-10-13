import React from 'react'
import { useRoutes } from 'react-router-dom'
import Navigation from './components/Navigation'
import ViewCars from './pages/ViewCars'
import EditCar from './pages/EditCar'
import CreateCar from './pages/CreateCar'
import CarDetails from './pages/CarDetails'
import './App.css'

const App = () => {
  let element = useRoutes([
    {
      path: '/',
      element: <CreateCar title='AUTO REPAIR SHOP | Customize' />
    },
    {
      path:'/customcars',
      element: <ViewCars title='AUTO REPAIR SHOP | Custom Cars' />
    },
    {
      path: '/customcars/:id',
      element: <CarDetails title='AUTO REPAIR SHOP | View' />
    },
    {
      path: '/edit/:id',
      element: <EditCar title='AUTO REPAIR SHOP | Edit' />
    }
  ])

  return (
    <div className='app'>

      <Navigation />

      { element }

    </div>
  )
}

export default App
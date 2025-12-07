import React from 'react'
import MainLayout from './Outlets/MainLayout'
import { RouterProvider } from 'react-router-dom'
import router from './Routes/routes'

const App = () => {
  return (
    <RouterProvider router={router}/>
  )
}

export default App
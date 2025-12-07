import React from 'react'
import Navbar from '../components/Navbar'
import { Outlet } from 'react-router-dom'

const MainLayout = () => {
  return (
    <div className="bg-white">
        <Navbar/>

        <div className='overflow-hidden w-full'>
             <Outlet/>
        </div>
       
    </div>
  )
}

export default MainLayout
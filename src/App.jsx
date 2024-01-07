import logo from './logo.svg'
import React, { useState } from 'react'
import './App.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import ClientRegistration from './pages/ClientRegistration'
import Home from './pages/Home'
// import ClientLogin from './pages/ClientLogin'
import ViewCounsellors from './components/ViewCounsellors'
import ClientBooking from './pages/ClientBooking'
import ClientAppointmentReview from './components/ClientAppointmentReview'
import AppointmentBooking from './components/AppointmentBooking'
import Appointments from './pages/AllAppointments'
import AppointmentDetails from './pages/AppointmentDetails'
import MyAppointment from './pages/MyAppointment'
// import CounsellorLogin from './pages/CounsellorLogin'
import UserLogin from './pages/UserLogin'
import CounsellorProfile from './pages/CounsellorProfile'
import ManageAccounts from './pages/ManageAccounts'
import CounsellorRegistration from './pages/CounsellorsRegistration'

function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Home />,
    },
    {
      path: '/client/register',
      element: <ClientRegistration />,
    },
    // {
    //   path: '/client/login',
    //   element: <ClientLogin />,
    // },
    {
      path: '/client/counsellors-view',
      element: <ViewCounsellors />,
    },
    {
      path: '/client/counsellors-view/:id',
      element: <CounsellorProfile />,
    },
    
    {
      path: '/client/appointment-booking',
      element: <ClientBooking />,
    },
    {
      path: '/client/appointment-review',
      element: <ClientAppointmentReview />,
    },
    {
      path: '/counsellor/appointments',
      element: <Appointments />,
    },
    {
      path: '/counsellor/appointment/:id',
      element: <AppointmentDetails />,
    },
    {
      path: '/client/appointment-view',
      element: <MyAppointment />,
    },
    // {
    //   path: '/counsellor/login',
    //   element: <CounsellorLogin />,
    // },
    {
      path: '/user/login',
      element: <UserLogin />,
    },
    {
      path: '/admin/account-manage',
      element: <ManageAccounts />,
    },
    {
      path: '/admin/registerCounsellor',
      element: <CounsellorRegistration />,
    },
    // {
    //   path: '/client/appointment-book',
    //   element: <AppointmentBooking />,
    // },
  ])
  return <RouterProvider router={router} />
}

export default App

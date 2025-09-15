import React from 'react'
import SideBar from '../common/SideBar'
import Header from '../common/Header'
import { Outlet } from 'react-router-dom'

import { spinner } from '../../../App';
import { useAppSelector } from '../../store/hook';

export default function Layout() {

  const loading = useAppSelector(state => state.spinner.loading);

  return (
    // <div className='d-flex'>
    //         <div className='col-2'>
    //             <SideBar />
    //         </div>
    //         <div className='col-10'>
    //             <Header />
    //             <Outlet />
    //         </div>
    //     </div>
    <>
      {loading ? spinner :
        <main className="main" id="top">
          <SideBar />
          <Header />
          <div className="content">
            <Outlet />
          </div>
        </main>}
    </>
  )
}

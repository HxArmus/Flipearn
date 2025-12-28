import React from 'react'
import { Routes,Route, useLocation } from 'react-router-dom'
import Home from './pages/home'
import Marketplace from './pages/marketplace'
import Mylisting from './pages/mylisting'
import Listingdetails from './pages/listingdetails'
import Managelisting from './pages/managelisting'
import Messages from './pages/messages'
import Myorder from './pages/myorders'
import Loadingpage from './pages/loadingpage'
import Navbar from './components/navbar'

const App = () => {

  const {pathname}=useLocation();



  return (
    <div>
      {!pathname.includes('/admin')&&  <Navbar/>}
      <Routes>
        <Route path='/' element={<Home/>} />
         <Route path='/marketplace' element={<Marketplace/>} />
          <Route path='/my-listing' element={<Mylisting/>} />
           <Route path='/listing/:listingId' element={<Listingdetails/>} />
            <Route path='/create-listing' element={<Managelisting/>} />
            <Route path='/edit-listing/:id' element={<Managelisting/>} />
              <Route path='/messages' element={<Messages/>} />
               <Route path='/my-orders' element={<Myorder/>} />
               <Route path='/loading' element={<Loadingpage/>} />
             
                


      </Routes>
    </div>
  )
}

export default App
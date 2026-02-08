import React from 'react'
import { Routes,Route, useLocation } from 'react-router-dom'
import Home from './pages/home'
import Marketplace from './pages/marketplace'
import MyListing from './pages/mylisting'
import Listingdetails from './pages/listingdetails'
import Managelisting from './pages/managelisting'
import Messages from './pages/messages'
import Myorder from './pages/myorders'
import Loadingpage from './pages/loadingpage'
import Navbar from './components/navbar'
import Chatbox from './components/Chatbox'
import { Toaster } from 'react-hot-toast'
import Layout from './pages/Admin/Layout'
import Dashboard from './pages/Admin/Dashboard'
import AllListings from './pages/Admin/AllListings'
import CredentialChange from './pages/Admin/CredentialChange'
import CredentialVerify from './pages/Admin/CredentialVerify'
import Transactions from './pages/Admin/Transactions'
import Withdrawal from './pages/Admin/Withdrawal'


const App = () => {

  const {pathname}=useLocation();



  return (
    <div>
      <Toaster />

      {!pathname.includes('/admin')&&  <Navbar/>}
      <Routes>
        <Route path='/' element={<Home/>} />
         <Route path='/marketplace' element={<Marketplace/>} />
          <Route path='/my-listings' element={<MyListing />} />
           <Route path='/listing/:listingId' element={<Listingdetails/>} />
            <Route path='/create-listing' element={<Managelisting/>} />
            <Route path='/edit-listing/:id' element={<Managelisting/>} />
              <Route path='/messages' element={<Messages/>} />
               <Route path='/my-orders' element={<Myorder/>} />
               <Route path='/loading' element={<Loadingpage/>} />

               <Route path='/admin' element={<Layout />}>
               <Route index element={<Dashboard />} />
               <Route path='verify-credentials' index element={<CredentialVerify />}/>
               <Route path='change-credentials' index element={<CredentialChange />}/>
               <Route path='list-Listings' index element={<AllListings />}/>
               <Route path='transactions' index element={<Transactions />}/>
               <Route path='withdrawal' index element={<Withdrawal />}/>
               


               </Route>
             
                


      </Routes>
      <Chatbox />
    </div>
  )
}

export default App
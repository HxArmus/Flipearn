import React from 'react'
import { Routes,Route, useLocation } from 'react-router-dom'
import Home from './pages/Home';
import Marketplace from './pages/Marketplace'
import MyListing from './pages/MyListing';
import ListingDetails from './pages/ListingDetails'
import ManageListing from './pages/ManageListing'
import Messages from './pages/Messages'
import MyOrders from './pages/MyOrders'
import Loading from './pages/Loading'
import Navbar from './components/Navbar'
import Chatbox from './components/Chatbox'
import { Toaster } from 'react-hot-toast'
import Layout from './pages/Admin/Layout'
import Dashboard from './pages/Admin/Dashboard'
import AllListings from './pages/Admin/AllListings'
import CredentialChange from './pages/Admin/CredentialChange'
import CredentialVerify from './pages/Admin/CredentialVerify'
import Transactions from './pages/Admin/Transactions'
import Withdrawal from './pages/Admin/Withdrawal'
import { useAuth, useUser } from '@clerk/clerk-react'
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { getAllPublicListing, getAllUserListing } from './app/features/listingSlice'


const App = () => {

  const {pathname}=useLocation();
  const {getToken} = useAuth();
  const {user , isLoaded } = useUser();

  const dispatch = useDispatch()

  useEffect(()=>{
    dispatch(getAllPublicListing())

  },[])
  useEffect(()=>{
    if(isLoaded && user){
      dispatch(getAllUserListing({getToken}))
    }
  },[isLoaded, user])



  return (
    <div>
      <Toaster />

      {!pathname.includes('/admin')&&  <Navbar/>}
      <Routes>
        <Route path='/' element={<Home/>} />
         <Route path='/marketplace' element={<Marketplace/>} />
          <Route path='/my-listings' element={<MyListing />} />
           <Route path='/listing/:listingId' element={<ListingDetails/>} />
            <Route path='/create-listing' element={<ManageListing/>} />
            <Route path='/edit-listing/:id' element={<ManageListing/>} />
              <Route path='/messages' element={<Messages/>} />
               <Route path='/my-orders' element={<MyOrders/>} />
               <Route path='/loading/:nextUrl' element={<Loading/>} />

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

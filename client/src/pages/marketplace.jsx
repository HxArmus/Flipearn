import React, { useState } from 'react'
import { ArrowLeftIcon, FilterIcon, Verified } from 'lucide-react'
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import { useSelector } from 'react-redux';
import ListingCard from '../components/listingCard';
import Filtersidebar from '../components/Filtersidebar';

const Marketplace = () => {
  const [searchParam]= useSearchParams();
  const search=searchParam.get('search')||'';

  const navigate=useNavigate();
  const [showFilterPhone,setShowFilterPhone]=React.useState(false);
  const {listings}=useSelector(state=>state.listing);
  const [filter,setFilter]=useState({
    platform:null,
    maxPrice:100000,
    minFollowers:0,
    niche:null,
    verified:false,
    monetized:false
  });

  {/* filter (currently keeps all) */}
  const filteredListings = listings.filter((listing)=>{
    if(filter.platform && filter.platform.length>0){
      if(!filter.platform.includes(listing.platform)){
        return false;
      }
    }

    if(filter.maxPrice){
      if(!filter.maxPrice>=listing.price){
        return false;
      }
    }
    if(filter.minFollowers && filter.platform.length>0){
      if(listing.followers<filter.minFollowers){
        return false;
      }
    }
    if(filter.niche && filter.niche.length>0){
      if(!filter.niche.includes(listing.niche)){
        return false;
      }
    }
    if(filter.verified){
      if(!listing.verified){
        return false;
      }
    }
    if(filter.monetized){
      if(!listing.monetized){
        return false;
      }
    }
    if(search){
      const trim =search.trim();
      if(
        !listing.title.toLowerCase().includes(trim.toLowerCase()) &&
       !listing.description.toLowerCase().includes(trim.toLowerCase()) &&
       !listing.niche.toLowerCase().includes(trim.toLowerCase()) &&
       !listing.platform.toLowerCase().includes(trim.toLowerCase())&&
       !listing.username.toLowerCase().includes(trim.toLowerCase())
      ){
        return false;
      }
    }

    return true;
  })


  return (
    <div className='px-6 md:px-16 lg:px-24 xl:px-32'>
        <div className='flex items-center justify-between text-slate-500'>
          <button onClick={()=>{navigate('/');scrollTo(0,0)}} className='flex items-center gap-2 py-5' >
            <ArrowLeftIcon className='size-4'/>
            Back to Home
             </button>
          <button onClick={()=>{setShowFilterPhone(true)}}  className='flex sm:hidden items-center gap-2 py-5'>
            <FilterIcon className='size-4'/>
            Filters
            </button>

        </div>
        <div className='relative flex items-start justify-between gap-8 pb-8'>
          <Filtersidebar showFilterPhone={showFilterPhone} setShowFilterPhone={setShowFilterPhone} filter={filter} setFilter={setFilter} />
          <div className='flex-1 grid xl:grid-cols-2 gap-4'>
          {/*  → sort (featured first)
               → map (convert to ListingCard components)*/}

            {filteredListings.sort((a,b)=>a.featured?-1:b.featured?1:0).map((listing,index)=>(<ListingCard   listing={listing} key={index} />

            ))}
            </div>
        </div>
    </div>
  )
}

export default Marketplace
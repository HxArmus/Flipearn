import React from 'react'
import Title from './Title'
import {useSelector} from 'react-redux'
import Listingcard from './listingcard'

const LatestListings = () => {
     const {listings}= useSelector(state=>state.listing)
   
  return (
    <div className='mt-20 mb-8'>
        <Title title="lastest Listings" description="Discover The hottest social profiles available right now"/>
        <div className='flex flex-col gap-6 px-6'>
             {listings.slice(0,4).map((listings, index)=>(
                <div key={index}>
                    <Listingcard listing={listings}/>

                </div>
            ))}

           
        </div>

    </div>
    
  )
}

export default LatestListings
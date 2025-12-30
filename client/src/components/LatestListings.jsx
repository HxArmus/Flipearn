import React from 'react'
import Title from './Title'
import {useSelector} from 'react-redux'

const LatestListings = () => {
     const {listings}= useSelector(state=>state.listing)
   
  return (
    <div className='mt-20 mb-8'>
        <Title title="lastest Listings" description="Discover The hottest social profiles available right now"/>
        <div className='flex flex-col gap-6 px-6'>
             {listings.slice(0,4).map((listings, index)=>(
                <div key={index}>
                    <h1>{listings.title}</h1>
                    <h1>{listings.username}</h1>

                </div>
            ))}

           
        </div>

    </div>
    
  )
}

export default LatestListings
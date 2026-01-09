import React from 'react'
import { Filter, X } from 'lucide-react'
import { useSearchParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const Filtersidebar = ( {showFilterPhone,setShowFilterPhone,filter,setFilter}) => {
    const navigate=useNavigate();
    const [searchParam,setSearchParam]=useSearchParams('');
    const [search,setsearch]=React.useState(searchParam.get('search') || '');
    const onSearchChange=(e)=>{
        if(e.target.value) {
        setsearch(e.target.value);
        setSearchParam({...Object.fromEntries([...searchParam]),search:e.target.value});
    }else{
        navigate('/marketplace');
        setsearch('');
    }
}

  return (
    <div className={`max-sm:inset-0 z-100 max-sm:h-screen max-sm:overflow-scroll bg-white rounded-lg shadow-sm border-gray-200 h-fit sticky top-24 md:min-w-[300px] ${showFilterPhone ? 'max-sm:fixed' : 'max-sm:hidden' } `}>
        <div className='p-4 border -b border-gray-200'>
            <div className='flex items-center justify-between'>
                <div className='flex items-center space-x-2 text-gray-700'>
                    <Filter className="size-4" />
                    <h3 className='font-semibold '>Filter</h3>
                </div>
                <div className='flex item-center gap-2'>
                    <X className='size-6 text-gray-500 hover:text-gray-700 p-1 hover:bg-gray-100 rounded transition-colors cursor- pointer' />

                    <button onClick={()=>setShowFilterPhone(false)} className='sm:hidden text-sm border text-gray-700 px-3 py-1 rounded'>Apply</button>
                </div>
            </div>
            </div>

            <div>

                <div className='p-4 space-y-6 sm:max-h-[cal(100vh-200px)] overflow-y-scroll no-scrollbar'>
                    {/*search bar*/}
                    <div className='flex items-center justify-between '>
                        <input onChange={onSearchChange} value={search} type="text" placeholder='search by username , platform ,niche, etc. 'className='w-full text-sm px-3 py-2 border border-gray-300 rounded-md outline-indigo-500' />
                    </div>

                </div>
            </div>

    </div>
  )
}

export default Filtersidebar
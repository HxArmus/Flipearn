import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { CirclePlus, X } from 'lucide-react'

const CredentialSubmission = ({ onClose, listing }) => {
    const [newField, setNewField] = useState('')
    const [credentials, setCredentials] = useState([
        { type: 'email', name: 'Email', value: '' },
        { type: 'password', name: 'Password', value: '' },
    ])

    const handleAddField = () => {
        const name = newField.trim()
        if (!name) {
            toast.error('Please enter a valid field name')
            return
        }
        setCredentials((prev) => [...prev, { type: 'text', name, value: '' }])
        setNewField('')
    }

    const handleSubmission = async (e) => {
        e.preventDefault()
        // submission logic placeholder
    }

    return (
        <div className='fixed inset-0 bg-black/70 backdrop-blur bg-opacity-50 z-[100] flex items-center justify-center sm:p-4'>
            <div className='bg-white sm:rounded-lg shadow-2xl w-full max-w-lg h-screen sm:h-[320px] flex flex-col'>
                {/* header */}
                <div className='bg-gradient-to-r from-indigo-600 to-indigo-400 text-white p-4 sm:rounded-t-lg flex items-center justify-between'>
                    <div className='flex-1 min-w-0'>
                        <h3 className='font-semibold text-lg truncate'>{listing?.title}</h3>
                        <p className='text-sm truncate'>
                            Adding credentials for {listing?.username} on {listing?.platform}
                        </p>
                    </div>
                    <button className='ml-4 p-1 hover:bg-white/20 rounded-lg transition-colors' onClick={onClose} type='button'>
                        <X  className='w-4 h-5' />
                    </button>
                </div>
                {/* form */}
                <form className='flex flex-col items-start gap-4 overflow-y-scroll p-4' onSubmit={handleSubmission}>
                    {credentials.map((cred, index) => (
                        <div key={`${cred.name}-${index}`} className='grid grid-cols-[2fr_3fr_1fr] items-center gap-2 w-full'>
                            <label className='text-sm font-medium text-gray-800'>{cred.name}</label>
                            <input
                                type={cred.type}
                                value={cred.value}
                                onChange={(e) =>
                                    setCredentials((prev) => prev.map((c, i) => (i === index ? { ...c, value: e.target.value } : c)))
                                }
                                className='border border-gray-300 rounded outline-indigo-400 px-2 py-1.5 text-sm w-full'
                            />
                            <X
                                className='w-5 h-5 text-gray-500 hover:text-gray-700 cursor-pointer'
                                onClick={() => setCredentials((prev) => prev.filter((_, i) => i !== index))}
                            />
                        </div>
                    ))}
                    {/* add more fields */}
                    <div className='flex items-center gap-2 w-full'>
                        <input
                            type='text'
                            placeholder='Field name (e.g. email, password)'
                            value={newField}
                            onChange={(e) => setNewField(e.target.value)}
                            className='flex-1 border-b border-gray-200 outline-none text-sm py-1'
                        />
                        <button
                            type='button'
                            onClick={handleAddField}
                            className='flex items-center gap-2 text-sm text-gray-600 hover:text-gray-700'
                        >
                            <CirclePlus className='w-5 h-5' />
                            Add Field
                        </button>
                    </div>
                    {/* submit button */}
                    <button type='submit' className='bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 mt-2 rounded-md'>
                        Submit
                    </button>
                </form>
            </div>
        </div>
    )
}

export default CredentialSubmission


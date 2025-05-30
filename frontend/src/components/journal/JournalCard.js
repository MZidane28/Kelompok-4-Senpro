'use client'
import React from 'react'
import { twMerge } from 'tailwind-merge'

function JournalCard({
    title = "Placeholder title",
    last_edited = "2025-05-24T14:56:52.131Z",
    is_active=false,
    onClick=()=>{}
}) {

    return (
        <div className={twMerge(
            `font-spaceGrotesk font-bold border-2 border-black py-2 px-4 text-base cursor-pointer rounded-lg`,
            is_active ? 'bg-floral-white' : 'bg-white',
            'hover:bg-floral-white',
            'transition duration-100 ease-in-out'
        )}
            onClick={(e) => {onClick()}}
        >
            {title}
            <p className='text-sm text-gray-600'>
                Last edited: {last_edited}
            </p>
        </div>
    )
}

export default JournalCard
'use client'
import React from 'react'
import { twMerge } from 'tailwind-merge'

function JournalCard({
    title = "Placeholder title",
    is_active=false,
    onClick=()=>{}
}) {

    return (
        <div className={twMerge(
            `font-spaceGrotesk font-bold border-2 border-black py-2 px-4 text-base cursor-pointer`,
            is_active ? 'bg-floral-white' : 'bg-white',
            'hover:bg-floral-white',
            'transition duration-100 ease-in-out'
        )}
            onClick={(e) => {onClick()}}
        >
            {title}
        </div>
    )
}

export default JournalCard
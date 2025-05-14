import React from 'react'
import SearchInput from '../input/SearchInput'
import JournalCard from './JournalCard'
import NormalButton from '../buttons/normalButton'

function SidebarList() {
    return (
        <div className='
            fixed z-10 left-3 top-5
            border-2 border-black 
            h-full max-h-[95%] max-w-[368px]
            p-8 text-left
            flex flex-col
            bg-white
            rounded-md
        '>
            <div className='flex-shrink-0'>
                <h1 className='font-bold text-3xl'>Your Journals</h1>
                <p className='font-light text-lg'>Track your thoughts and emotions daily</p>
                <SearchInput wrapper_classname='my-6' />
            </div>

            <div className='flex flex-col flex-grow overflow-y-auto w-full gap-5'>
                <JournalCard />
                <JournalCard />
                <JournalCard />
                <JournalCard />
                <JournalCard />
                <JournalCard />
                <JournalCard />
                <JournalCard />
                <JournalCard />
                <JournalCard />
                <JournalCard />

            </div>

            <div className='flex-shrink-0 mt-4'>
                <NormalButton
                    background_color='bg-soft-yellow'
                    font_size='text-base'
                    is_submit={false}
                    is_redirect={false}
                    custom_className='font-bold'
                    text='New Journal'
                />
            </div>
        </div>
    )
}

export default SidebarList
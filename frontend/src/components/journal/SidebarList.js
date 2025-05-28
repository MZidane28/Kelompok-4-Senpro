'use client'
import React, { useState } from 'react'
import SearchInput from '../input/SearchInput'
import JournalCard from './JournalCard'
import NormalButton from '../buttons/normalButton'

import { useJournalContext } from '@/context/JournalContext'

function SidebarList() {
    const { addNewJournals, userJournalList, SetJournalSelected, selectedTitle,userJournalListView, SetSearchbar, search  } = useJournalContext();

    return (
        <div className='
            fixed z-10 left-3 top-5 mt-16
            border-2 border-black 
            h-full max-h-[86%] max-w-[368px]
            p-8 text-left
            flex flex-col
            bg-white
            rounded-md
        '>
            <div className='flex-shrink-0'>
                <h1 className='font-bold text-3xl'>Your Journals</h1>
                <p className='font-light text-lg'>Track your thoughts and emotions daily</p>
                <SearchInput wrapper_classname='my-6' 
                    Input={search}
                    SetInput={(data) => SetSearchbar(data)}
                />
            </div>

            <div className='flex flex-col flex-grow overflow-y-auto w-full gap-5'>
                {
                    userJournalListView.map((data ,idx) => (
                        <JournalCard key={idx} title={data.journal_title} is_active={data.id == selectedTitle} onClick={() => SetJournalSelected(data.id)} 
                            
                        />
                    ))
                }
            </div>

            <div className='flex-shrink-0 mt-4'>
                <NormalButton
                    background_color='bg-soft-yellow'
                    font_size='text-base'
                    is_submit={false}
                    is_redirect={false}
                    custom_className='font-bold'
                    text='New Journal'
                    onClick={(e) => addNewJournals()}
                />
            </div>
        </div>
    )
}

export default SidebarList
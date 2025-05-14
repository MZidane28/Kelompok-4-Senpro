import React from 'react'
import JournalEditor from './JournalEditor'

function JournaLayout() {
    return (
        <div className='flex flex-row h-screen w-screen'>
            <div className='max-w-[400px] w-full flex-shrink-0'>
                
            </div>
            <div className='w-full p-10'>
                <JournalEditor />
            </div>
        </div>
    )
}

export default JournaLayout
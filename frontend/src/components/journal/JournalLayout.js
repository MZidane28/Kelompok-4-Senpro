import React from 'react'
import JournalEditor from './JournalEditor'

function JournaLayout() {
    return (
        <div className='flex flex-row min-h-screen w-screen items-start'>
            <div className='max-w-[400px] w-full flex-shrink-0'>
                
            </div>
            <div className='w-full p-10'>
                <JournalEditor />
            </div>
        </div>
    )
}

export default JournaLayout
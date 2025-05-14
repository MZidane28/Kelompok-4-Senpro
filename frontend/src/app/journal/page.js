import React from 'react'
import SidebarList from '@/components/journal/SidebarList'
import Journalayout from '@/components/journal/JournalLayout'

function page() {
    return (
        <div className='w-screen h-[screen] bg-floral-white'>
            <SidebarList/>
            <Journalayout />
        </div>
    )
}

export default page
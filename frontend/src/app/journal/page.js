import React from 'react'
import SidebarList from '@/components/journal/SidebarList'
import Journalayout from '@/components/journal/JournalLayout'
import { JournalProvider } from '@/context/JournalContext'

function page() {
    return (
        <JournalProvider>
            <div className='w-screen min-h-[screen] bg-floral-white overflow-x-hidden'>
                <SidebarList />
                <Journalayout />
            </div>
        </JournalProvider>

    )
}

export default page
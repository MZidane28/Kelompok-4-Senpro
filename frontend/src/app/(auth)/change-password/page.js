import React from 'react'
import ChangePasswordForm from '@/components/auth/ChangePasswordForm'
import SuspenseChangePassword from '@/components/auth/SuspenseChangePassword'

function page() {
    return (
        <main className='flex justify-center items-center h-full w-full mt-20'>
            <SuspenseChangePassword />
        </main>
    )
}

export default page
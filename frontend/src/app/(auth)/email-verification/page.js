import React from 'react'
import Image from 'next/image'

import NormalButton from '@/components/buttons/normalButton'

function page() {
    return (
        <main className='flex flex-col justify-center items-center h-full w-full'>
            <Image src={'/images/heart-email.png'}
                alt='Heart shape'
                width={120}
                height={222}
            />
            <h1 className='font-bold font-poppins text-4xl mt-4'>
                Thank you for signing up!
            </h1>
            <p className='font-poppins text-xl mt-6'>
                Check your email for email verification
            </p>
        </main>
    )
}

export default page
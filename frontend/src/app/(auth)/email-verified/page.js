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
                Your Email Has Been Verified!
            </h1>
            <p className='font-poppins text-xl mt-6'>
                Thank you for signing up! You can return the login screen by clicking below:
            </p>
            <NormalButton
                background_color='bg-soft-yellow'
                text='Log In to Your Account'
                custom_className='mt-6 py-2'
                is_submit={false}
                is_redirect={true}
                redirect_link='/login'
                width_className='w-full max-w-[300px]'
                font_size='text-xl'

            />
        </main>
    )
}

export default page
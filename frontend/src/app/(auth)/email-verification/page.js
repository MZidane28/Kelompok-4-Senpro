import React from 'react'
import Image from 'next/image'

import NormalButton from '@/components/buttons/normalButton'

function page() {
    return (
        <main className='flex flex-col justify-center items-center h-full w-full mt-20'>
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
            <NormalButton
                background_color='bg-soft-yellow'
                text='Back to Login'
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
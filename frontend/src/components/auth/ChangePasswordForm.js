'use client'
import React from 'react'

import InputFormText from '../input/form/inputText'
import NormalButton from '../buttons/normalButton'

function ChangePasswordForm() {
    return (
        <div className='p-14 border-2 border-black rounded-xl
        flex flex-col items-center justify-center 
        max-w-[570px] w-full'>
            <h1 className='font-bold font-spaceGrotesk text-3xl'>
                Change Your Password
            </h1>
            <p className='font-poppins text-base text-center mt-4'>
                Enter a new password below to change your password
            </p>
            <form className='w-full'>
                <InputFormText
                    input_type='password'
                    placeholder='***********'
                    label_name='New Password'
                    wrapper_classname="mt-6"

                />

                <InputFormText
                    input_type='password'
                    placeholder='***********'
                    label_name='Re-enter New Password'
                    wrapper_classname="mt-2"

                />

                <NormalButton
                    background_color='bg-soft-yellow'
                    text='Confirm'
                    custom_className='mt-6'
                    is_submit={true}
                />
            </form>
        </div>
    )
}

export default ChangePasswordForm
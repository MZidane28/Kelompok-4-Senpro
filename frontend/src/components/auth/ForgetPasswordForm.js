'use client'
import React from 'react'

import InputFormText from '../input/form/inputText'
import NormalButton from '../buttons/normalButton'

function ForgetPasswordForm() {
    return (
        <div className='p-14 border-2 border-black rounded-xl
        flex flex-col items-center justify-center 
        max-w-[570px] w-full'>
            <h1 className='font-bold font-spaceGrotesk text-3xl'>
                Reset Your Password!
            </h1>
            <p className='font-poppins text-base text-center mt-4'>
                Please enter the email address you would like your password reset information sent to
            </p>
            <form className='w-full'>
                <InputFormText 
                    input_type='email'
                    placeholder='example@gmail.com'
                    label_name='Enter your email address'
                    wrapper_classname="mt-6"

                />

                <NormalButton 
                    background_color='bg-soft-yellow'
                    text='Send Reset Link'
                    custom_className='mt-6'
                    is_submit={true}
                />
            </form>
            

            <p className='font-poppins text-base mt-4'>
                <span>
                    <a 
                        href='/login'
                        className='font-bold underline'>
                        {"Back to Log In"}
                    </a>
                </span>
            </p>
        </div>
    )
}

export default ForgetPasswordForm
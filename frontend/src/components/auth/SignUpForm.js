'use client'
import React from 'react'


import InputFormText from '../input/form/inputText'
import NormalButton from '../buttons/normalButton'


function SignUpForm() {
    return (
        <div className='p-14 border-2 border-black rounded-xl
        flex flex-col items-center justify-center 
        max-w-[570px] w-full'>
            <h1 className='font-bold font-spaceGrotesk text-3xl'>
                Sign Up for Free!
            </h1>
            <form className='w-full'>
                <InputFormText 
                    input_type='text'
                    placeholder='username'
                    label_name='Username'
                    wrapper_classname="mt-10"

                />
                <InputFormText 
                    input_type='email'
                    placeholder='example@gmail.com'
                    label_name='Email'
                    wrapper_classname="mt-6"

                />
                <InputFormText 
                    input_type='password'
                    placeholder='******'
                    label_name='Password'
                    wrapper_classname="mt-6"
                />

                <NormalButton 
                    background_color='bg-soft-yellow'
                    text='Sign Up'
                    custom_className='mt-6'
                    is_submit={true}
                />
            </form>
            

            <p className='font-poppins text-base mt-4'>
                Already have an account? 
                <span>
                    {" "}
                    <a 
                        href='/login'
                        className='font-bold underline'>
                        {"Log In"}
                    </a>
                </span>
            </p>
        </div>
    )
}

export default SignUpForm
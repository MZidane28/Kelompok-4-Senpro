'use client'
import React, { useState } from 'react'

import { ImCheckboxChecked } from "react-icons/im";


import InputFormText from '../input/form/inputText'
import NormalButton from '../buttons/normalButton'


function LoginForm() {

    const [isRememberMe, SetIsRememberMe] = useState(false)
    return (
        <div className='p-14 border-2 border-black rounded-xl
        flex flex-col items-center justify-center 
        max-w-[570px] w-full'>
            <h1 className='font-bold font-spaceGrotesk text-3xl'>
                Log In
            </h1>
            <form className='w-full'>
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

                <div className='flex justify-between mt-2 items-center'>
                    <div className='flex flex-row gap-2 items-center'>
                        <div className="remember_me hover:cursor-pointer" onClick={(e) => SetIsRememberMe(!isRememberMe)}>
                            {
                                isRememberMe ?
                                    <ImCheckboxChecked className="w-4 h-4 bg-soft-yellow" />
                                    :
                                    <div className='w-4 h-4 border-black border-2'>

                                    </div>
                            }
                        </div>
                        <label htmlFor='remember_me' className='font-poppins'>
                            Remember Me
                        </label>
                    </div>
                    <a
                        href='/forget-password'
                        className='font-bold underline'>
                        {"Forget Password?"}
                    </a>
                </div>

                <NormalButton
                    background_color='bg-soft-yellow'
                    text='Sign Up'
                    custom_className='mt-6'
                    is_submit={true}
                />

            </form>


            <p className='font-poppins text-base mt-4'>
                Don't have an account?
                <span>
                    {" "}
                    <a
                        href='/signup'
                        className='font-bold underline'>
                        {"Register"}
                    </a>
                </span>
            </p>
        </div>
    )
}

export default LoginForm
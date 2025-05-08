'use client'
import React, { useState } from 'react'
import axios from 'axios';
import { useRouter } from 'next/navigation';

import InputFormText from '../input/form/inputText'
import NormalButton from '../buttons/normalButton'

import { toast_message } from '@/utils/toast-utils';

function ForgetPasswordForm() {
    const [forgetPasswordEmail, setForgetPasswordEmail] = useState("");

    const router = useRouter();

    async function submitForgetPasswordForm(e) {
        e.preventDefault()
        try {
            const input_data = {
                email: forgetPasswordEmail
            }
            const response = await axios.post(process.env.NEXT_PUBLIC_BE_URL + "/auth/forget-password", input_data, {
                withCredentials: true
            })
            toast_message("Check your email for password change", false);
            router.replace("/login")
        } catch (error) {
            console.log(error)
            toast_message(error?.response?.data?.message ?? error.message, true);
        }
    }
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
            <form className='w-full' onSubmit={submitForgetPasswordForm}>
                <InputFormText 
                    input_type='email'
                    placeholder='example@gmail.com'
                    label_name='Enter your email address'
                    wrapper_classname="mt-6"
                    Input={forgetPasswordEmail}
                    SetInput={(data) => {
                        setForgetPasswordEmail(data)
                    }}

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
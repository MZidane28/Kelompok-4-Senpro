'use client'
import React, { useState } from 'react'
import axios from 'axios';
import { useRouter } from 'next/navigation';

import InputFormText from '../input/form/inputText'
import NormalButton from '../buttons/normalButton'

import { toast_message } from '@/utils/toast-utils';


function SignUpForm() {
    const [formSignup, SetFormSignup] = useState({
        username: "",
        email: "",
        password: ""
    })

    const router = useRouter();

    async function submitSignup(e) {
        e.preventDefault();
        try {
            const input_data = {
                email: formSignup.email,
                password: formSignup.password,
                username: formSignup.username
            }
            const response = await axios.post(process.env.NEXT_PUBLIC_BE_URL + "/auth/register", input_data, {
                withCredentials: true
            })
            toast_message(response.data.message, false);
            router.push('/email-verification')
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
                Sign Up for Free!
            </h1>
            <form className='w-full' onSubmit={submitSignup}>
                <InputFormText 
                    input_type='text'
                    placeholder='username'
                    label_name='Username'
                    wrapper_classname="mt-10"
                    Input={formSignup.username}
                    SetInput={(data) => {
                        SetFormSignup((old) => {
                            return {
                                ...old,
                                username: data
                            }
                        })
                    }}
                />
                <InputFormText 
                    input_type='email'
                    placeholder='example@gmail.com'
                    label_name='Email'
                    wrapper_classname="mt-6"
                    Input={formSignup.email}
                    SetInput={(data) => {
                        SetFormSignup((old) => {
                            return {
                                ...old,
                                email: data
                            }
                        })
                    }}

                />
                <InputFormText 
                    input_type='password'
                    placeholder='******'
                    label_name='Password'
                    wrapper_classname="mt-6"
                    Input={formSignup.password}
                    SetInput={(data) => {
                        SetFormSignup((old) => {
                            return {
                                ...old,
                                password: data
                            }
                        })
                    }}
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
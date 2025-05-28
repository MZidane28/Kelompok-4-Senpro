'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation';

import { ImCheckboxChecked } from "react-icons/im";
import { toast } from 'react-toastify';

import InputFormText from '../input/form/inputText'
import NormalButton from '../buttons/normalButton'

import { toast_message } from '@/utils/toast-utils';
import axios from 'axios';


function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isRememberMe, SetIsRememberMe] = useState(false)

    const router = useRouter();

    async function submitLogin(e) {
        e.preventDefault();
        try {
            const input_data = {
                username_or_email: email,
                password: password,
                rememberMe: isRememberMe
            }
            const response = await axios.post(process.env.NEXT_PUBLIC_BE_URL + "/auth/login", input_data, {
                withCredentials: true
            })
            toast_message(response.data.message, false);
            router.push('/')
        } catch (error) {
            console.log(error)
            toast_message(error?.response?.data?.message ?? error.message, true);
        }
    }

    async function is_already_login() {
        try {
            await axios.get(process.env.NEXT_PUBLIC_BE_URL + "/auth/ensure-user", {
                withCredentials: true
            })
            toast_message("Session detected", false)
            router.push("/")
        } catch (error) {
            return false
        }
    }

    useEffect(() => {
        // is_already_login()
    }, [])
    return (
        <div className='p-14 border-2 border-black rounded-xl
        flex flex-col items-center justify-center 
        max-w-[570px] w-full'>
            <h1 className='font-bold font-spaceGrotesk text-3xl'>
                Log In
            </h1>
            <form className='w-full' onSubmit={submitLogin}>
                <InputFormText
                    input_type='text'
                    placeholder='username or email'
                    label_name='Email'
                    wrapper_classname="mt-6"
                    Input={email}
                    SetInput={(data) => {
                        setEmail(data);
                    }}
                />
                <InputFormText
                    input_type='password'
                    placeholder='******'
                    label_name='Password'
                    wrapper_classname="mt-6"
                    Input={password}
                    SetInput={(data) => {
                        setPassword(data);
                    }}
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
                    text='Login'
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
'use client'
import React, { useState} from 'react'
import axios from 'axios';
import { useRouter } from 'next/navigation';

import InputFormText from '../input/form/inputText'
import NormalButton from '../buttons/normalButton'

import { toast_message } from '@/utils/toast-utils';
import { useSearchParams } from 'next/navigation'


function ChangePasswordForm() {
    const [newPasswordData, SetNewPasswordData] = useState({
        newPass : "",
        confirmPass: ""
    });

    const router = useRouter();
    const searchParams = useSearchParams()

    async function changePasswordForm(e) {
        e.preventDefault()
        if(!searchParams.get('token')) {
            toast_message("No token present", true)
            return
        }
        if(!searchParams.get('email')) {
            toast_message("No email present", true)
            return
        }
        if(!newPasswordData.confirmPass || !newPasswordData.newPass) {
            toast_message("Please fill out the form", true)
            return
        }
        if(newPasswordData.confirmPass != newPasswordData.newPass) {
            toast_message("Make sure confirmation password is the same as new password", true)
            return
        }
        try {
            const input_data = {
                token : searchParams.get('token'),
                email : searchParams.get('email'),
                new_password : newPasswordData.confirmPass
            }
            const response = await axios.post(process.env.NEXT_PUBLIC_BE_URL + "/auth/forget-password/change", input_data, {
                withCredentials: true
            })
            toast_message(response.data.message, false);
            router.push("/login")
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
                Change Your Password
            </h1>
            <p className='font-poppins text-base text-center mt-4'>
                Enter a new password below to change your password
            </p>
            <form className='w-full' onSubmit={changePasswordForm}>
                <InputFormText
                    input_type='password'
                    placeholder='***********'
                    label_name='New Password'
                    wrapper_classname="mt-6"
                    Input={newPasswordData.newPass}
                    SetInput={(data) => {
                        SetNewPasswordData((old) => {
                            return {
                                ...old,
                                newPass: data
                            }
                        })
                    }}

                />

                <InputFormText
                    input_type='password'
                    placeholder='***********'
                    label_name='Re-enter New Password'
                    wrapper_classname="mt-2"
                    Input={newPasswordData.confirmPass}
                    SetInput={(data) => {
                        SetNewPasswordData((old) => {
                            return {
                                ...old,
                                confirmPass: data
                            }
                        })
                    }}
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
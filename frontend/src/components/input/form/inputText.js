'use client'
import React, { useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { IoMdEye, IoMdEyeOff  } from "react-icons/io";


function InputFormText({
    SetInput=(data)=>{},
    Input="",
    placeholder="Placeholder",
    input_type="text",
    label_classname="",
    input_classname="",
    placeholder_classname="",
    label_name="Email",
    wrapper_classname=""

}) {
    const [isShowPassword, SetIsShowPassword] = useState(false)
    const handleToggle = () => {
        SetIsShowPassword(!isShowPassword)
    }
    if(input_type == "password") {
        return (
            <div className={twMerge(`w-full font-spaceGrotesk text-base flex flex-col gap-0 ${wrapper_classname}`,)}>
                <label htmlFor={label_name} className={twMerge('font-bold', label_classname)}>
                    {label_name}
                </label>
                <div className='flex mb-4'>
                    <input 
                        type={isShowPassword ? "text" : input_type}
                        value={Input}
                        onChange={(e) => SetInput(e.target.value)}
                        placeholder={placeholder}
                        className={twMerge('w-full border-2 border-black rounded-2xl py-1 px-3 placeholder:text-gray-600', input_classname, placeholder_classname)}
                        autoComplete='current-password'
                    />
                    <span className="flex justify-around items-center hover:cursor-pointer" onClick={(e) => handleToggle()}>
                        {
                            isShowPassword ?
                                    <IoMdEye className="absolute mr-10 w-6"/>
                                :
                                    <IoMdEyeOff className="absolute mr-10 w-6"/>
                        }
                    </span>
                </div>
                
            </div>
        )
    } else {
        return (
            <div className={twMerge(`w-full font-spaceGrotesk text-base flex flex-col gap-0`, wrapper_classname)}>
                <label htmlFor={label_name} className={twMerge('font-bold', label_classname)}>
                    {label_name}
                </label>
                <input 
                    type={input_type}
                    value={Input}
                    onChange={(e) => SetInput(e.target.value)}
                    placeholder={placeholder}
                    className={twMerge('w-full border-2 border-black rounded-2xl py-1 px-3 placeholder:text-gray-600', input_classname, placeholder_classname)}
                />
            </div>
        )
    }
    
}

export default InputFormText
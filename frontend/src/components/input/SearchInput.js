'use client'
import React from 'react'
import { twMerge } from 'tailwind-merge'
import { IoMdSearch } from "react-icons/io";

function SearchInput({
    SetInput = (data) => { },
    Input = "",
    label_classname = "",
    input_classname = "",
    placeholder_classname = "",
    label_name = "Email",
    wrapper_classname = ""

}) {

    return (
        <div className={twMerge(`w-full font-spaceGrotesk text-base flex flex-col gap-0 ${wrapper_classname}`)}>
            <div className="relative flex">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <IoMdSearch className="w-5 h-5 text-gray-600" />
                </span>

                <input
                    type="text"
                    value={Input}
                    placeholder='Search'
                    onChange={(e) => SetInput(e.target.value)}
                    className={twMerge(
                        'w-full border-2 border-black rounded-xl py-1 pl-10 pr-3 placeholder:text-gray-600',
                        input_classname,
                        placeholder_classname
                    )}
                />
            </div>
            
        </div>

    )

}

export default SearchInput
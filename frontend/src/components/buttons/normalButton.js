'use client'
import React from 'react'
import { twMerge } from 'tailwind-merge'


function NormalButton({
    is_submit= false,
    is_redirect=false,
    redirect_link="/",
    font_size="text=[20px]",
    background_color="bg-soft-yellow",
    custom_className="",
    width_className="w-full",
    text="Button",
    rounderCorner_className=" rounded-2xl",
    onClick=(e)=> {}
}) {
    if(is_redirect) {
        return (
            <a href={redirect_link}
                className={twMerge('py-1 font-spaceGrotesk border-2 font-bold border-black text-center', 
                    font_size, background_color, custom_className, width_className, rounderCorner_className)}
                onClick={onClick}
            >
                {text}
            </a >
        )
    } else {
        return (
            <button type={is_submit ? 'submit': 'button'}
                className={twMerge('py-1 font-spaceGrotesk border-2 font-bold border-black text-center', 
                    font_size, background_color, custom_className, width_className, rounderCorner_className)}
                onClick={onClick}
            >
                {text}
            </button >
        )
    }
    
}

export default NormalButton
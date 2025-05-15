'use client'
import React, { useEffect } from 'react'
import { useAnimatedText } from '../TextStreamAnimation'
import TypeIt from 'typeit-react';

function AIResponse({
    ai_response = ""
}) {

    if(ai_response?.length != 0 ) {
        return (
            <div className='w-full mt-10'>
                <p className='font-spaceGrotesk font-bold text-lg'>
                    AI Response
                </p>
                <TypeIt options={{ cursor: false , speed: 30, nextStringDelay: 100}}>{ai_response}</TypeIt>
            </div>
        )
    }
    return (
        <div className='w-full mt-10'>
            <p className='font-spaceGrotesk font-bold text-lg'>
                Lets generate a reply
            </p>
        </div>
    )
}

export default AIResponse
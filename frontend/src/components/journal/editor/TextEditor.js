import React from 'react'
import { twMerge } from 'tailwind-merge'
import { FaSadTear, FaMeh, FaGrinHearts, FaSmile } from "react-icons/fa";
import { FaFaceAngry } from "react-icons/fa6"
import NormalButton from '@/components/buttons/normalButton';


function TextEditor({
    text_value = "",
    onChangeEditor = (value) => {},
    mood = "",
    onChangeMood = (type) => {},
    onSave = () => {

    },
    onAIReader = () => {

    }
}) {
    return (
        <div className='w-full h-full flex flex-col'>

            <textarea className={
                twMerge('w-full min-h-[400px] mt-2'
                    , 'bg-floral-white'
                    , 'resize-none grow'
                    , 'outline-soft-yellow text-base'
                )

            }
                onChange={(e) => {
                        e.target.style.height = 'auto'; // Reset height
                        e.target.style.height = `${e.target.scrollHeight}px`; // Set to scroll height
                        onChangeEditor(e.target.value)
                    }
                }
                value={text_value}
            ></textarea>
            <div className='mt-4 w-full flex flex-row justify-between flex-none items-center sticky bottom-0'>
                <div className='font-spaceGrotesk font-semibold'>
                    <p>How do you feel?</p>
                    <div className='flex flex-row mt-2 gap-2 cursor-pointer hover:text-yellow-500'>
                        <FaGrinHearts 
                            className={twMerge('w-9 h-9cursor-pointer hover:text-yellow-500',
                                mood == "heart" ? 'text-yellow-500' : 'text-black'
                            )}  
                            onClick={(e) => onChangeMood('heart')}
                        />
                        <FaSmile
                            className={twMerge('w-9 h-9cursor-pointer hover:text-yellow-500',
                                mood == "happy" ? 'text-yellow-500' : 'text-black'
                            )} 
                            onClick={(e) => onChangeMood('happy')}
                        />
                        <FaMeh 
                            className={twMerge('w-9 h-9cursor-pointer hover:text-yellow-500',
                                mood == "normal" ? 'text-yellow-500' : 'text-black'
                            )}  
                            onClick={(e) => onChangeMood('normal')}
                        />
                        <FaFaceAngry 
                            className={twMerge('w-9 h-9cursor-pointer hover:text-yellow-500',
                                mood == "angry" ? 'text-yellow-500' : 'text-black'
                            )}  
                            onClick={(e) => onChangeMood('angry')}
                        />
                        <FaSadTear 
                            className={twMerge('w-9 h-9cursor-pointer hover:text-yellow-500',
                                mood == "sad" ? 'text-yellow-500' : 'text-black'
                            )} 
                            onClick={(e) => onChangeMood('sad')}

                        />
                    </div>
                </div>
                <div className='flex flex-row gap-2 min-w-[20%]'>
                    <NormalButton
                        background_color='bg-soft-yellow'
                        font_size='text-base'
                        is_submit={false}
                        is_redirect={false}
                        custom_className='font-bold text-sm h-fit py-2'
                        text='AI Reader'
                        onClick={onAIReader}
                    />
                    <NormalButton
                        background_color='bg-soft-yellow'
                        font_size='text-base'
                        is_submit={false}
                        is_redirect={false}
                        custom_className='font-bold text-sm h-fit py-2'
                        text='Save'
                        onClick={onSave}
                    />
                </div>
            </div>
        </div>
    )
}

export default TextEditor
'use client'
import React, { useState, useRef, useEffect } from 'react'
import { FaEdit, FaCheck } from 'react-icons/fa' // using react-icons
import { twMerge } from 'tailwind-merge'

function TitleChange({
    title = "",
    SetTitle = () => {}
}) {
    const [isEditing, setIsEditing] = useState(false)
    const spanRef = useRef(null)
    const inputRef = useRef(null)
    const [inputWidth, setInputWidth] = useState(`${title.length}ch`)

    useEffect(() => {
        if(inputRef.current) {
            if(isEditing == false) {
                inputRef.current.style.width = '0ch'
                setInputWidth('0ch')
            }
            else if(title.length < 1) {
                inputRef.current.style.width = inputRef.current.placeholder.length + 'ch'
                setInputWidth(inputRef.current.placeholder.length+'ch')
            }
            else if(title.length > 30) {
                inputRef.current.style.width = "30" + 'ch'
                setInputWidth("30" + 'ch')
            } 
            else {
                inputRef.current.style.width = title.length + 'ch'
                setInputWidth(title.length + 'ch')
            }
        }
    }, [title])

    const handleToggleEdit = () => {
        setIsEditing(prev => {
            if(prev == false) {
                    inputRef.current?.focus();
            } else {
            }
            return !prev
        })
        
    }

    const handleChange = (e) => {
        SetTitle(e.target.value)
    }

    return (
        <div className="flex items-center gap-2 max-w-[600px] text-ellipsis sticky top-0">
                    <input
                        type="text"
                        value={title}
                        onChange={handleChange}
                        className={twMerge(`none border-none outline-none bg-transparent underline
                            font-spaceGrotesk font-bold text-3xl`
                        )}
                        ref={inputRef}
                        style={{width: isEditing ? `${inputWidth}` : `0ch`}}
                        placeholder='New Title'
                    />
                <h2
                    className={twMerge('font-spaceGrotesk font-bold text-3xl truncate', isEditing ? "hidden" : "block", title ? "" : "text-gray-600")}
                >{title ? title : "Insert Title"}
                </h2>
            <span onClick={handleToggleEdit} className="text-black-500 flex-shrink-0">
                {isEditing ? <FaCheck /> : <FaEdit />}
            </span>
        </div>
    )
}

export default TitleChange

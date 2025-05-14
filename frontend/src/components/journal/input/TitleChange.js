'use client'
import React, { useState, useRef, useEffect } from 'react'
import { FaEdit, FaCheck } from 'react-icons/fa' // using react-icons

function TitleChange() {
    const [isEditing, setIsEditing] = useState(false)
    const [title, setTitle] = useState('My Title')
    const spanRef = useRef(null)
    const inputRef = useRef(null)
    const [inputWidth, setInputWidth] = useState(0)

    useEffect(() => {
        if (spanRef.current) {
            setInputWidth(spanRef.current.offsetWidth + 10) // extra padding
        }
    }, [title])

    const handleToggleEdit = () => {
        setIsEditing(prev => !prev)
    }

    const handleChange = (e) => {
        setTitle(e.target.value)
    }

    return (
        <div className="flex items-center gap-2">
            {isEditing ? (
                <>
                    <input
                        type="text"
                        value={title}
                        onChange={handleChange}
                        className="none border-none outline-none bg-transparent underline
                        font-spaceGrotesk font-bold text-3xl
                    "
                        ref={inputRef}
                        style={{ width: `${inputWidth}px` }}
                    />
                    <span
                        ref={spanRef}
                        className="invisible absolute whitespace-pre px-2"
                        style={{ fontSize: '1rem' }}
                    >
                        {title || ' '}
                    </span>
                </>

            ) : (
                <h2
                    className='font-spaceGrotesk font-bold text-3xl'
                >{title}
                </h2>
            )}
            <button onClick={handleToggleEdit} className="text-black-500">
                {isEditing ? <FaCheck /> : <FaEdit />}
            </button>
        </div>
    )
}

export default TitleChange

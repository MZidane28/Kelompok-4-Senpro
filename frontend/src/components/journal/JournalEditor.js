'use client'
import React, {useState} from 'react'
import TitleChange from './input/TitleChange'
import TextEditor from './editor/TextEditor';
import { useJournalContext } from '@/context/JournalContext';
import AIResponse from './input/AIResponse';

function JournalEditor() {
    const { setActiveInputJournal, active_input_journal, 
        saveJournal, RequestAIResponse, 
        selectedTitle, deleteJournal,
        
    } 
    = useJournalContext();

    function ChangeTitle(data) {
        setActiveInputJournal((old) => {
            old.title = data;
            return {...old}
        })
    }

    function ChangeText(text) {
        setActiveInputJournal((old) => {
            old.text = text;
            return {...old}
        })
    }

    function ChangeMood(value) {
        setActiveInputJournal((old) => {
            old.mood = value;
            return {...old}
        })
    }
    //console.log("JOURNAL :",active_input_journal)
    return (
        <div className='w-full flex flex-col items-center
            border-black border-2 rounded-3xl p-10 relative
        '>
            <TitleChange SetTitle={ChangeTitle} title={active_input_journal?.title}/>
            <TextEditor 
                onChangeEditor={ChangeText}
                text_value={active_input_journal?.text}
                onChangeMood={ChangeMood}
                mood={active_input_journal?.mood}
                onSave={() => saveJournal(active_input_journal)}
                onDelete={() => deleteJournal()}
                onAIReader={() => RequestAIResponse()}
                is_new={selectedTitle == null}
            />
            <AIResponse ai_response={active_input_journal?.ai_response}/>
        </div>
    )
}

export default JournalEditor
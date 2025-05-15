'use client'
import React, { createContext, useContext, useEffect, useState } from 'react';

import { dummy_journals } from '@/dummy/dummyJournal';

const JournalContext = createContext();


export const JournalProvider = ({ children }) => {
    const [userJournalList, SetUserJournalList] = useState([
        ...dummy_journals
    ])
    const [active_id, SetActiveID] = useState(2) // hapus pas deploy untuk dummy

    const [active_input_journal, setActiveInputJournal] = useState({
        mood: "",
        text: "",
        title: "",
        ai_response: "",
    })

    const [selectedTitle, SetSelectedTitle] = useState(null)
    const isSelected = () => {
        if (selectedTitle) {
            return true
        } else {
            return false
        }
    }

    const addNewJournals = (journal_data) => {
        SetSelectedTitle(null)
        setActiveInputJournal({
            mood: "",
            text: "",
            title: "",
            ai_response: "",
        })
    }

    const saveJournal = (new_data) => {
        if (selectedTitle) {
            SetUserJournalList((old) => {
                const search_user = old.find((data) => {
                    return data.id == selectedTitle
                })
                search_user.title = new_data.title;
                search_user.last_edited = new Date();
                search_user.text = new_data.text;
                search_user.mood = new_data.mood;

                return [...old]
            })
        } else {
            SetUserJournalList((old) => {
                const search_user = {
                    mood: "",
                    text: "",
                    title: "",
                }
                search_user.title = new_data.title;
                search_user.last_edited = new Date();
                search_user.text = new_data.text;
                search_user.mood = new_data.mood;
                search_user.id = search_user.id;

                SetActiveID(search_user.id + 1) // hapus pas deploy untuk dummy

                return [...old, search_user]
            })
        }

    }

    const SetJournalSelected = (id) => {
        SetSelectedTitle(id)
        const journal_data = userJournalList.find((data) => {
            return data.id == id
        })
        //console.log(journal_data)
        setActiveInputJournal({
            mood: journal_data.mood,
            text: journal_data.text,
            title: journal_data.title,
        })
    }

    const RequestAIResponse = (id) => {
        console.log("JALAN")
        setActiveInputJournal({
            ...active_input_journal,
            ai_response: "Hello there, are you feeling down. Lets go appreciate the sunshine today"
        })
        // update data di list
    }

    useEffect(() => {
        //console.log("ACTIVE:",active_input_journal)
    }, [active_input_journal])

    return (
        <JournalContext.Provider value={{
            userJournalList,
            isSelected,
            addNewJournals,
            saveJournal,
            SetJournalSelected,

            selectedTitle,

            setActiveInputJournal,
            active_input_journal,

            RequestAIResponse
        }}>
            {children}
        </JournalContext.Provider>
    );
};

// Custom hook for easy access
export const useJournalContext = () => useContext(JournalContext);

'use client'
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

import { useAuth } from './AuthContext';
import { toast_message } from '@/utils/toast-utils';

import { dummy_journals } from '@/dummy/dummyJournal';

const JournalContext = createContext();


export const JournalProvider = ({ children }) => {
    const router = useRouter();


    const [search, SetSearchbar] = useState("");
    const [is_new_response, SetIsNewResponse] = useState(false);
    const [userJournalList, SetUserJournalList] = useState([
    ])
    const userJournalListView = useMemo(() => {
        if (!search) {
            return userJournalList
        }

        return userJournalList.filter(journal => {
            // Define which fields to search
            const titleMatches = journal.journal_title.toLowerCase().includes(search);

            return titleMatches;
        });
    }, [userJournalList, search])

    const [staleList, SetStaleList] = useState(true)

    const [active_id, SetActiveID] = useState(2) // hapus pas deploy untuk dummy

    const { loading, user, fetchUser, ensureUser } = useAuth();

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

    const fetchJournalList = async () => {
        try {
            const response = await axios.get(process.env.NEXT_PUBLIC_BE_URL + "/journal/list", {
                withCredentials: true
            })
            const list_journals = response.data.list
            SetUserJournalList(list_journals);
        } catch (error) {
            console.log(error)
            toast_message(error?.response?.data?.message ?? error.message, true);
        } finally {
            SetStaleList(false)
        }
    }

    const saveJournal = async (new_data) => {

        try {
            if (selectedTitle) {
                // patch
                const body_data = {
                    "journal_title": new_data.title,
                    "journal_body": new_data.text,
                    "mood_level": new_data.mood
                }
                const response = await axios.patch(process.env.NEXT_PUBLIC_BE_URL + "/journal/session/" + selectedTitle, body_data, {
                    withCredentials: true
                })
                const updated_journal = response.data.updated_journal
                SetSelectedTitle(updated_journal.id)
                SetStaleList(true)
                toast_message(response.data.message, false);
            } else {
                // post
                const body_data = {
                    "journal_title": new_data.title,
                    "journal_body": new_data.text,
                    "mood_level": new_data.mood
                }
                const response = await axios.post(process.env.NEXT_PUBLIC_BE_URL + "/journal", body_data, {
                    withCredentials: true
                })
                const new_journal = response.data.new_journal
                SetSelectedTitle(new_journal.id)
                SetStaleList(true)
                toast_message(response.data.message, false);
            }
        } catch (error) {
            console.log(error)
            toast_message(error?.response?.data?.message ?? error.message, true);
        }

    }

    const deleteJournal = async () => {
        try {
            const response = await axios.delete(process.env.NEXT_PUBLIC_BE_URL + "/journal/session/" + selectedTitle, {
                withCredentials: true
            })
            SetStaleList(true)
            toast_message(response.data.message, false);
            SetSelectedTitle(null);
            setActiveInputJournal({
                mood: "",
                text: "",
                title: "",
                ai_response: "",
            })
        } catch (error) {
            console.log(error)
            toast_message(error?.response?.data?.message ?? error.message, true);
        }
    }

    const SetJournalSelected = async (id) => {
        SetSelectedTitle(id)
        try {
            const response = await axios.get(process.env.NEXT_PUBLIC_BE_URL + "/journal/session/" + id, {
                withCredentials: true
            })
            const data_journal = response.data.journal
            SetIsNewResponse(false)
            setActiveInputJournal({
                mood: data_journal.mood_level,
                text: data_journal.journal_body,
                title: data_journal.journal_title,
                ai_response: data_journal.ai_response
            })
        } catch (error) {
            SetSelectedTitle(null)
            console.log(error)
            toast_message(error?.response?.data?.message ?? error.message, true);
        }
    }

    const RequestAIResponse = async () => {
        if (selectedTitle == null) {
            return toast_message("Please save the journal first", true)
        }
        try {
            const response = await axios.get(process.env.NEXT_PUBLIC_BE_URL + "/journal/ai/" + selectedTitle, {
                withCredentials: true
            })
            console.log(response.data)
            const ai_response = response.data.ai_response
            const data_journal = response.data.journal
            SetIsNewResponse(true)
            setActiveInputJournal({
                ...active_input_journal,
                ai_response: ai_response
            })
            toast_message(response.data?.message, false);
            SetStaleList(true)
        } catch (error) {
            console.log(error)
            toast_message(error?.response?.data?.message ?? error.message, true);
        }
        // update data di list
    }

    useEffect(() => {
        //console.log("ACTIVE:",active_input_journal)
    }, [active_input_journal])

    // useEffect(() => {
    //     fetchUser()
    //     if(user == null && loading == false) {
    //         router.replace('/login')
    //     }
    // }, [])

    // if(loading) {
    //     return (
    //         <div className='min-h-screen w-full text-center align-middle
    //             font-spaceGrotesk font-bold text-2xl
    //         '>
    //             Loading...
    //         </div>
    //     )
    // }

    const handleEnsureUser = async () => {
        const validUser = await ensureUser();
        if (validUser == false) {
            router.replace('/')
        }
    }

    useEffect(() => {
        handleEnsureUser()
    }, [])

    useEffect(() => {
        fetchJournalList()
    }, [staleList])

    useEffect(() => {

    }, [search])
    return (
        <JournalContext.Provider value={{
            userJournalList,
            userJournalListView,

            search,
            SetSearchbar,

            isSelected,
            addNewJournals,
            saveJournal,
            deleteJournal,
            SetJournalSelected,
            RequestAIResponse,
            is_new_response,

            selectedTitle,

            setActiveInputJournal,
            active_input_journal,

            
        }}>
            {children}
        </JournalContext.Provider>
    );
};

// Custom hook for easy access
export const useJournalContext = () => useContext(JournalContext);

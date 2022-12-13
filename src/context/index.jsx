import React, { useReducer } from 'react'
import { createContext } from 'react'
import listReducer, { initialListState } from '../store/reducer'
import { getFromLocal, saveToLocal } from '../utils'

export const Context = createContext()

function AppProvider({ children }) {

    
    const localData = getFromLocal("data")
    if (!localData) {
        saveToLocal("data", initialListState)
    }

    
    const [initialData, dispatchList] = useReducer(listReducer, getFromLocal("data"))
    return (
        <Context.Provider value={{ initialData, dispatchList }}>
            {children}
        </Context.Provider>
    )
}

export default AppProvider
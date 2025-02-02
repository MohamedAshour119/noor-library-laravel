import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export const isSearchTriggeredSlice = createSlice({
    name: 'isSearchModalOpenSlice',
    initialState: {
        is_triggered: false,
    },
    reducers: {
        setIsSearchTriggered: (state, action: PayloadAction<boolean>) => {
            state.is_triggered = action.payload
        },
    },
})

export const {setIsSearchTriggered} = isSearchTriggeredSlice.actions
export default isSearchTriggeredSlice.reducer

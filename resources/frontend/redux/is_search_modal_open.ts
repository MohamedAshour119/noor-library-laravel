import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export const isSearchModalOpenSlice = createSlice({
    name: 'isSearchModalOpenSlice',
    initialState: {
        is_open: false,
    },
    reducers: {
        setIsSearchModalOpenSlice: (state, action: PayloadAction<boolean>) => {
            state.is_open = action.payload
        },
    },
})

export const {setIsSearchModalOpenSlice} = isSearchModalOpenSlice.actions
export default isSearchModalOpenSlice.reducer

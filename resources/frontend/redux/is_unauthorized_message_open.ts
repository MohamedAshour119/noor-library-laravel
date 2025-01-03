import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export const isUnauthorizedMessageOpenSlice = createSlice({
    name: 'isUnauthorizedMessageOpenSlice',
    initialState: {
        is_open: false,
    },
    reducers: {
        setIsUnauthorizedMessageOpenSlice: (state, action: PayloadAction<boolean>) => {
            state.is_open = action.payload
        },
    },
})

export const {setIsUnauthorizedMessageOpenSlice} = isUnauthorizedMessageOpenSlice.actions
export default isUnauthorizedMessageOpenSlice.reducer

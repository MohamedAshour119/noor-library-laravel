import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export const isAddToCartSidebarSlice = createSlice({
    name: 'isAddToCartSidebarSlice',
    initialState: {
        is_open: false,
    },
    reducers: {
        setIsAddToCartSidebarOpenSlice: (state, action: PayloadAction<boolean>) => {
            state.is_open = action.payload
        },
    },
})

export const {setIsAddToCartSidebarOpenSlice} = isAddToCartSidebarSlice.actions
export default isAddToCartSidebarSlice.reducer

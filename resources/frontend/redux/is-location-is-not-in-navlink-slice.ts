import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export const isLocationIsNotInNavlinkSlice = createSlice({
    name: 'check-is-location-is-not-in-navlink',
    initialState: false,
    reducers: {
        setActive: (_, action: PayloadAction<boolean>) => action.payload,
    },
})

export const {setActive} = isLocationIsNotInNavlinkSlice.actions
export default isLocationIsNotInNavlinkSlice.reducer

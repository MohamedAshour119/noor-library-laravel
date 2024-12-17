import {createSlice, PayloadAction} from "@reduxjs/toolkit";

type ProfileState = {
    personal_info: boolean
    reviews: boolean
};
export const usersProfileIsActiveSlice = createSlice({
    name: 'vendorsProfileIsActiveSlice',
    initialState: {
        personal_info: true,
        reviews: false,
    },
    reducers: {
        setVendorsActive: (state, action: PayloadAction<keyof ProfileState>) => {
            Object.keys(state).forEach((key) => {
                state[key as keyof ProfileState] = false;
            });

            state[action.payload] = true;
        },
    },
})

export const {setVendorsActive} = usersProfileIsActiveSlice.actions
export default usersProfileIsActiveSlice.reducer

import {createSlice, PayloadAction} from "@reduxjs/toolkit";

type ProfileState = {
    personal_info: boolean
    reviews: boolean
};

const initialState = {
    personal_info: true,
    reviews: false,
}
export const usersProfileIsActiveSlice = createSlice({
    name: 'vendorsProfileIsActiveSlice',
    initialState: initialState,
    reducers: {
        setVendorsActive: (state, action: PayloadAction<keyof ProfileState>) => {
            Object.keys(state).forEach((key) => {
                state[key as keyof ProfileState] = false;
            });

            state[action.payload] = true;
        },
        setResetVendorsActive: () => {
            return initialState
        }
    },
})

export const {setVendorsActive, setResetVendorsActive} = usersProfileIsActiveSlice.actions
export default usersProfileIsActiveSlice.reducer

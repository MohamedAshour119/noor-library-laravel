import {createSlice, PayloadAction} from "@reduxjs/toolkit";

type ProfileState = {
    books: boolean;
    reviews: boolean;
    purchased_books: boolean;
};
export const profileIsActiveSlice = createSlice({
    name: 'profileIsActiveSlice',
    initialState: {
        books: true,
        reviews: false,
        purchased_books: false
    },
    reducers: {
        setActive: (state, action: PayloadAction<keyof ProfileState>) => {
            Object.keys(state).forEach((key) => {
                state[key as keyof ProfileState] = false;
            });

            state[action.payload] = true;
        },
    },
})

export const {setActive} = profileIsActiveSlice.actions
export default profileIsActiveSlice.reducer
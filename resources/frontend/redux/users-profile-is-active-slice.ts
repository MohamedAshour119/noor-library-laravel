import {createSlice, PayloadAction} from "@reduxjs/toolkit";

type ProfileState = {
    personal_info: boolean;
    wishlist: boolean;
    order_history: boolean;
};
export const usersProfileIsActiveSlice = createSlice({
    name: 'usersProfileIsActiveSlice',
    initialState: {
        personal_info: true,
        wishlist: false,
        order_history: false
    },
    reducers: {
        setUsersActive: (state, action: PayloadAction<keyof ProfileState>) => {
            Object.keys(state).forEach((key) => {
                state[key as keyof ProfileState] = false;
            });

            state[action.payload] = true;
        },
    },
})

export const {setUsersActive} = usersProfileIsActiveSlice.actions
export default usersProfileIsActiveSlice.reducer

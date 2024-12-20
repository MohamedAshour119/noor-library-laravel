import {createSlice, PayloadAction} from "@reduxjs/toolkit";

type ProfileState = {
    personal_info: boolean;
    wishlist: boolean;
    order_history: boolean;
};

const initialState = {
    personal_info: true,
    wishlist: false,
    order_history: false
}
export const usersProfileIsActiveSlice = createSlice({
    name: 'usersProfileIsActiveSlice',
    initialState: initialState,
    reducers: {
        setUsersActive: (state, action: PayloadAction<keyof ProfileState>) => {
            Object.keys(state).forEach((key) => {
                state[key as keyof ProfileState] = false;
            });

            state[action.payload] = true;
        },
        setResetUsersActive: () => {
            return initialState
        }
    },
})

export const {setUsersActive, setResetUsersActive} = usersProfileIsActiveSlice.actions
export default usersProfileIsActiveSlice.reducer

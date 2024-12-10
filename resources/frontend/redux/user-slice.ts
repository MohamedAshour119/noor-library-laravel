import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {User} from "@/Interfaces";

const initialState: User = {
    id: null,
    username: null,
    email: null,
    createdAt: null,
    updatedAt: null,
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<User>) => {
            state.id = action.payload.id
            state.username = action.payload.username
            state.email = action.payload.email
            state.createdAt = action.payload.createdAt
            state.updatedAt = action.payload.updatedAt
        },
        clearUser: (state) => {
            state.id = null
            state.username = null
            state.email = null
            state.createdAt = null
            state.updatedAt = null
        },
    },
})

export const {setUser, clearUser} = userSlice.actions
export default userSlice.reducer
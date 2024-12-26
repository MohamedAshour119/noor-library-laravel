import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {User} from "../Interfaces";

const initialState: User = {
    id: null,
    username: null,
    first_name: '',
    last_name: '',
    phone: null,
    email: '',
    createdAt: null,
    updatedAt: null,
    is_vendor: null,
    avatar: '',
    wishlists_count: null,
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<User>) => {
            state.id = action.payload.id
            state.username = action.payload.username
            state.first_name = action.payload.first_name
            state.last_name = action.payload.last_name
            state.email = action.payload.email
            state.createdAt = action.payload.createdAt
            state.updatedAt = action.payload.updatedAt
            state.is_vendor = action.payload.is_vendor
            state.phone = action.payload.phone
            state.avatar = action.payload.avatar
            state.wishlists_count = action.payload.wishlists_count
        },
        clearUser: (state) => {
            state.id = null
            state.username = null
            state.first_name = ''
            state.last_name = ''
            state.email = ''
            state.createdAt = null
            state.updatedAt = null
            state.is_vendor = null
            state.phone = null
            state.avatar = ''
            state.wishlists_count = null
        },
    },
})

export const {setUser, clearUser} = userSlice.actions
export default userSlice.reducer

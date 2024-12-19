import { configureStore } from '@reduxjs/toolkit';
import userReducer from './user-slice'
import checkNavLinkActiveReducer from './is-location-is-not-in-navlink-slice'
import usersProfileIsActiveReducer from './users-profile-is-active-slice.ts'
import vendorsProfileIsActiveReducer from './vendors-profile-is-active-slice.ts'
import userProfileInfoReducer from './user-profile-info-slice.ts'
import storage from 'redux-persist/lib/storage'
import { persistReducer } from "redux-persist"
import { combineReducers } from '@reduxjs/toolkit'

const persistConfig = {
    key: 'root',
    version: 1,
    storage,
}

const reducer = combineReducers({
    user: userReducer,
    checkIsLocationIsNotInNavlinkSlice: checkNavLinkActiveReducer,
    usersProfileIsActiveReducer: usersProfileIsActiveReducer,
    vendorsProfileIsActiveReducer: vendorsProfileIsActiveReducer,
    userProfileInfoReducer: userProfileInfoReducer,
})

const persistedReducer = persistReducer(persistConfig, reducer)

const store = configureStore({
    reducer: persistedReducer
})

export type RootState = ReturnType<typeof store.getState>;
export default store

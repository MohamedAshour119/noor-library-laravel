import { configureStore } from '@reduxjs/toolkit';
import userReducer from './user-slice'
import checkNavLinkActiveReducer from './is-location-is-not-in-navlink-slice'
import profileIsActiveReducer from './profile-is-active-slice'

const store = configureStore({
    reducer: {
        user: userReducer,
        checkIsLocationIsNotInNavlinkSlice: checkNavLinkActiveReducer,
        profileIsActiveReducer: profileIsActiveReducer,
    }
})

export type RootState = ReturnType<typeof store.getState>;
export default store
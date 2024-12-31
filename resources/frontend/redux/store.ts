import { configureStore } from '@reduxjs/toolkit';
import userReducer from './user-slice'
import checkNavLinkActiveReducer from './is-location-is-not-in-navlink-slice'
import usersProfileIsActiveReducer from './users-profile-is-active-slice.ts'
import vendorsProfileIsActiveReducer from './vendors-profile-is-active-slice.ts'
import isVisitedUserSectionsActive from './is_visited_user_sections_active.ts'
import isVisitedVendorSectionsActive from './is_visited_vendor_sections_active.ts'
import userProfileInfoReducer from './user-profile-info-slice.ts'
import isSearchModalOpenReducer from './is_search_modal_open.ts'
import categoriesReducer from './categories-slice.ts'
import translationReducer from './translation-slice.ts'
import isTranslationTriggeredReducer from './is_translation_triggerd.ts'
import isAddToCartSidebarReducer from './is_add_to_card_sidebar_open.ts'
import storage from 'redux-persist/lib/storage'
import { persistReducer } from "redux-persist"
import { combineReducers } from '@reduxjs/toolkit'

const persistConfig = {
    key: 'root',
    version: 1,
    storage,
    blacklist: [
        'usersProfileIsActiveReducer',
        'vendorsProfileIsActiveReducer',
        'categoriesReducer',
        'isSearchModalOpenReducer',
        'isAddToCartSidebarReducer'
    ],
}

const reducer = combineReducers({
    user: userReducer,
    checkIsLocationIsNotInNavlinkSlice: checkNavLinkActiveReducer,
    usersProfileIsActiveReducer: usersProfileIsActiveReducer,
    vendorsProfileIsActiveReducer: vendorsProfileIsActiveReducer,
    userProfileInfoReducer: userProfileInfoReducer,
    isVisitedUserSectionsActive: isVisitedUserSectionsActive,
    isVisitedVendorSectionsActive: isVisitedVendorSectionsActive,
    categoriesReducer: categoriesReducer,
    isSearchModalOpenReducer: isSearchModalOpenReducer,
    translationReducer: translationReducer,
    isTranslationTriggeredReducer: isTranslationTriggeredReducer,
    isAddToCartSidebarReducer: isAddToCartSidebarReducer,
})

const persistedReducer = persistReducer(persistConfig, reducer)

const store = configureStore({
    reducer: persistedReducer
})

export type RootState = ReturnType<typeof store.getState>;
export default store

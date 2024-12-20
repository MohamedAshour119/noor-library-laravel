import {createSlice, PayloadAction} from "@reduxjs/toolkit";

type ProfileState = {
    wishlist: boolean;
    reviews: boolean;
};
export const isVisitedUserSectionsActiveSlice = createSlice({
    name: 'isVisitedUserSectionsActiveSlice',
    initialState: {
        wishlist: true,
        reviews: false
    },
    reducers: {
        setIsVisitedUserSectionsActive: (state, action: PayloadAction<keyof ProfileState>) => {
            Object.keys(state).forEach((key) => {
                state[key as keyof ProfileState] = false;
            });

            state[action.payload] = true;
        },
    },
})

export const {setIsVisitedUserSectionsActive} = isVisitedUserSectionsActiveSlice.actions
export default isVisitedUserSectionsActiveSlice.reducer

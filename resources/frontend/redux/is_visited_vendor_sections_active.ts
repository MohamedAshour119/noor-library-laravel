import {createSlice, PayloadAction} from "@reduxjs/toolkit";

type ProfileState = {
    books: boolean;
    reviews: boolean;
};
export const isVisitedVendorSectionsActiveSlice = createSlice({
    name: 'isVisitedVendorSectionsActiveSlice',
    initialState: {
        books: true,
        reviews: false
    },
    reducers: {
        setIsVisitedVendorSectionsActive: (state, action: PayloadAction<keyof ProfileState>) => {
            Object.keys(state).forEach((key) => {
                state[key as keyof ProfileState] = false;
            });

            state[action.payload] = true;
        },
    },
})

export const {setIsVisitedVendorSectionsActive} = isVisitedVendorSectionsActiveSlice.actions
export default isVisitedVendorSectionsActiveSlice.reducer

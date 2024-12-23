import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {CategoryInterface} from "../Interfaces";

const initialState: CategoryInterface[] = []
export const categoriesSlice = createSlice({
    name: "categories",
    initialState,
    reducers: {
        setCategories: (state, action: PayloadAction<CategoryInterface[]>) => {
            return [...state, ...action.payload]; // This updates the state by adding new categories
        },
        clearCategories: () => {
            return []; // This will clear the categories
        },
    },
});

export const {setCategories, clearCategories} = categoriesSlice.actions
export default categoriesSlice.reducer

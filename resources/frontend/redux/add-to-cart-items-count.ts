import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: number = 0;

export const addToCartItemsCountSlice = createSlice({
    name: "addToCartItem",
    initialState,
    reducers: {
        setAddToCartItemsCount: (_, action: PayloadAction<number>) => {
            return action.payload
        },
    },
});

export const { setAddToCartItemsCount } = addToCartItemsCountSlice.actions;
export default addToCartItemsCountSlice.reducer;

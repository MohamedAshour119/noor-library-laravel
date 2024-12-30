import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: Record<string, any> = {};

export const translationSlice = createSlice({
    name: "translation",
    initialState,
    reducers: {
        setTranslation: (_, action: PayloadAction<Record<string, any>>) => {
            return { ...action.payload }
        },
        clearTranslation: () => {
            return {}
        },
    },
});

export const { setTranslation, clearTranslation } = translationSlice.actions;
export default translationSlice.reducer;

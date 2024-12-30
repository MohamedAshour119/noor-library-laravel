import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: boolean = false;

export const isTranslationTriggeredSlice = createSlice({
    name: "translation",
    initialState,
    reducers: {
        setIsTranslationTriggered: (_, action: PayloadAction<boolean>) => {
            return action.payload
        },
    },
});

export const { setIsTranslationTriggered } = isTranslationTriggeredSlice.actions;
export default isTranslationTriggeredSlice.reducer;

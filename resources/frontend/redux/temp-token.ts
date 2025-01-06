import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: string = '';

export const tempTokenSlice = createSlice({
    name: "tempToken",
    initialState,
    reducers: {
        setTempToken: (_, action: PayloadAction<string>) => {
            return action.payload
        },
    },
});

export const { setTempToken } = tempTokenSlice.actions;
export default tempTokenSlice.reducer;

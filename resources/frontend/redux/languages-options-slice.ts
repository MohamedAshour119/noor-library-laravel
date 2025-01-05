import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {OtherBookOptions} from "../Interfaces";

const initialState: OtherBookOptions[] = [];

export const languagesOptionsSlice = createSlice({
    name: "languagesOptions",
    initialState,
    reducers: {
        setlanguagesOptionsSlice: (_, action: PayloadAction<OtherBookOptions[]>) => {
            return  [...action.payload ]
        },
    },
});

export const { setlanguagesOptionsSlice } = languagesOptionsSlice.actions;
export default languagesOptionsSlice.reducer;

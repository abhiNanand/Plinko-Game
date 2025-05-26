import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface Values {
  amount: number;
  rows: number;
}

const initialState: Values = {
  amount: 0,
  rows: 8,
};

const slice = createSlice({
  name: "game",
  initialState,
  reducers: {
    updateAmount(state, action: PayloadAction<number>) {
      state.amount = action.payload;
    },
    updateRows(state, action: PayloadAction<number>) {
      state.rows = action.payload;
    },
  },
});

export const {updateAmount,updateRows} = slice.actions;
export default slice.reducer;

 
 
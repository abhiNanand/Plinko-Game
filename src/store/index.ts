import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface Values {
  total: number;
  amount: number;
  rows: number;
}

const initialState: Values = {
  total: 1000,
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
    incrementTotalAmount(state,action:PayloadAction<number>) {
      state.total += action.payload;
    },
    decrementTotalAmont(state,action:PayloadAction<number>) {
      state.total -=action.payload;
    },
  },
});

export const {updateAmount,updateRows} = slice.actions;
export default slice.reducer;

 
 
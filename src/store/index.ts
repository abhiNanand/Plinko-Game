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
    updateRows(state, action: PayloadAction<number>) {
      state.rows = action.payload;
    },
    updateBetAmount(state,action:PayloadAction<number>){
      state.amount=action.payload;
    },
    incrementTotalAmount(state,action:PayloadAction<number>) {
      state.total += action.payload;
    },
    decrementTotalAmont(state,action:PayloadAction<number>) {
      state.total -=action.payload;
    },
  },
});

export const {updateRows,incrementTotalAmount,decrementTotalAmont,updateBetAmount} = slice.actions;
export default slice.reducer;

 
 
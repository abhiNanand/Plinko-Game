import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface Values {
  total: number;
  amount: number;
  rows: number;
  ballDropped: boolean;
}

const initialState: Values = {
  total: 1000,
  amount: 0,
  rows: 8,
  ballDropped:false,
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
    decrementTotalAmount(state,action:PayloadAction<number>) {
      state.total -=action.payload;
    },
    ballDropping(state,action:PayloadAction<boolean>){
      state.ballDropped=action.payload;
    },
  },
});

export const {updateRows,incrementTotalAmount,decrementTotalAmount,updateBetAmount,ballDropping} = slice.actions;
export default slice.reducer;

 
 
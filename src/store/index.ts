import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface Values {
  total: number;
  amount: number;
  rows: number;
  ballDropped: boolean;
  pointsIndex:number;
}

const initialState: Values = {
  total: 1000,
  amount: 0,
  rows: 8,
  ballDropped:false,
  pointsIndex: -1,
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
    updatePointsIndex(state,action:PayloadAction<number>){
      state.pointsIndex = action.payload;
    },
  },
});

export const {updateRows,incrementTotalAmount,decrementTotalAmount,updateBetAmount,ballDropping, updatePointsIndex} = slice.actions;
export default slice.reducer;

 
 
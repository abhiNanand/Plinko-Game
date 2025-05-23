// import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

// interface Values {
//   amount: number;
//   rows: number;
// }

// const initialState: Values = {
//   amount: 0,
//   rows: 8,
// };

// const slice = createSlice({
//   name: "game",
//   initialState,
//   reducers: {
//     updateAmount(state, action: PayloadAction<number>) {
//       state.amount = action.payload;
//     },
//     updateRows(state, action: PayloadAction<number>) {
//       state.rows = action.payload;
//     },
//   },
// });

// export const {updateAmount,updateRows} = slice.actions;
// export default slice.reducer;

// store/gameSlice.ts
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    amount: 0,
    rows: 8,
    ballPath: [],
    lastSlot: null,
    currentRow: -1,     
    currentPos: 0       
  };
  
  const gameSlice = createSlice({
    name: 'game',
    initialState,
    reducers: {
      updateAmount: (state, action) => {
        state.amount = action.payload;
      },
      updateRows: (state, action) => {
        state.rows = action.payload;
      },
      setBallPath: (state, action) => {
        state.ballPath = action.payload;
      },
      setLastSlot: (state, action) => {
        state.lastSlot = action.payload;
      },
      setBallPosition: (state, action) => {
        state.currentRow = action.payload.row;
        state.currentPos = action.payload.pos;
      },
      resetBall: (state) => {
        state.currentRow = -1;
        state.currentPos = 0;
        state.lastSlot = null;
        state.ballPath = [];
      }
    }
  });
  
  export const {
    updateAmount,
    updateRows,
    setBallPath,
    setLastSlot,
    setBallPosition,
    resetBall
  } = gameSlice.actions;
  
  export default gameSlice.reducer;
  

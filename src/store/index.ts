// src/store/index.ts
import { configureStore } from '@reduxjs/toolkit'
import backtestReducer    from './backtestSlice'

export const store = configureStore({
  reducer: {
    backtest: backtestReducer
  }
})

// These types are used in every component that reads from the store
export type RootState   = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
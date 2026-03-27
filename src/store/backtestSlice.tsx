// src/store/backtestSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// Async thunk — calls your backend and stores the result
export const runBacktest = createAsyncThunk(
  'backtest/run',
  async (payload: {
    symbol:      string
    startDate:   string
    endDate:     string
    capital:     number
    activeRules: string[]
    rulesConfig: object
    name?: string
  }) => {
    const response = await fetch('http://localhost:3000/backtest', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(payload)
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error)
    }

    return response.json()
  }
)

// Async thunk to save backtest results to database
export const saveBacktest = createAsyncThunk(
  'backtest/save',
  async (payload: {
    name: string
    symbol: string
    startDate: string
    endDate: string
    capital: number
    activeRules: string[]
    rulesConfig: object
  }) => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch('http://localhost:3000/api/backtests', {
      method:  'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body:    JSON.stringify(payload)
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to save backtest')
    }

    return response.json()
  }
)

// Async thunk to delete a backtest
export const deleteBacktest = createAsyncThunk(
  'backtest/delete',
  async (id: string) => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`http://localhost:3000/api/backtests/${id}`, {
      method:  'DELETE',
      headers: { 
        'Authorization': `Bearer ${token}`
      }
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to delete backtest')
    }

    return id; // Return the deleted backtest ID
  }
)

// Async thunk to fetch user's backtests
export const getUserBacktests = createAsyncThunk(
  'backtest/fetchUserBacktests',
  async (params?: {
    page?: number
    limit?: number
    symbol?: string
    verdict?: string
  }) => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required');
    }

    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.symbol) queryParams.append('symbol', params.symbol);
    if (params?.verdict) queryParams.append('verdict', params.verdict);

    const response = await fetch(`http://localhost:3000/api/backtests?${queryParams}`, {
      method:  'GET',
      headers: { 
        'Authorization': `Bearer ${token}`
      }
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to fetch backtests')
    }

    return response.json()
  }
)

interface BacktestState {
  data:    unknown | null
  loading: boolean
  error:   string | null
  saveLoading: boolean
  saveError: string | null
  userBacktests: any[]
  backtestsLoading: boolean
  backtestsError: string | null
  pagination: {
    currentPage: number
    totalPages: number
    totalBacktests: number
  } | null
}

const initialState: BacktestState = {
  data:    null,
  loading: false,
  error:   null,
  saveLoading: false,
  saveError: null,
  userBacktests: [],
  backtestsLoading: false,
  backtestsError: null,
  pagination: null
}

const backtestSlice = createSlice({
  name: 'backtest',
  initialState,
  reducers: {
    // Call this to clear results when user resets the form
    clearBacktest: (state) => {
      state.data    = null
      state.error   = null
      state.loading = false
    },
    clearSaveError: (state) => {
      state.saveError = null
    }
  },
  extraReducers: (builder) => {
    builder
      // Run backtest
      .addCase(runBacktest.pending, (state) => {
        state.loading = true
        state.error   = null
      })
      .addCase(runBacktest.fulfilled, (state, action) => {
        state.loading = false
        state.data    = action.payload
      })
      .addCase(runBacktest.rejected, (state, action) => {
        state.loading = false
        state.error   = action.error.message ?? 'Something went wrong'
      })
      // Save backtest
      .addCase(saveBacktest.pending, (state) => {
        state.saveLoading = true
        state.saveError = null
      })
      .addCase(saveBacktest.fulfilled, (state) => {
        state.saveLoading = false
      })
      .addCase(saveBacktest.rejected, (state, action) => {
        state.saveLoading = false
        state.saveError = action.error.message ?? 'Failed to save backtest'
      })
      // Get user backtests
      .addCase(getUserBacktests.pending, (state) => {
        state.backtestsLoading = true
        state.backtestsError = null
      })
      .addCase(getUserBacktests.fulfilled, (state, action) => {
        state.backtestsLoading = false
        state.userBacktests = action.payload.backtests
        state.pagination = action.payload.pagination
      })
      .addCase(getUserBacktests.rejected, (state, action) => {
        state.backtestsLoading = false
        state.backtestsError = action.error.message ?? 'Failed to fetch backtests'
      })
      // Delete backtest
      .addCase(deleteBacktest.pending, (state) => {
        // Could add a deleting state if needed
      })
      .addCase(deleteBacktest.fulfilled, (state, action) => {
        // Remove the deleted backtest from the list
        state.userBacktests = state.userBacktests.filter(bt => bt._id !== action.payload);
      })
      .addCase(deleteBacktest.rejected, (state, action) => {
        // Could add error handling for delete
      })
  }
})

export const { clearBacktest, clearSaveError } = backtestSlice.actions
export default backtestSlice.reducer
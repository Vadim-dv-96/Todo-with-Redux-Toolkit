import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import { authAPI } from '../api/todolist-api';
import { setIsLoggedInAC } from '../components/Login/auth-reducer';
import { handleAppError, handleNetworkError } from '../utils/error-utils';

export const initializeAppTC = createAsyncThunk('app/initializeApp', async (param, thunkAPI) => {
  thunkAPI.dispatch(setAppStatusAC({ status: 'loading' }));
  try {
    const res = await authAPI.me();
    if (res.data.resultCode === 0) {
      thunkAPI.dispatch(setIsLoggedInAC({ value: true }));
      thunkAPI.dispatch(setAppStatusAC({ status: 'succeeded' }));
    } else {
      handleAppError(thunkAPI.dispatch, res.data);
    }
  } catch (err) {
    const error: AxiosError = err as AxiosError;
    handleNetworkError(thunkAPI.dispatch, error.message);
  }
});

const initialState = {
  status: 'idle' as RequestStatusType,
  error: null as null | string,
  isInitialized: false,
};

const slice = createSlice({
  name: 'app',
  initialState: initialState,
  reducers: {
    setAppStatusAC(state, action: PayloadAction<{ status: RequestStatusType }>) {
      state.status = action.payload.status;
    },
    setErrorAC(state, action: PayloadAction<{ error: null | string }>) {
      state.error = action.payload.error;
    },
  },
  extraReducers(builder) {
    builder.addCase(initializeAppTC.fulfilled, (state) => {
      state.isInitialized = true;
    });
  },
});

export const appReducer = slice.reducer;
export const { setAppStatusAC, setErrorAC } = slice.actions;

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed';

import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import { authAPI, FieldsErrorsType, LoginParamsType } from '../../api/todolist-api';
import { setAppStatusAC } from '../../state/app-reducer';
import { handleAppError, handleNetworkError } from '../../utils/error-utils';

export const loginTC = createAsyncThunk<
  undefined,
  LoginParamsType,
  {
    rejectValue: { errors: Array<string>; fieldsErrors: Array<FieldsErrorsType> };
  }
>('auth/login', async (param, thunkAPI) => {
  thunkAPI.dispatch(setAppStatusAC({ status: 'loading' }));
  try {
    const res = await authAPI.login(param);
    if (res.data.resultCode === 0) {
      thunkAPI.dispatch(setAppStatusAC({ status: 'succeeded' }));
      return;
    } else {
      handleAppError(thunkAPI.dispatch, res.data);
      thunkAPI.dispatch(setAppStatusAC({ status: 'failed' }));
      return thunkAPI.rejectWithValue({ errors: res.data.messages, fieldsErrors: res.data.fieldsErrors });
    }
  } catch (err) {
    const error: AxiosError = err as AxiosError;
    handleNetworkError(thunkAPI.dispatch, error.message);
    return thunkAPI.rejectWithValue({ errors: [error.message], fieldsErrors: [] });
  }
});

export const logoutTC = createAsyncThunk('auth/logout', async (param, thunkAPI) => {
  thunkAPI.dispatch(setAppStatusAC({ status: 'loading' }));
  try {
    const res = await authAPI.logOut();
    if (res.data.resultCode === 0) {
      thunkAPI.dispatch(setAppStatusAC({ status: 'succeeded' }));
      return;
    } else {
      handleAppError(thunkAPI.dispatch, res.data);
      thunkAPI.dispatch(setAppStatusAC({ status: 'failed' }));
      return thunkAPI.rejectWithValue({});
    }
  } catch (err) {
    const error: AxiosError = err as AxiosError;
    handleNetworkError(thunkAPI.dispatch, error.message);
    return thunkAPI.rejectWithValue({});
  }
});

const sliceAuth = createSlice({
  name: 'auth',
  initialState: {
    isLoggedIn: false,
  },
  reducers: {
    setIsLoggedInAC(state, action: PayloadAction<{ value: boolean }>) {
      state.isLoggedIn = action.payload.value;
    },
  },
  extraReducers(builder) {
    builder.addCase(loginTC.fulfilled, (state) => {
      state.isLoggedIn = true;
    });
    builder.addCase(logoutTC.fulfilled, (state) => {
      state.isLoggedIn = false;
    });
  },
});

export const authReducer = sliceAuth.reducer;
export const { setIsLoggedInAC } = sliceAuth.actions;

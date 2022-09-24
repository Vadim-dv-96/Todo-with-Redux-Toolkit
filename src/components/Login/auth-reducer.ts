import { createSlice, Dispatch, PayloadAction } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import { authAPI, LoginParamsType } from '../../api/todolist-api';
import { setAppStatusAC } from '../../state/app-reducer';
import { handleAppError, handleNetworkError } from '../../utils/error-utils';

const initialState = {
  isLoggedIn: false,
};
// type InitialStateType = typeof initialState;

const sliceAuth = createSlice({
  name: 'auth',
  initialState: initialState,
  reducers: {
    setIsLoggedInAC(state, action: PayloadAction<{ value: boolean }>) {
      state.isLoggedIn = action.payload.value;
    },
  },
});

export const authReducer = sliceAuth.reducer;
export const { setIsLoggedInAC } = sliceAuth.actions;

// export const authReducer = (state: InitialStateType = initialState, action: AuthActionsType) => {
//   switch (action.type) {
//     case 'login/SET-IS-LOGGED-IN':
//       return { ...state, isLoggedIn: action.value };
//     default:
//       return state;
//   }
// };

// AC
// export const setIsLoggedInAC = (value: boolean) => {
//   return { type: 'login/SET-IS-LOGGED-IN', value } as const;
// };

// TC
export const loginTC = (loginPayload: LoginParamsType) => (dispatch: Dispatch) => {
  dispatch(setAppStatusAC({ status: 'loading' }));
  authAPI
    .login(loginPayload)
    .then((res) => {
      if (res.data.resultCode === 0) {
        dispatch(setIsLoggedInAC({ value: true }));
        dispatch(setAppStatusAC({ status: 'succeeded' }));
      } else {
        handleAppError(dispatch, res.data);
      }
      dispatch(setAppStatusAC({ status: 'failed' }));
    })
    .catch((err: AxiosError) => {
      handleNetworkError(dispatch, err.message);
    });
};
export const logoutTC = () => (dispatch: Dispatch) => {
  dispatch(setAppStatusAC({ status: 'loading' }));
  authAPI
    .logOut()
    .then((res) => {
      if (res.data.resultCode === 0) {
        dispatch(setIsLoggedInAC({ value: false }));
        dispatch(setAppStatusAC({ status: 'succeeded' }));
      } else {
        handleAppError(dispatch, res.data);
      }
      dispatch(setAppStatusAC({ status: 'failed' }));
    })
    .catch((err: AxiosError) => {
      handleNetworkError(dispatch, err.message);
    });
};

// types
// export type AuthActionsType = ReturnType<typeof setIsLoggedInAC>;

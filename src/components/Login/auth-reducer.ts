import { AxiosError } from 'axios';
import { authAPI, LoginParamsType } from '../../api/todolist-api';
import { setAppStatusAC } from '../../state/app-reducer';
import { AppThunk } from '../../state/store';
import { handleAppError, handleNetworkError } from '../../utils/error-utils';

const initialState = {
  isLoggedIn: false,
};
type InitialStateType = typeof initialState;

export const authReducer = (state: InitialStateType = initialState, action: AuthActionsType) => {
  switch (action.type) {
    case 'login/SET-IS-LOGGED-IN':
      return { ...state, isLoggedIn: action.value };
    default:
      return state;
  }
};

// AC
export const setIsLoggedInAC = (value: boolean) => {
  return { type: 'login/SET-IS-LOGGED-IN', value } as const;
};

// TC
export const loginTC =
  (loginPayload: LoginParamsType): AppThunk =>
  (dispatch) => {
    dispatch(setAppStatusAC('loading'));
    authAPI
      .login(loginPayload)
      .then((res) => {
        if (res.data.resultCode === 0) {
          dispatch(setIsLoggedInAC(true));
          dispatch(setAppStatusAC('succeeded'));
        } else {
          handleAppError(dispatch, res.data);
        }
        dispatch(setAppStatusAC('failed'));
      })
      .catch((err: AxiosError) => {
        handleNetworkError(dispatch, err.message);
      });
  };
export const logoutTC = (): AppThunk => (dispatch) => {
  dispatch(setAppStatusAC('loading'));
  authAPI
    .logOut()
    .then((res) => {
      if (res.data.resultCode === 0) {
        dispatch(setIsLoggedInAC(false));
        dispatch(setAppStatusAC('succeeded'));
      } else {
        handleAppError(dispatch, res.data);
      }
      dispatch(setAppStatusAC('failed'));
    })
    .catch((err: AxiosError) => {
      handleNetworkError(dispatch, err.message);
    });
};

// types
export type AuthActionsType = ReturnType<typeof setIsLoggedInAC>;

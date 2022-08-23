import { AxiosError } from 'axios';
import { authAPI } from '../api/todolist-api';
import { setIsLoggedInAC } from '../components/Login/auth-reducer';
import { handleAppError, handleNetworkError } from '../utils/error-utils';
import { AppThunk } from './store';

const initialState = {
  status: 'idle' as RequestStatusType,
  error: null as null | string,
  isInitialized: false,
};

export const appReducer = (state: InitialStateType = initialState, action: AppReducerActionType): InitialStateType => {
  switch (action.type) {
    case 'APP/SET-STATUS':
      return { ...state, status: action.status };

    case 'APP/SET-ERROR':
      return { ...state, error: action.error };

    case 'APP/SET-IS-INITIALIZED':
      return { ...state, isInitialized: action.isInitialized };

    default:
      return state;
  }
};

// Action Creator(AC)
export const setAppStatusAC = (status: RequestStatusType) => {
  return { type: 'APP/SET-STATUS', status } as const;
};
export const setErrorAC = (error: null | string) => {
  return { type: 'APP/SET-ERROR', error } as const;
};
export const setIsInitializedAC = (isInitialized: boolean) => {
  return { type: 'APP/SET-IS-INITIALIZED', isInitialized } as const;
};

// TC
export const initializeAppTC = (): AppThunk => (dispatch) => {
  dispatch(setAppStatusAC('loading'));
  authAPI
    .me()
    .then((res) => {
      if (res.data.resultCode === 0) {
        dispatch(setIsLoggedInAC(true));
        dispatch(setAppStatusAC('succeeded'));
      } else {
        handleAppError(dispatch, res.data);
      }
    })
    .catch((err: AxiosError) => {
      handleNetworkError(dispatch, err.message);
    })
    .finally(() => {
      dispatch(setIsInitializedAC(true));
    });
};

// types
type SetAppStatusActionType = ReturnType<typeof setAppStatusAC>;
type SetErrorActionType = ReturnType<typeof setErrorAC>;
type SetIsInitializedType = ReturnType<typeof setIsInitializedAC>;
export type AppReducerActionType = SetAppStatusActionType | SetErrorActionType | SetIsInitializedType;

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed';
type InitialStateType = typeof initialState;

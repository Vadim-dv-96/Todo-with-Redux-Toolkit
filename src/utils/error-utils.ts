import { BaseResponseType } from '../api/todolist-api';
// import { AppDispatch } from '../state/store';
import { Dispatch } from '@reduxjs/toolkit';
import { setAppStatusAC, setErrorAC } from '../state/app-reducer';

export const handleNetworkError = (dispatch: Dispatch, message: string) => {
  dispatch(setErrorAC({ error: message }));
  dispatch(setAppStatusAC({ status: 'failed' }));
};
export const handleAppError = <T>(dispatch: Dispatch, data: BaseResponseType<T>) => {
  if (data.messages.length) {
    dispatch(setErrorAC({ error: data.messages[0] }));
  } else {
    dispatch(setErrorAC({ error: 'Some Error' }));
  }
  dispatch(setAppStatusAC({ status: 'failed' }));
};

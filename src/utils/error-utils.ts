import { setErrorAC, setAppStatusAC } from '../api/app-reducer';
import { BaseResponseType } from '../api/todolist-api';
import { AppDispatch } from '../state/store';

export const handleNetworkError = (dispatch: AppDispatch, message: string) => {
  dispatch(setErrorAC(message));
  dispatch(setAppStatusAC('failed'));
};
export const handleAppError = <T>(dispatch: AppDispatch, data: BaseResponseType<T>) => {
  if (data.messages.length) {
    dispatch(setErrorAC(data.messages[0]));
  } else {
    dispatch(setErrorAC('Some Error'));
  }
  dispatch(setAppStatusAC('failed'));
};

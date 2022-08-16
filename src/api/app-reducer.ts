const initialState = {
  status: 'loading' as RequestStatusType,
  error: null as null | string,
};

export const appReducer = (state: InitialStateType = initialState, action: StatusAndErrorsActionType): InitialStateType => {
  switch (action.type) {
    case 'APP/SET-STATUS':
      return { ...state, status: action.status };

    case 'APP/SET-ERROR':
      return { ...state, error: action.error };

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
// types
type SetAppStatusActionType = ReturnType<typeof setAppStatusAC>;
type SetErrorActionType = ReturnType<typeof setErrorAC>;
export type StatusAndErrorsActionType = SetAppStatusActionType | SetErrorActionType;

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed';
type InitialStateType = typeof initialState;

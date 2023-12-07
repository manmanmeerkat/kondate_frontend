// src/store/actions.ts

export interface SetSelectedDateAction {
    type: 'SET_SELECTED_DATE';
    payload: Date;
  }
  
  export type Action = SetSelectedDateAction;
  
  export const setSelectedDate = (date: Date): SetSelectedDateAction => ({
    type: 'SET_SELECTED_DATE',
    payload: date,
  });
  
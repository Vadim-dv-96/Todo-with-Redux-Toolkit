import { TextField } from '@mui/material';
import React from 'react';
import { ChangeEvent, useState } from 'react';
import { RequestStatusType } from '../api/app-reducer';

export type EditableSpanPropsType = {
  value: string;
  onChange: (title: string) => void;
  entityStatus: RequestStatusType;
};

export const EditableSpan = React.memo((props: EditableSpanPropsType) => {
  const [editMode, setEditMode] = useState(false);
  const [title, setTitle] = useState('');

  const activateEditMode = () => {
    setEditMode(true);
    setTitle(props.value);
  };

  const activateViewMode = () => {
    setEditMode(false);
    props.onChange(title);
  };

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.currentTarget.value);
  };

  return editMode ? (
    <TextField
      disabled={props.entityStatus === 'loading'}
      color="secondary"
      variant="standard"
      size="small"
      value={title}
      onChange={onChangeHandler}
      autoFocus
      onBlur={activateViewMode}
    />
  ) : (
    <span onDoubleClick={activateEditMode}> {props.value} </span>
  );
});

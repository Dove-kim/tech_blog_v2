import React from 'react';
import './WriteActionButton.scss';

const WriteActionButton = ({ onSave, onDelete }) => {
  return (
    <div className="WriteActionButton">
      <button className="SubmitButton" onClick={onSave}>
        저장
      </button>

      <button className="SubmitButton" onClick={onDelete}>
        삭제
      </button>
    </div>
  );
};

export default WriteActionButton;

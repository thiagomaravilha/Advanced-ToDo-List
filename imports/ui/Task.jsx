import React from "react";
import { useNavigate } from "react-router-dom";

export const Task = ({ task, onCheckboxClick, onDeleteClick }) => {
  const navigate = useNavigate();
  return (
    <li>
      <input
        type="checkbox"
        checked={!!task.isChecked}
        onClick={() => onCheckboxClick(task)}
        readOnly
      />
      <span>{task.text}</span>
      <button onClick={() => onDeleteClick(task)}>&times;</button>
      <button onClick={() => navigate(`/tasks/edit/${task._id}`)}>Edit</button>
    </li>
  );
};
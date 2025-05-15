import React from "react";
import { useNavigate } from "react-router-dom";
import { Meteor } from "meteor/meteor";

export const Task = ({ task, onCheckboxClick, onDeleteClick }) => {
  const navigate = useNavigate();
  const currentUserId = Meteor.userId();

  return (
    <li>
      <input
        type="checkbox"
        checked={!!task.isChecked}
        onClick={() => onCheckboxClick(task)}
        readOnly
      />
      <span>{task.text}</span>

      {/* Botão de Excluir - só aparece se o usuário atual criou a tarefa */}
      {task.userId === currentUserId && (
        <button onClick={() => onDeleteClick(task)}>&times;</button>
      )}

      {/* Botão de Editar - só aparece se o usuário atual criou a tarefa */}
      {task.userId === currentUserId && (
        <button onClick={() => navigate(`/tasks/edit/${task._id}`)}>Edit</button>
      )}
    </li>
  );
};
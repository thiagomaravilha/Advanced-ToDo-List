import React, { Fragment, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useTracker, useSubscribe } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { TasksCollection } from '/imports/api/TasksCollection';
import { TaskForm } from './TaskForm';
import { LoginForm } from './LoginForm';
import { WelcomeScreen } from './WelcomeScreen';
import { EditTask } from './EditTask';

export const App = () => {
  // Assinatura para usuários
  const isUsersLoading = useSubscribe("users");
  
  // Assinatura para tarefas
  const isTasksLoading = useSubscribe("tasks");
  
  const user = useTracker(() => Meteor.user());
  const [hideCompleted, setHideCompleted] = useState(false);

  const hideCompletedFilter = { isChecked: { $ne: true } };
  const tasks = useTracker(() => {
    if (!user) return [];
    return TasksCollection.find(
      hideCompleted ? hideCompletedFilter : {},
      { sort: { createdAt: -1 } }
    ).fetch();
  });

  const pendingTasksCount = useTracker(() => {
    if (!user) return 0;
    return TasksCollection.find({ isChecked: { $ne: true } }).count();
  });

  const handleToggleChecked = ({ _id, isChecked }) =>
    Meteor.callAsync("tasks.toggleChecked", { _id, isChecked });

  const handleDelete = ({ _id }) =>
    Meteor.callAsync("tasks.delete", { _id });

  const logout = () => Meteor.logout();

  const pendingTasksTitle = pendingTasksCount ? ` (${pendingTasksCount})` : '';

  if (isUsersLoading() || isTasksLoading()) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={!user ? <LoginForm /> : <Navigate to="/welcome" />} />
        <Route path="/welcome" element={user ? <WelcomeScreen /> : <Navigate to="/" />} />
        <Route
          path="/tasks"
          element={
            user ? (
              <div className="app">
                <header>
                  <div className="app-bar">
                    <div className="app-header">
                      <h1>📝 To Do List{pendingTasksTitle}</h1>
                    </div>
                  </div>
                </header>
                <div className="main">
                  <Fragment>
                    <div className="user" onClick={logout}>
                      <span className="username">{user.username}</span>
                      <span className="logout-text">🔓 Sair</span>
                    </div>
                    <TaskForm
                      tasks={tasks}
                      onCheckboxClick={handleToggleChecked}
                      onDeleteClick={handleDelete}
                    />
                    <div className="filter">
                      <button onClick={() => setHideCompleted(!hideCompleted)}>
                        {hideCompleted ? 'Show All' : 'Hide Completed'}
                      </button>
                    </div>
                  </Fragment>
                </div>
              </div>
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/tasks/edit/:id"
          element={
            user ? <EditTask /> : <Navigate to="/" />
          }
        />
      </Routes>
    </Router>
  );
};
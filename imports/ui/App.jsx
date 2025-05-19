import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useTracker, useSubscribe } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { TasksCollection } from '/imports/api/TasksCollection';
import { TaskForm } from './TaskForm';
import { LoginForm } from './LoginForm';
import { WelcomeScreen } from './WelcomeScreen';
import { EditTask } from './EditTask';
import UserProfile from './UserProfile';
import { AppDrawer } from './AppDrawer';

export const App = () => {
  const isUsersLoading = useSubscribe("users");
  const isTasksLoading = useSubscribe("tasks");
  const user = useTracker(() => Meteor.user());
  const [hideCompleted, setHideCompleted] = useState(false);

  const hideCompletedFilter = { status: { $ne: "Concluída" } };
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

  const handleDelete = async ({ _id }) => {
    const confirmDelete = window.confirm("Tem certeza que deseja excluir esta tarefa?");
    if (!confirmDelete) return;

    try {
      await Meteor.callAsync("tasks.delete", { _id });
    } catch (error) {
      if (error?.error === "not-authorized") {
        alert("Você não tem permissão para excluir esta tarefa.");
      } else {
        alert(error.reason || "Erro ao excluir a tarefa.");
      }
    }
  };

  const logout = () => Meteor.logout();

  if (isUsersLoading() || isTasksLoading()) {
    return <div>Loading...</div>;
  }

  // Rotas protegidas dentro do Drawer
  const AuthenticatedRoutes = () => (
    <AppDrawer>
      <Routes>
        <Route path="/welcome" element={<WelcomeScreen />} />
        <Route
          path="/tasks"
          element={
            <div className="main">
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
            </div>
          }
        />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/tasks/edit/:id" element={<EditTask />} />
        <Route path="*" element={<Navigate to="/welcome" />} />
      </Routes>
    </AppDrawer>
  );

  return (
    <Router>
      <Routes>
        <Route path="/" element={!user ? <LoginForm /> : <Navigate to="/welcome" />} />
        <Route path="/*" element={user ? <AuthenticatedRoutes /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
};
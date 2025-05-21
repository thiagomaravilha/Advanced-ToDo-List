import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useTracker, useSubscribe } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { ReactiveVar } from 'meteor/reactive-var';

import { TasksCollection } from '/imports/api/TasksCollection';
import { TaskForm } from './TaskForm';
import { LoginForm } from './LoginForm';
import { WelcomeScreen } from './WelcomeScreen';
import { EditTask } from './EditTask';
import UserProfile from './UserProfile';
import { AppDrawer } from './AppDrawer';

// Estado reativo global
const showCompletedVar = new ReactiveVar(true);

export const App = () => {
  const user = useTracker(() => Meteor.user());

  const showCompleted = useTracker(() => showCompletedVar.get());

  const isUsersLoading = useSubscribe("users");
  const isTasksLoading = useSubscribe("tasks.filtered", showCompleted);

  const tasks = useTracker(() => {
    if (!user) return [];
    return TasksCollection.find({}, { sort: { createdAt: -1 } }).fetch();
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
              <div className="filter" style={{ marginTop: "12px" }}>
                <label>
                  <input
                    type="checkbox"
                    checked={showCompleted}
                    onChange={() => showCompletedVar.set(!showCompleted)}
                  />{" "}
                  Mostrar tarefas concluídas
                </label>
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

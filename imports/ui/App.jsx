import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useTracker, useSubscribe } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { ReactiveVar } from 'meteor/reactive-var';

import { TasksCollection } from '/imports/api/TasksCollection';
import { TaskForm } from './TaskForm';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
import { WelcomeScreen } from './WelcomeScreen';
import { EditTask } from './EditTask';
import UserProfile from './UserProfile';
import { AppDrawer } from './AppDrawer';
import '/client/base.css';
import '/client/layout.css';

const showCompletedVar = new ReactiveVar(true);
const searchTextVar = new ReactiveVar("");
const currentPageVar = new ReactiveVar(1);

export const App = () => {
  const user = useTracker(() => Meteor.user());

  const showCompleted = useTracker(() => showCompletedVar.get());
  const searchText = useTracker(() => searchTextVar.get());
  const currentPage = useTracker(() => currentPageVar.get());

  const isUsersLoading = useSubscribe("users");
  const isTasksLoading = useSubscribe("tasks.filteredWithSearch", showCompleted, searchText, currentPage);

  const tasks = useTracker(() => {
    if (!user) return [];
    return TasksCollection.find({}, { sort: { createdAt: -1 } }).fetch();
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

  const AuthenticatedRoutes = () => {
    const [localSearch, setLocalSearch] = React.useState("");

    return (
      <AppDrawer>
        <Routes>
          <Route path="/welcome" element={<WelcomeScreen />} />
          <Route
            path="/tasks"
            element={
              <div className="main">
                <div className="task-filter-container">
                  <div className="task-filter-checkbox">
                    <label>
                      <input
                        type="checkbox"
                        checked={showCompleted}
                        onChange={() => {
                          showCompletedVar.set(!showCompleted);
                          currentPageVar.set(1);
                        }}
                      />
                      Mostrar tarefas concluídas
                    </label>
                  </div>

                  <div className="task-search-group">
                    <input
                      type="text"
                      placeholder="Buscar por nome da tarefa..."
                      value={localSearch}
                      onChange={(e) => setLocalSearch(e.target.value)}
                      className="task-search-input"
                    />
                    <button
                      onClick={() => {
                        searchTextVar.set(localSearch);
                        currentPageVar.set(1);
                      }}
                      className="task-search-button"
                    >
                      Buscar
                    </button>
                  </div>
                </div>

                <TaskForm
                  tasks={tasks}
                  onCheckboxClick={handleToggleChecked}
                  onDeleteClick={handleDelete}
                />

                <div className="pagination-controls">
                  <button
                    disabled={currentPage <= 1}
                    onClick={() => currentPageVar.set(currentPage - 1)}
                  >
                    Página Anterior
                  </button>
                  <span>Página {currentPage}</span>
                  <button
                    disabled={tasks.length < 4}
                    onClick={() => currentPageVar.set(currentPage + 1)}
                  >
                    Próxima Página
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
  };

  if (isUsersLoading() || isTasksLoading()) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Routes>
  
        <Route path="/" element={!user ? <LoginForm /> : <Navigate to="/welcome" />} />
        <Route path="/register" element={!user ? <RegisterForm /> : <Navigate to="/welcome" />} />

        <Route path="/*" element={user ? <AuthenticatedRoutes /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
};
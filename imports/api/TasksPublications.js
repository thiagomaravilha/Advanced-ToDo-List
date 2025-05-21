import { Meteor } from 'meteor/meteor';
import { TasksCollection } from './TasksCollection';

Meteor.publish("tasks.filteredWithSearch", function (showCompleted, searchText) {
  if (!this.userId) {
    return this.ready();
  }

  const regex = new RegExp(searchText, 'i'); // Busca insensível a maiúsculas/minúsculas

  const filter = {
    $or: [
      { userId: this.userId },              // Tarefas do usuário logado
      { isPrivate: { $ne: true } }          // Tarefas públicas
    ],
    text: regex
  };

  if (!showCompleted) {
    filter.status = { $in: ["Cadastrada", "Em Andamento"] };
  }

  return TasksCollection.find(filter, {
    sort: { createdAt: -1 }
  });
});

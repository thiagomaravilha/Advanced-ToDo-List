import { Meteor } from "meteor/meteor";
import { TasksCollection } from "./TasksCollection";

Meteor.methods({
  // Inserir tarefa
  "tasks.insert": async function (doc) {
    if (!this.userId) {
      throw new Meteor.Error("not-authorized", "Você precisa estar autenticado para criar uma tarefa.");
    }

    return TasksCollection.insertAsync({
      ...doc,
      userId: this.userId,
      status: "Cadastrada",
      createdAt: new Date(),
    });
  },

  // Alternar checkbox
  "tasks.toggleChecked": async function ({ _id, isChecked }) {
    if (!this.userId) throw new Meteor.Error("not-authorized");

    const task = await TasksCollection.findOneAsync({ _id });
    if (!task) throw new Meteor.Error("task-not-found");
    if (task.userId !== this.userId) throw new Meteor.Error("not-authorized");

    return TasksCollection.updateAsync(_id, {
      $set: { isChecked: !isChecked },
    });
  },

  // Excluir tarefa
  "tasks.delete": async function ({ _id }) {
    if (!this.userId) throw new Meteor.Error("not-authorized");

    const task = await TasksCollection.findOneAsync({ _id });
    if (!task) throw new Meteor.Error("task-not-found");
    if (task.userId !== this.userId) throw new Meteor.Error("not-authorized");

    return TasksCollection.removeAsync(_id);
  },

  // Atualizar tarefa (nome, descrição, status)
  "tasks.update": async function ({ _id, name, description, status }) {
    if (!this.userId) throw new Meteor.Error("not-authorized");

    const task = await TasksCollection.findOneAsync({ _id });
    if (!task) throw new Meteor.Error("task-not-found");
    if (task.userId !== this.userId) throw new Meteor.Error("not-authorized");

    return TasksCollection.updateAsync(_id, {
      $set: {
        text: name || task.text,
        description: description || task.description,
        status: status || task.status,
        updatedAt: new Date(),
      },
    });
  },
});
